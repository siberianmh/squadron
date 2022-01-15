import { ISquadronOptions } from './lib/types'
import { Rest } from './lib/rest'
import { Application } from './api/application'
import { User } from './api/user'

export class Squadron {
  public options: ISquadronOptions
  public rest: Rest

  public user: User
  public application: Application

  public constructor(
    options: ISquadronOptions = {
      host: 'https://api.squadron.dev',
    },
  ) {
    this.options = options

    this.rest = new Rest(this)

    this.user = new User(this)
    this.application = new Application(this)
  }
}
