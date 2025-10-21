import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock NextResponse.json so the handler returns the raw data for easier assertions
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => data,
  },
}))

import { checkDeployment } from './checkDeployment'

describe('checkDeployment', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    // remove any global fetch mock we added
    try {
      delete (globalThis as any).fetch
    } catch (_) {}
  })

  it('throws if missing token or appId', async () => {
    const handler = checkDeployment(undefined, undefined)
    const req = { nextUrl: { searchParams: new URLSearchParams() } } as any
    await expect(handler(req)).rejects.toThrow('missing required token and appId')
  })

  it('fetches latest deployments when no id param', async () => {
    const token = 'tok'
    const appId = 'app123'
    const listData = { deployments: [{ id: 'deploy-1' }] }

    const fetchMock = vi.fn((url: string, opts: any) => {
      // basic assertions about the request
      expect(url).toContain(`/apps/${appId}/deployments?page=1&per_page=1`)
      expect(opts?.method).toBe('GET')
      expect(opts?.headers?.Authorization).toBe(`Bearer ${token}`)
      return Promise.resolve({ json: async () => listData })
    })

    ;(globalThis as any).fetch = fetchMock

    const handler = checkDeployment(token, appId)
    const req = { nextUrl: { searchParams: new URLSearchParams() } } as any
    const result = await handler(req)

    expect(result).toEqual(listData)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('fetches deployment by id when id param present', async () => {
    const token = 'tok'
    const appId = 'app123'
    const deployId = 'deploy-abc'
    const deployData = { deployment: { id: deployId, phase: 'BUILDING' } }

    const fetchMock = vi.fn((url: string, opts: any) => {
      expect(url).toContain(`/apps/${appId}/deployments/${deployId}`)
      expect(opts?.method).toBe('GET')
      expect(opts?.headers?.Authorization).toBe(`Bearer ${token}`)
      return Promise.resolve({ json: async () => deployData })
    })

    ;(globalThis as any).fetch = fetchMock

    const handler = checkDeployment(token, appId)
    const params = new URLSearchParams()
    params.set('id', deployId)
    const req = { nextUrl: { searchParams: params } } as any

    const result = await handler(req)

    expect(result).toEqual(deployData)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})