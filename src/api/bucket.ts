import { Response } from 'node-fetch'
import APIClient, { calculateAPIReset, getAPIOffset } from "./client";
import Queue from "./queue";
import APIRequest from "./request";

export default class Bucket {
  client: APIClient
  queue: Queue = new Queue()
  name: string
  reset: number = -1
  remaining: number = Infinity
  limit: number = Infinity
  retryAfter: number = -1

  constructor (client: APIClient, name: string) {
    this.client = client
    this.name = name
  }

  get globalLimited (): boolean {
    return this.client.globalRemaining <= 0
      && this.client.globalReset !== undefined
      && Date.now() < this.client.globalReset
  }

  get localLimited (): boolean {
    return this.remaining <= 0 && Date.now() < this.reset
  }

  get limited (): boolean {
    return this.globalLimited || this.localLimited
  }

  async globalDelayFor (ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.client.globalDelay = undefined
        resolve()
      }, ms)
    })
  }

  async awaitRatelimit() {
    // If a promis already exists for the global ratelimit,
    // return that instead as we don't want to create multiple promises.
    if (this.client.globalDelay) {
      return this.client.globalDelay
    }

    if (!this.globalLimited) {
      return new Promise(resolve => setTimeout(resolve, this.reset - Date.now()))
    }

    if (this.globalLimited) {
      this.client.globalDelay = this.globalDelayFor((this.client.globalReset ?? 0) + 100 - Date.now())
      return this.client.globalDelay
    }

    // Unhandled ratelimit reason
    return Promise.resolve()
  }

  async push (request: APIRequest): Promise<object | Buffer | undefined> {
    await this.queue.wait()
    try {
      const res = await this.execute(request)
      return res
    } catch (e) {
      throw e
    } finally {
      this.queue.shift()
    }
  }

  async execute (request: APIRequest): Promise<object | Buffer | undefined> {
    // Wait for the current ratelimit to resolve
    while (this.limited) {
      await this.awaitRatelimit()
    }

    // As the request goes out, update the global usage information
    if (!this.client.globalReset || this.client.globalReset < Date.now()) {
      this.client.globalReset = Date.now() + 1000
      this.client.globalRemaining = this.client.globalLimit
    }
    this.client.globalRemaining--

    const retryRequest = (error: any) => {
      if (request.retries === 3) {
        throw new Error(`Error [${request.method}] ${request.path}\n\t${error.message}`)
      }
      request.retries++
      return this.execute(request)
    }

    // Perform the request
    let res: Response
    try {
      res = await request.execute()
    } catch (error) {
      return retryRequest(error)
    }

    if (res?.headers) {
      const serverDate = res.headers.get('date') ?? new Date().toString()
      const limit = res.headers.get('x-ratelimit-limit')
      const remaining = res.headers.get('x-ratelimit-remaining')
      const reset = res.headers.get('x-ratelimit-reset')

      // Update ratelimit usage
      this.limit = limit ? Number(limit) : Infinity
      this.remaining = remaining ? Number(remaining) : 1
      this.reset = reset ? calculateAPIReset(reset, serverDate) : Date.now()

      // https://github.com/discordapp/discord-api-docs/issues/182
      if (request.route.includes('reactions')) {
        this.reset = new Date(serverDate).getTime() - getAPIOffset(serverDate) + 250
      }

      // Handle retryAfter, which means we somehow hit a rate limit
      const retryAfter = res.headers.get('retry-after') ? Number(res.headers.get('retry-after')) * 1000 : -1
      if (retryAfter > 0) {
        // If the global ratelimit header is set, we hit the global rate limit (uh oh)
        if (res.headers.get('x-ratelimit-global')) {
          this.client.globalRemaining = 0
          this.client.globalReset = Date.now() + retryAfter
        }
        // Wait then retry the request
        await new Promise(pr => setTimeout(pr, retryAfter))
        return retryRequest({ message: 'ratelimit hit' })
      }

      if (res.ok) {
        // Request succeeded, continue with the next one
        if (res.headers.get('content-type')?.startsWith('application/json')) return res.json()
        return res.buffer()
      }

      // We did something wrong apparently
      if (res.status >= 400 && res.status < 500) {
        // Ratelimited, retry
        if (res.status === 429) {
          return retryRequest({ message: 'unexpected ratelimit encountered' })
        }
        // Throw an error with the error recieved from the API
        const data = res.headers.get('content-type')?.startsWith('application/json') ? await res.json() : { message: 'Error was not JSON encoded.', code: 0 }
        throw new Error(`Error [${request.method}] ${res.status} ${request.path}\n${JSON.stringify(data, null, 2)}`)
      }
    }
  }
}