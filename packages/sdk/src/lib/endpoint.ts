import { Endpoint } from '@siberianmh/reqeast'
import { IApplication, IUser } from '../definitions'

export type UserEndpoints = Endpoint<'GET', '/users/@me', IUser>

export type ApplicationEndpoints =
  | Endpoint<'GET', '/apps', Array<IApplication>>
  | Endpoint<'POST', 'apps/:appId/upload', void, FormData>

export type Endpoints = UserEndpoints | ApplicationEndpoints
