import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import errorHandler from './middleware/errorHandler.js'
import itemsRouter from './routes/items.js'

const app = express()
const port = Number(process.env.PORT) || 3001
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

app.disable('x-powered-by')
app.use(cors({ origin: frontendOrigin }))
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1
  return res.status(200).json({
    status: 'ok',
    database: databaseConnected ? 'connected' : 'disconnected',
  })
})

app.use('/api/items', itemsRouter)
app.use((req, res) => res.status(404).json({ message: 'API route not found.' }))
app.use(errorHandler)

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('Connected to MongoDB.')
    } catch {
      console.error('Could not connect to MongoDB. Check the URI and Atlas network access.')
      process.exitCode = 1
      return
    }
  } else {
    console.warn('MONGODB_URI is not set. Database routes will return 503.')
  }

  app.listen(port, '127.0.0.1', () => {
    console.log(`Local API listening at http://127.0.0.1:${port}`)
  })
}

start()
