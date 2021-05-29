import fetch, { Response } from 'node-fetch'
import { GatewayURI } from './api'
import { Method } from './client'

export default class APIRequest {
  path: string
  route: string
  method: Method
  headers: { [key: string]: string }
  body?: object
  retries: number = 0

  constructor ({path, method, headers, body}: {path: string, method: Method, headers?:  { [key: string]: string }, body?: object}) {
    this.path = path
    this.route = APIRequest.pathToRoute(path)
    this.method = method
    this.headers = headers ?? {}
    this.body = body
  }

  static pathToRoute (path: string): string {
    const parts = path.split('/')
    const route = []
    for (let i = 0; i < parts.length; i++) {
      // Reaction routes share the same bucket
      if (parts[i - 1] === 'reactions') break
      // Replace all non major IDs with :id
      if (/\d{16,19}/g.test(parts[i]) && !/channels|guilds/.test(parts[i - 1])) {
        route.push(':id')
      } else {
        route.push(parts[i])
      }
    }
    return route.join('/')
  }

  async execute (): Promise<Response> {
    let body
    const headers = { ...this.headers }
    if (this.body) {
      body = JSON.stringify(this.body)
      headers['content-type'] = 'application/json'
    }
    return fetch(`${GatewayURI}${this.path}`, {
      headers: Object.keys(headers).map((key: string) => ([key, headers[key]])),
      method: this.method,
      body
    })
  }
}
