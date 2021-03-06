const mongoose = require('mongoose');

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: String,
  post: [{
    type: String,
  }],
}, {
  timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
});

module.exports = mongoose.model('User', userSchema);
