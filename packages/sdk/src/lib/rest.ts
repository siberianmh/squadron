import { URL } from 'url'
import type { RequestInit } from 'node-fetch'
import fetch from 'node-fetch'
import { Squadron } from '../index'

export class Rest {
  private squadron: Squadron

  public constructor(squadron: Squadron) {
    this.squadron = squadron
  }

  public host: string

  private async request<T = any>(
    path: string,
    options: RequestInit,
  ): Promise<T> {
    try {
      const url = new URL(`${this.squadron.options.host}/${path}`)

      const response = await fetch(url, {
        headers: {
          'user-agent':
            'Squadron SDK (Version 0.0.0) - https://github.com/siberianmh/squadron',
          Authorization: `Bearer ${this.squadron.options.token}`,
        },
        ...options,
      })

      if (!response.ok) {
        switch (response.status) {
          case 500:
          default:
            console.warn(
              `[ERROR]: The url [${
                options.method ?? 'GET'
              }] ${url.toString()} returned a status code ${
                response.status
              }\n\n${await response.text()}`,
            )
        }
      }

      let body
      if (response.headers.get('content-type')?.includes('application/json')) {
        body = await response.json()
      } else {
        body = await response.text()
      }

      return body
    } catch (error: unknown) {
      console.error(error)
      throw error
    }
  }

  public async get<T = any>(path: string, options: RequestInit): Promise<T> {
    return this.request(path, { method: 'GET', ...options })
  }

  public async post<T = any>(path: string, options: RequestInit): Promise<T> {
    return this.request(path, { method: 'POST', ...options })
  }

  public async patch<T = any>(path: string, options: RequestInit): Promise<T> {
    return this.request(path, { method: 'PATCH', ...options })
  }

  public async put<T = any>(path: string, options: RequestInit): Promise<T> {
    return this.request(path, { method: 'PUT', ...options })
  }

  public async delete<T = any>(path: string, options: RequestInit): Promise<T> {
    return this.request(path, { method: 'DELETE', ...options })
  }
}
