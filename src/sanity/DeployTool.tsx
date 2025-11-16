import { Button, useToast } from "@sanity/ui"
import { VscRocket } from "react-icons/vsc"
import { useEffect } from "react"
import type { DeployToolOptions } from "./types"
import { toasts } from "./toasts"

export const DeployTool = ({ options }: { options?: DeployToolOptions }) => {
  const { successOrErrorDuration, checkProgressInterval, estimatedDeploymentDurationMessage, suppressToasts, apiEndpoint, requireConfirmation } = {
    successOrErrorDuration: 600000, // 1m
    checkProgressInterval: 30000, // 30s
    estimatedDeploymentDurationMessage: "Est. 8 minutes",
    suppressToasts: false,
    apiEndpoint: "/api/deploy",
    requireConfirmation: undefined,
    ...options,
  }

  const PAUSE_BEFORE_INTERVAL = 5000 // 5s
  const DEFAULT_CONFIRMATION_MESSAGE = "This will redeploy the website with ALL published content. Proceed?"

  const toast = useToast()

  let interval: number
  let timeoutId: number
  let deploymentId: string | undefined = undefined

  const deploy = async () => {
    if (!!requireConfirmation) {
      const message = typeof requireConfirmation === "string" ? requireConfirmation : DEFAULT_CONFIRMATION_MESSAGE
      if (!confirm(message)) {
        return
      }
    }
    if (!suppressToasts) {
      const bundle = toasts("INIT", PAUSE_BEFORE_INTERVAL + 500)
      toast.push(bundle)
    }

    const { status, ...props } = await fetch("/api/deploy", { method: "POST" })

    if (status !== 200 && !suppressToasts) {
      const bundle = toasts("INIT_FAIL", successOrErrorDuration)
      toast.push(bundle)
      console.error(status)
      console.error(props)
    } else {
      // give DO a chance to start; if we check too fast, the check might return previous deployment
      timeoutId = window.setTimeout(() => {
        check()
        interval = window.setInterval(check, checkProgressInterval)
      }, PAUSE_BEFORE_INTERVAL)
    }
  }

  const check = async () => {
    try {
      if (!deploymentId) {
        const response = await fetch(apiEndpoint, { method: "GET" })
        const data = await response.json()
        deploymentId = data.deployments[0].id
      }
      if (deploymentId) {
        const response = await fetch(`${apiEndpoint}?id=${deploymentId}`, { method: "GET" })
        const data = await response.json()
        if (data.id === "invalid_argument" || data.id === "Unauthorized") {
          clearInterval(interval)
          const bundle = toasts(data.id, successOrErrorDuration)
          toast.push(bundle)
          return
        }
        if (!suppressToasts) {
          const bundle = toasts(data.deployment.phase, ["ACTIVE", "CANCELED"].includes(data.deployment.phase) ? successOrErrorDuration : checkProgressInterval, estimatedDeploymentDurationMessage)
          toast.push(bundle)
        }
        if (["ACTIVE", "CANCELED"].includes(data.deployment.phase)) {
          clearInterval(interval)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [])

  return <Button fontSize={1} iconRight={VscRocket} text="Deploy" mode="bleed" tone="default" style={{ cursor: "pointer" }} onClick={() => deploy()} />
}
