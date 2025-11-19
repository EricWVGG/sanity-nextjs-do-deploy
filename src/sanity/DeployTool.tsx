import { useEffect, useState } from "react"
import { VscRocket } from "react-icons/vsc"
import { Button, useToast } from "@sanity/ui"
import type { DeployToolOptions } from "./types"
import { toasts } from "./toasts"
import { useInterval } from "usehooks-ts"

export const DeployTool = ({ options }: { options?: DeployToolOptions }) => {
  const { successOrErrorDuration, checkProgressInterval, estimatedDeploymentDurationMessage, suppressToasts, apiEndpoint, requireConfirmation, debug } = {
    successOrErrorDuration: 600000, // 1m
    checkProgressInterval: 30000, // 30s
    estimatedDeploymentDurationMessage: "Est. 7 minutes",
    suppressToasts: false,
    apiEndpoint: "/api/deploy",
    requireConfirmation: undefined,
    ...options,
  }

  const PAUSE_BEFORE_INTERVAL = 5000 // 5s
  const DEFAULT_CONFIRMATION_MESSAGE = "This will redeploy the website with ALL published content. Proceed?"

  const toast = useToast()

  const [timeoutId, setTimeoutId] = useState<number>()
  const [deploymentId, setDeploymentId] = useState<string>()

  const consoleDebug = (messages: string | Array<any>) => {
    if (!debug) return
    console.log(messages)
  }

  const deploy = async () => {
    if (!!requireConfirmation) {
      const message = typeof requireConfirmation === "string" ? requireConfirmation : DEFAULT_CONFIRMATION_MESSAGE
      if (!confirm(message)) {
        return
      }
    }
    setDeploymentId(undefined)

    if (!suppressToasts) {
      const bundle = toasts("INIT", PAUSE_BEFORE_INTERVAL + 500)
      toast.push(bundle)
    }

    consoleDebug("deploying")
    const { status, ...props } = await fetch("/api/deploy", { method: "POST" })
    consoleDebug(["deployment started", status, props])

    if (status !== 200 && !suppressToasts) {
      const bundle = toasts("INIT_FAIL", successOrErrorDuration)
      toast.push(bundle)
      console.error(status)
      console.error(props)
    } else {
      // give DO a chance to start; if we check too fast, the check might return previous deployment
      consoleDebug("initializing check")
      const newTimeoutId = window.setTimeout(async () => {
        await getDeploymentId()
      }, PAUSE_BEFORE_INTERVAL)
      setTimeoutId(newTimeoutId)
    }
  }

  // This is just perpetually running.
  useInterval(() => void check(), checkProgressInterval)

  const getDeploymentId = async () => {
    const response = await fetch(apiEndpoint, { method: "GET" })
    const data = await response.json()
    setDeploymentId(data.deployments[0].id)
  }

  const check = async () => {
    if (!deploymentId) {
      return
    }
    consoleDebug(["fetching status", deploymentId])
    const response = await fetch(`${apiEndpoint}?id=${deploymentId}`, { method: "GET" })
    const data = await response.json()
    consoleDebug(["fetched status", deploymentId])

    if (data.id === "invalid_argument" || data.id === "Unauthorized") {
      const bundle = toasts(data.id, successOrErrorDuration)
      toast.push(bundle)
      setDeploymentId(undefined)
      return
    } else if (["ACTIVE", "CANCELED", "SUPERCEDED"].includes(data.deployment.phase)) {
      setDeploymentId(undefined)
    }
    if (!suppressToasts) {
      consoleDebug(data.deployment.phase)
      const duration = ["ACTIVE", "CANCELED", "SUPERCEDED"].includes(data.deployment.phase) ? successOrErrorDuration : checkProgressInterval
      const bundle = toasts(data.deployment.phase, duration, estimatedDeploymentDurationMessage)
      toast.push(bundle)
    }
  }

  useEffect(() => {
    return () => clearTimeout(timeoutId)
  }, [])

  return <Button type="button" fontSize={1} iconRight={VscRocket} text="Deploy" mode="ghost" tone="default" style={{ cursor: "pointer" }} onClick={() => deploy()} />
}
