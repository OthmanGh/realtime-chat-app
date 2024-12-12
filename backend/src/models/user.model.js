import mongoose from 'mongoose'

const userSchema = await mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },

    fullName: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 6 characters long'],
      select: false,
    },

    profilePic: {
      default: '',
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
