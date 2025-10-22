export type DeployToolOptions = {
  successOrErrorDuration?: number
  checkProgressInterval?: number
  estimatedDeploymentDurationMessage?: string
  suppressToasts?: boolean
  apiEndpoint?: string
  requireConfirmation?: string | boolean
}
