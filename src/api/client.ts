import APIRequest from "./request"

export enum Method {
  get = 'GET',
  put = 'PUT',
  post = 'POST',
  delete = 'DELETE',
  patch = 'PATCH'
}

class APIClient {
  authorization: string
  globalLimit: number = 50
  globalRemaining: number = this.globalLimit
  globalReset: number|undefined
  globalDelay: Promise<void>|undefined

  constructor (token: string) {
    this.authorization = `Bot ${token}`
  }

  async enqueue (request: APIRequest): Promise<object | Buffer | undefined> {
    // TOOD: implement buckets
    return
  }

  async get (path: string): Promise<object | Buffer | undefined> {
    return this.enqueue(new APIRequest({
      path,
      method: Method.get,
      headers: { authorization: this.authorization }
    }))
  }

  async put (path: string): Promise<object | Buffer | undefined> {
    return this.enqueue(new APIRequest({
      path,
      method: Method.put,
      headers: { authorization: this.authorization }
    }))
  }

  async post (path: string, body: any): Promise<object | Buffer | undefined> {
    return this.enqueue(new APIRequest({
      path,
      method: Method.post,
      headers: { authorization: this.authorization },
      body
    }))
  }

  async patch (path: string, body: any): Promise<object | Buffer | undefined> {
    return this.enqueue(new APIRequest({
      path,
      method: Method.patch,
      headers: { authorization: this.authorization },
      body
    }))
  }

  async delete (path: string): Promise<object | Buffer | undefined> {
    return this.enqueue(new APIRequest({
      path,
      method: Method.delete,
      headers: { authorization: this.authorization }
    }))
  }
}

export default APIClient