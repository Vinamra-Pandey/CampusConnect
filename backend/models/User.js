const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    default: 'student'
  },

  college: {
    type: String,
    default: ''
  },

  branch: {
    type: String,
    default: ''
  },

  year: {
    type: String,
    default: ''
  },

  skills: {
    type: [String],
    default: []
  },

  bio: {
    type: String,
    default: ''
  },

  resume: {
    type: String,
    default: ''
  }

})

const User = mongoose.model('User', userSchema)

module.exports = User