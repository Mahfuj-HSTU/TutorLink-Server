import express from 'express'
import cors from 'cors'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './lib/auth.ts'
import { MainRouter } from './routes/index.ts'

const app = express()

app.use(express.json())
app.use(
	cors({
		origin: process.env.APP_URL!,
		credentials: true
	})
)

app.all('/api/auth/*', toNodeHandler(auth))

app.use('/api', MainRouter)

app.get('/', (req, res) => {
	res.send('Tutor Link Server is Running')
})

export default app
