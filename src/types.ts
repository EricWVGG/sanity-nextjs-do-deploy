export type DeployToolOptions = {
  successOrErrorDuration: number
  checkProgressInterval: number
  estimatedDeploymentDurationMessage: string
  suppressToasts: boolean
  apiEndpoint: string
  requireConfirmation: string | boolean
  debug: boolean
}

export type PluginOptions = {
  estimatedDeploymentDurationMessage?: string
  suppressToasts?: boolean
  apiEndpoint?: string
  requireConfirmation?: string | boolean
  successOrErrorDuration?: number
  checkProgressInterval?: number
  debug?: boolean
}
