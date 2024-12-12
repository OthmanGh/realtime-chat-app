import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utlis.js'

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password)
      return res.status(400).json({
        message: 'Missing some credentials',
      })

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters',
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    })

    generateToken(newUser._id, res)

    return res.status(201).json({
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error('Error in signup controller: ⚠️⚠️', error?.message || error)
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const login = (req, res) => {
  res.send('Login Route')
}

export const logout = (req, res) => {
  res.send('Logout Route')
}
