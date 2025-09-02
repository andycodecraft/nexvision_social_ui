const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  is_admin: Boolean,
  level: Number,
  verified: Number
});

const UserPage = mongoose.model('User', userSchema);

module.exports = UserPage;