import { app, autoUpdater } from 'electron'

export interface IOptions {
  /**
   * The app slug
   */
  readonly appSlug: string
  /**
   * @param {string} host The server which will be used for updates.
   *
   * @default `https://api.squadron.dev`
   */
  readonly host?: string
}

class Updater {
  private host: string = 'https://api.squadron.dev'
  private appSlug: string | null = null

  public constructor(opts: IOptions) {
    if (opts.host) {
      this.host = opts.host
    }

    this.appSlug = opts.appSlug
  }

  public initUpdater() {
    return app.isReady()
      ? this.useUpdater()
      : app.whenReady().then(() => this.useUpdater())
  }

  private useUpdater() {
    const suffix = process.platform === 'darwin' ? '/RELEASES.json' : ''
    const feedURL = `${this.host}/apps/${this.appSlug}/${process.platform}/${process.arch}${suffix}`

    autoUpdater.setFeedURL({
      url: feedURL,
      serverType: 'json',
    })

    autoUpdater.on('error', (err) => {
      console.log(`Error during executing: ${err}`)
    })

    autoUpdater.on('checking-for-update', () => {
      console.log('checking for update')
    })

    autoUpdater.on('update-available', () => {
      console.log('update available')
    })

    autoUpdater.on(
      'update-downloaded',
      (event, releaseNotes, releaseName, releaseDate, updateURL) => {
        console.log('update downloaded', [
          event,
          releaseNotes,
          releaseName,
          releaseDate,
          updateURL,
        ])
      },
    )

    autoUpdater.checkForUpdates()
    setInterval(
      () => {
        autoUpdater.checkForUpdates()
      },
      5 * 60 * 1000,
    )
  }
}

export const updater = (opts: IOptions) => new Updater(opts)
