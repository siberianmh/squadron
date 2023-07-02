import { Reqeast } from '@siberianmh/reqeast'
import { ISquadronOptions } from './lib/types'
import { Application } from './api/application'
import { User } from './api/user'
import { Endpoints } from './lib/endpoint'

export class Squadron {
  public options: ISquadronOptions
  public rest: Reqeast<Endpoints>

  public user: User
  public application: Application

  public constructor(
    options: ISquadronOptions = {
      host: 'https://api.squadron.dev',
    },
  ) {
    this.options = options

    this.rest = new Reqeast({
      endpoint: this.options.host!,
      token: this.options.token!,
    })

    this.user = new User(this.rest)
    this.application = new Application(this.rest)
  }
}
