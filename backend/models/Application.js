const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },

  status: {
    type: String,
    default: 'Pending'
  },

  appliedAt: {
    type: Date,
    default: Date.now
  }

})

const Application = mongoose.model(
  'Application',
  applicationSchema
)

module.exports = Application