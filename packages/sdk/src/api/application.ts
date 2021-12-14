import * as FormData from 'form-data'
import * as path from 'node:path'
import * as fs from 'node:fs'
import { IStandardUploadOptions } from '../lib/types'
import { Squadron } from '../client'

export class Application {
  private squadron: Squadron

  public constructor(squadron: Squadron) {
    this.squadron = squadron
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
    data.append('file0', fs.createReadStream(opts.artifactPath))

    this.squadron.rest.post(`/apps/${opts.appId}/upload`, {
      body: data,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })

    // TODO: We return something?
    return
  }
}
