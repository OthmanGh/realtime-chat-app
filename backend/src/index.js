import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

const startServer = async () => {
  try {
    await connectDB()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to the database:', error.message)
    process.exit(1)
  }
}

startServer()
