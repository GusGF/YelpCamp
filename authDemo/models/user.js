const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username must be specified']
  },
  password: {
    type: String,
    required: [true, 'password must be supplied']
  }
})
module.exports = mongoose.model('User', userSchema)