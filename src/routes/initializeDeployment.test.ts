import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => ({ ...data, ...(init ? { status: init.status } : {}) }),
  },
}))

import { initializeDeployment } from './initializeDeployment'

describe('initializeDeployment', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })
  afterEach(() => {
    try { delete (globalThis as any).fetch } catch (_) {}
  })

  it('throws if missing token or appId', async () => {
    const handler = initializeDeployment(undefined, undefined)()
    await expect(handler).rejects.toThrow('missing required token and appId')
  })

  it('returns success response on valid POST', async () => {
    const token = 'tok'
    const appId = 'app123'
    const responseData = { foo: 'bar' }
    const fetchMock = vi.fn((url: string, opts: any) => {
      expect(url).toContain(`/apps/${appId}/deployments`)
      expect(opts?.method).toBe('POST')
      expect(opts?.headers?.Authorization).toBe(`Bearer ${token}`)
      expect(JSON.parse(opts?.body)).toEqual({ force_build: true })
      return Promise.resolve(responseData)
    })
    ;(globalThis as any).fetch = fetchMock
    const handler = initializeDeployment(token, appId)()
    const result = await handler
    expect(result.status).toBe(200)
    expect(result.foo).toBe('bar')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns error response on fetch error', async () => {
    const token = 'tok'
    const appId = 'app123'
    const fetchMock = vi.fn(() => { throw new Error('fail') })
    ;(globalThis as any).fetch = fetchMock
    const handler = initializeDeployment(token, appId)()
    const result = await handler
    expect(result.status).toBe(402)
    expect(result.message).toBeInstanceOf(Error)
  })
})