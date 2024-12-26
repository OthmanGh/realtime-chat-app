import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utlis.js'
import cloudinary from '../lib/cloudinary.js'

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
        profilePic: newUser.profilePic,
      },
    })
  } catch (error) {
    console.error('Error in signup controller: ⚠️⚠️', error?.message || error)
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing email or password',
      })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        message: 'Invalid credentials',
      })
    }

    generateToken(user._id, res)

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    })
  } catch (error) {
    console.error('Error in login controller: ⚠️⚠️', error?.message || error)
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const logout = (req, res) => {
  try {
    res.cookie('token', '', {
      maxAge: 0,
    })

    return res.status(200).json({
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Error in logout controller: ⚠️⚠️', error?.message || error)
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic)
      return res.status(400).json({ message: 'Profile pic is required' })

    const uploadResponse = await cloudinary.uploader(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    )

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error(
      'error in update profile route: ⚠️⚠️ ',
      error?.message || error
    )

    res.status(500).json({ message: 'Internal server error' })
  }
}

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user)
  } catch (error) {
    console.error('Error in checkAuth controller', error.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
