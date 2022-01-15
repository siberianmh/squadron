export interface IUser {
  readonly id: number
  readonly login: string
  readonly email: string
  readonly site_admin: boolean
  readonly avatar_url: string
  readonly created_at: Date
  readonly updated_at: Date
  readonly verified: boolean
}
