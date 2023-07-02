import { Reqeast } from '@siberianmh/reqeast'
import { IUser } from '../definitions/user'
import { Endpoints } from '../lib/endpoint'

export class User {
  private client: Reqeast<Endpoints>

  public constructor(client: Reqeast) {
    this.client = client
  }

  public async me(): Promise<IUser> {
    const data = await this.client.get('/users/@me')
    return data
  }
}
