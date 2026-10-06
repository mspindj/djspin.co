import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// En producción /api/contact es una función de Vercel. `npm run dev` no la corre, así que aquí se
// monta la MISMA función sobre el servidor de desarrollo, con las variables de .env.local.
// Sin RESEND_API_KEY responde 500, igual que haría en Vercel.
function contactApiDev(): Plugin {
  return {
    name: 'contact-api-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ['RESEND_', 'CONTACT_']))
      server.middlewares.use('/api/contact', async (req, res) => {
        const chunks: Buffer[] = []
        for await (const c of req) chunks.push(c as Buffer)
        let body: unknown = {}
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') } catch { /* cuerpo inválido */ }
        const shim = {
          status(code: number) { res.statusCode = code; return shim },
          json(data: unknown) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return shim },
        }
        const { default: handler } = await server.ssrLoadModule('/api/contact.ts')
        await handler({ method: req.method, body } as VercelRequest, shim as unknown as VercelResponse)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), contactApiDev()],
})
