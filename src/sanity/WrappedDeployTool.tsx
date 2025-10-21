import React from "react"
import type { DeployToolOptions } from "./types"
import { DeployTool } from "./DeployTool"

export const WrappedDeployTool = (options?: DeployToolOptions) => (props: any) =>
  (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {props.renderDefault(props)}
      <DeployTool options={options} />
    </div>
  )
