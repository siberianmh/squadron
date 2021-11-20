import PublisherBase, { PublisherOptions } from '@electron-forge/publisher-base'
import { asyncOra } from '@electron-forge/async-ora'
import * as FormData from 'form-data'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'
import { IPublisherSquadronConfig } from './config'

export default class PublisherSquadron extends PublisherBase<IPublisherSquadronConfig> {
  name = 'squadron'

  public constructor(opts: IPublisherSquadronConfig) {
    super(opts)

    if (!opts.baseURL) {
      this.config.baseURL = 'https://api.squadron.dev'
    }

    if (!opts.token) {
      this.config.token = process.env.SQUADRON_TOKEN
    }

    this.config.appId = opts.appId
  }

  private collapseMakeResults = (
    makeResults: PublisherOptions['makeResults'],
  ) => {
    const newMakeResults: typeof makeResults = []
    for (const result of makeResults) {
      const existingResult = newMakeResults.find(
        (nResult) =>
          nResult.arch === result.arch &&
          nResult.platform === result.platform &&
          nResult.packageJSON.version === result.packageJSON.version,
      )
      if (existingResult) {
        existingResult.artifacts.push(...result.artifacts)
      } else {
        newMakeResults.push({ ...result })
      }
    }
    return newMakeResults
  }

  public async publish({ makeResults }: PublisherOptions): Promise<void> {
    const { config } = this

    const collapsedResults = this.collapseMakeResults(makeResults)

    for (const [resultIdx, makeResult] of collapsedResults.entries()) {
      const msg = `Uploading result (${resultIdx + 1}/${
        collapsedResults.length
      })`
      // console.debug(msg)

      await asyncOra(msg, async () => {
        const data = new FormData()
        data.append('platform', makeResult.platform)
        data.append('arch', makeResult.arch)
        data.append('version', makeResult.packageJSON)

        let artifactIdx = 0
        for (const artifactPath of makeResult.artifacts) {
          // Skip the RELEASES file, it is automatically generated on the server
          if (path.basename(artifactPath).toLowerCase() === 'releases') {
            continue
          }
          data.append(`file${artifactIdx}`, fs.createReadStream(artifactPath))
          artifactIdx += 1
        }

        const response = await fetch(
          `${config.baseURL}/apps/${config.appId}/upload`,
          {
            headers: {
              Authorization: `Bearer ${config.token}`,
            },
            method: 'POST',
            body: data,
          },
        )

        if (response.status !== 200) {
          throw new Error(
            `Unexpected response code: ${
              response.status
            }\n\nBody:\n${await response.text()}`,
          )
        }
      })
    }
  }
}
