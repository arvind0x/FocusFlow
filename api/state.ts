import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleStateRequest } from './state-handler.ts'

type FunctionRequest = IncomingMessage & { body?: unknown }

export default async function handler(request: FunctionRequest, response: ServerResponse) {
  const headers = new Headers()
  for (const [name, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') headers.set(name, value)
    else if (Array.isArray(value)) headers.set(name, value.join(', '))
  }

  const body = request.method === 'GET' || request.method === 'HEAD' || request.body === undefined
    ? undefined
    : typeof request.body === 'string'
      ? request.body
      : JSON.stringify(request.body)

  const apiRequest = new Request(`https://${request.headers.host || 'localhost'}/api/state`, {
    method: request.method || 'GET',
    headers,
    body
  })
  const apiResponse = await handleStateRequest(apiRequest)

  response.statusCode = apiResponse.status
  apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
  response.end(await apiResponse.text())
}
