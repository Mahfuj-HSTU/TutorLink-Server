import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.ts'
import { MainRouter } from './routes/index.ts'

const app = express()

const allowedOrigins = (process.env.APP_URL || 'http://localhost:3000')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))

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
    if (name.toLowerCase() === 'access-control-allow-origin') return res
    return _set(name, value)
  }
  authNodeHandler(req, res)
})

app.use('/api', MainRouter)

app.get('/', (_req, res) => {
  res.send('Tutor Link Server is Running')
})

export default app
