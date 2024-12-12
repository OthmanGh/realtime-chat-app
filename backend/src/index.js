import express from 'express'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import authRoutes from './routes/auth.route.js'

dotenv.config()
const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)

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
