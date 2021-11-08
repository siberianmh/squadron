export interface IPublisherSquadronConfig {
  /**
   * Base hostname for Squadron api server, if they different from default one
   *
   * Defaults to `https://api.squadron.dev`
   */
  baseURL?: string

  /**
   * App ID of your target application in Squadron
   */
  appId: number

  /**
   * Your personal upload token, you can find them in the application Settings menu.
   *
   * By default use the `SQUADRON_UPLOAD_TOKEN` environment variable.
   */
  token?: string
}
