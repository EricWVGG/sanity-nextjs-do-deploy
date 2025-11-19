import type { ToastParams } from "@sanity/ui"
import { VscRocket } from "react-icons/vsc"
import type { PropsWithChildren } from "react"

export const toasts = (phase: string, duration: number, estimatedDeploymentDurationMessage?: string): ToastParams => {
  switch (phase) {
    case "INIT":
      return {
        title: <Label>Deployment: initializing</Label>,
        duration,
      }
    case "INIT_FAIL":
      return {
        title: <Label>Deployment: failed initialization</Label>,
        status: "error",
        description: "Something went wrong. Please check the configuration and your server logs.",
        duration,
        closable: true,
      }
    case "ACTIVE":
      return {
        title: <Label>Deployment: active</Label>,
        status: "success",
        duration,
        closable: true,
      }
    case "PENDING_BUILD":
    case "BUILDING":
      return {
        title: <Label>Deployment: building</Label>,
        status: "info",
        description: estimatedDeploymentDurationMessage,
        duration,
        closable: true,
      }
    case "CANCELED":
      return {
        title: <Label>Deployment: canceled</Label>,
        status: "error",
        duration,
        closable: true,
      }
    case "SUPERCEDED":
      return {
        title: <Label>Deployment: superceded</Label>,
        status: "error",
        duration,
        closable: true,
      }
    case "Unauthorized":
      return {
        title: <Label>Deployment: Error</Label>,
        status: "error",
        description: "Digital Ocean rejected the provided security token. Please check the configuration.",
        duration,
        closable: true,
      }
    case "invalid_argument":
      return {
        title: <Label>Deployment: Error</Label>,
        status: "error",
        description: "Digital Ocean cannot find an app with the provided ID. Please check the configuration.",
        duration,
        closable: true,
      }
    default:
      return {
        title: <Label>Deployment: Unknown Error</Label>,
        status: "error",
        description: "Something went wrong. Please check the configuration.",
        duration,
        closable: true,
      }
  }
}

const Label = ({ children }: PropsWithChildren) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <VscRocket />
    <div>{children}</div>
  </div>
)
