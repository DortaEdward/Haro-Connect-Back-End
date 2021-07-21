const mongoose = require('mongoose');

const { Schema } = mongoose;
const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
