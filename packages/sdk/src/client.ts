import { ISquadronOptions } from './lib/types'
import { Application } from './api/application'
import { Rest } from './lib/rest'

export class Squadron {
  public options: ISquadronOptions
  public rest: Rest

  public application: Application

  public constructor(
    options: ISquadronOptions = {
      host: 'https://api.squadron.dev',
    },
  ) {
    this.options = options

    this.rest = new Rest(this)

    this.application = new Application(this)
  }
}
