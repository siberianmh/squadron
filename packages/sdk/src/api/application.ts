import * as path from 'node:path'
import * as fs from 'node:fs'
import { Reqeast } from '@siberianmh/reqeast'
import { IStandardUploadOptions } from '../lib/types'
import { Endpoints } from '../lib/endpoint'

export class Application {
  private client: Reqeast<Endpoints>

  public constructor(client: Reqeast) {
    this.client = client
  }

  public async list() {
    const data = await this.client.get('/apps')
    return data
  }

  // TODO: Add support for array of artifacts
  public async upload(opts: IStandardUploadOptions) {
    const data = new FormData()
    data.append('platform', opts.platform)
    data.append('arch', opts.arch)
    data.append('version', opts.version)

    // Skip the RELEASES file, it is automatically generated on the server side
    if (path.basename(opts.artifactPath).toLowerCase() === 'releases') {
      return
    }

    // TODO: Add some index
    // @ts-expect-error
    data.append('file0', fs.createReadStream(opts.artifactPath))

    this.client.post(
      'apps/:appId/upload',
      {
        ...data,
      },
      { appId: opts.appId },
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    )

    // TODO: We return something?
    return
  }
}
