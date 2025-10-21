import { NextRequest, NextResponse } from "next/server"

export const initializeDeployment =
  (token?: string, appId?: string) =>
  async (request: NextRequest, context: { params: Promise<{}> }): Promise<void | Response> => {
    if (!token || !appId) {
      throw new Error("missing required token and appId")
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const body = JSON.stringify({
        force_build: true,
      })

      const response = await fetch(`https://api.digitalocean.com/v2/apps/${appId}/deployments`, {
        method: "POST",
        body,
        headers,
      })

      return NextResponse.json({ ...response, status: 200 })
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 402 })
    }
  }
