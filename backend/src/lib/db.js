import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MONGODB CONNECTED')
  } catch (error) {
    console.log('MONGODB CONNECTION ERROR ', error)
  }
}

export default connectDB
