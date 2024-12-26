import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import cloudinary from '../lib/cloudinary.js'

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select('-password')

    res.status(200).json({ filteredUsers })
  } catch (error) {
    console.error('Error in getUsersForSidebar', error?.message || error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const currentUser = req.user._i

    const messages = await Message.find({
      $or: [
        { senderId: currentUser, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUser },
      ],
    })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error in getMessages controller', error?.message || error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    let imageUrl

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || undefined,
    })

    await newMessage.save()

    // Todo realtime functionality

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error in sendMessage controller', error?.message || error)
    res.status(500).json({ error: 'Internal server error' })
  }
}