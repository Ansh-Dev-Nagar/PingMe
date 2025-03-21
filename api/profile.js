const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const UserModel = require('../models/UserModel')
const ProfileModel = require('../models/ProfileModel')
const bcrypt = require('bcryptjs')


// GET PROFILE INFO
router.get('/:username', authMiddleware, async (req, res) =>
{
  try
  {
    const { username } = req.params

    const user = await UserModel.findOne({ username: username.toLowerCase() })
  
    if(!user)
    {
      return res.status(404).send('No User Found')
    }

    const profile = await ProfileModel.findOne({ user: user._id }).populate('user')

    return res.json({ profile })
  }
  catch (error)
  {
    console.error(error)
  
    return res.status(500).send('Server Error')
  }
})

// UPDATE PROFILE
router.post('/update', authMiddleware, async (req, res) =>
{
  try
  {
    const { userId } = req

    const { profilePicUrl, name, username } = req.body

    let profileFields = {}

    profileFields.user = userId

    await ProfileModel.findOneAndUpdate({ user: userId }, { $set: profileFields }, { new: true })

    if(profilePicUrl || name || username)
    {
      const user = await UserModel.findById(userId)
      
      if(profilePicUrl) {
        user.profilePicUrl = profilePicUrl
      }
      
      if(name) {
        user.name = name
      }
      
      if(username) {
        // Check if username is already taken
        const userWithUsername = await UserModel.findOne({ username: username.toLowerCase() })
        
        if(userWithUsername && userWithUsername._id.toString() !== userId) {
          return res.status(400).send('Username already taken')
        }
        
        user.username = username.toLowerCase()
      }
      
      await user.save()
    }

    return res.status(200).send('Success')
  }
  catch(error)
  {
    console.error(error)
    
    return res.status(500).send('Server Error')
  }
})

// UPDATE PASSWORD
router.post('/update-password', authMiddleware, async (req, res) => {
  try {
    const { userId } = req
    const { currentPassword, newPassword } = req.body

    if(newPassword.length < 6) {
      return res.status(400).send('Password must be at least 6 characters')
    }

    const user = await UserModel.findById(userId).select('+password')
    
    if(!user) {
      return res.status(404).send('User not found')
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    
    if(!isMatch) {
      return res.status(401).send('Current password is incorrect')
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return res.status(200).send('Password updated successfully')
  } catch(error) {
    console.error(error)
    return res.status(500).send('Server Error')
  }
})


module.exports = router