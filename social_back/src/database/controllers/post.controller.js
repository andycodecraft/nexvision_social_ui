const Post = require("../models/post");
const Profile = require("../models/profile");
const mongoose = require("mongoose");

exports.listPosts = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid id" });
    }

    // Find posts by collectionid
    const posts = await Post.find({ collectionid: id });
    if (!posts || posts.length === 0) {
      return res.status(404).json({ status: false, message: "Not found" });
    }

    // Extract user IDs from the posts
    const userIds = posts.map(post => post.userid);

    // Find profiles for the user IDs
    const profiles = await Profile.find({ id: { $in: userIds } });

    // Create a mapping of user ID to profile data
    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile.id] = profile;
    });

    // Append profile data to each post
    const postsWithProfiles = posts.map(post => {
      return {
        ...post.toObject(), // Convert Mongoose document to plain object
        user: profileMap[post.userid] || null // Add profile data
      };
    });

    // Return the found posts with profile data in the response
    return res.status(200).json({ status: true, response: postsWithProfiles });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
