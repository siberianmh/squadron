import { Squadron } from '../client'
import { IUser } from '../definitions/user'

export class User {
  private squadron: Squadron

  public constructor(squadron: Squadron) {
    this.squadron = squadron
  }

  public async me(): Promise<IUser> {
    const data = await this.squadron.rest.get<IUser>('/users/@me')
    return data
  }
}
