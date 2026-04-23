import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.ts'
import { MainRouter } from './routes/index.ts'

const app = express()

const allowedOrigins = (process.env.APP_URL || 'http://localhost:3000')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
const isHttps = (
  process.env.BETTER_AUTH_URL || 'http://localhost:5000'
).startsWith('https://')

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, origin ?? allowedOrigins[0])
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`))
      }
    },
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const authNodeHandler = toNodeHandler(auth)
app.use('/api/auth', (req, res) => {
  const _set = res.setHeader.bind(res)
  ;(res as any).setHeader = (name: string, value: any) => {
    const lower = name.toLowerCase()
    if (lower === 'access-control-allow-origin') return res
    if (isHttps && lower === 'set-cookie') {
      const list: string[] = Array.isArray(value) ? value : [String(value)]
      const patched = list.map((c) => {
        let cookie = c.replace(/;\s*SameSite=[^;]*/gi, '')
        if (!/;\s*Secure\b/i.test(cookie)) cookie += '; Secure'
        cookie += '; SameSite=None'
        return cookie
      })
      return _set(name, patched)
    }
    return _set(name, value)
  }
  authNodeHandler(req, res)
})

app.use('/api', MainRouter)

app.get('/', (_req, res) => {
  res.send('Tutor Link Server is Running')
})

export default app
