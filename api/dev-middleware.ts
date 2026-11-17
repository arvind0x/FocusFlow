import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { handleStateRequest } from './state-handler.ts'
import { handleFeedbackRequest } from './feedback-handler.ts'

const maxRequestBytes = 512 * 1024

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  let totalBytes = 0

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    totalBytes += buffer.byteLength
    if (totalBytes > maxRequestBytes) throw new Error('PAYLOAD_TOO_LARGE')
    chunks.push(buffer)
  }

  return Buffer.concat(chunks).toString('utf8')
}

function writeJson(response: ServerResponse, status: number, message: string) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'private, no-store')
  response.end(JSON.stringify({ error: message }))
}

export function databaseDevMiddleware(): Plugin {
  return {
    name: 'focusflow-neon-dev-api',
    configureServer(server) {
      server.middlewares.use('/api', (request, response, next) => {
        const originalUrl = (request as IncomingMessage & { originalUrl?: string }).originalUrl || ''
        const path = originalUrl.split('?')[0]
        if (path !== '/api/state' && path !== '/api/feedback') return next()

        void (async () => {
          const headers = new Headers()
          for (const [name, value] of Object.entries(request.headers)) {
            if (typeof value === 'string') headers.set(name, value)
            else if (Array.isArray(value)) headers.set(name, value.join(', '))
          }

          let body: string | undefined
          if (request.method !== 'GET' && request.method !== 'HEAD') {
            try {
              body = await readBody(request)
            } catch {
              writeJson(response, 413, 'Data is too large to save.')
              return
            }
          }

          const protocol = request.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'
          const apiRequest = new Request(`${protocol}://${request.headers.host || 'localhost'}${originalUrl}`, {
            method: request.method || 'GET',
            headers,
            body
          })
          const apiResponse = await (path === '/api/feedback' ? handleFeedbackRequest(apiRequest) : handleStateRequest(apiRequest))
          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
          response.end(await apiResponse.text())
        })().catch(() => writeJson(response, 503, 'The database is temporarily unavailable.'))
      })
    }
  }
}
