export interface IStandardUploadOptions {
  readonly appId: string
  readonly platform: string
  readonly arch: string
  readonly version: string

  // Single
  // TODO: Add support for multiple
  readonly artifactPath: string
}
