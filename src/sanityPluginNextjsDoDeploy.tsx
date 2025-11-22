import {definePlugin} from 'sanity'
import {WrappedDeployTool} from './WrappedDeployTool'
import type {DeployToolOptions, PluginOptions} from './types'

export const sanityPluginNextjsDoDeploy = definePlugin<PluginOptions>((config?: PluginOptions) => {
  const configWithDefaults: DeployToolOptions = {
    apiEndpoint: config?.apiEndpoint ?? '/api/deploy',
    debug: config?.debug ?? false,
    successOrErrorDuration: config?.successOrErrorDuration ?? 600000, // 1m,
    checkProgressInterval: config?.checkProgressInterval ?? 30000, // 30s
    suppressToasts: config?.suppressToasts ?? false,
    estimatedDeploymentDurationMessage:
      config?.estimatedDeploymentDurationMessage ?? 'Est. 7 minutes',
    requireConfirmation: config?.requireConfirmation || false,
  }

  return {
    name: 'sanity-plugin-nextjs-do-deploy',
    studio: {
      components: {
        toolMenu: WrappedDeployTool(configWithDefaults),
      },
    },
  }
})
