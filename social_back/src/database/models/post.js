// models/post.js
const mongoose = require("mongoose");

// The post document itself
const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true, unique: true }, // e.g. "LinkedIn#urn:li:activity:..."
    collectionid: mongoose.Schema.Types.ObjectId, // parent collection _id (lower-case field name)
    userid: String,
    source: String,
    title: String, // full/raw title
    url: String, // kept for backward-compatibility; mirrors pageUrl
    publicationTime: Number, // epoch millis (as in your payload)
    publishedAt: Date, // Date version of publicationTime for easy querying
    updatedAt: Date,
    likes: Number,
    shares: Number,
    comment: Number,
    images: [mongoose.Schema.Types.Mixed],
    videos: [mongoose.Schema.Types.Mixed],
    documents: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true, strict: false }
);

// Keep your existing model name if you already use "Post"
const PostPage = mongoose.model("Post", postSchema);
module.exports = PostPage;
