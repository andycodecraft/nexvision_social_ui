// models/profile.js
const mongoose = require("mongoose");

// Each profile in the array
const userProfileSchema = new mongoose.Schema(
  {
    id: String,
    username: String,
    name: String,
    source: String,
    items: Number,
    profileImage: String,
    pageUrl: String,
    description: String,
    mentions: Number,
    friends: Number,
    followers: Number,
    shares: Number,
    headline: String,
    about: String,
    experience: Array,
    education: Array,
    interest: Array,
    connection: Array,
    license: Array,
    endorsement: Array,
    skill: Array
  }
);

// Keep your existing model name if you already use "Profile"
const ProfilePage = mongoose.model("Profile", userProfileSchema);
module.exports = ProfilePage;
