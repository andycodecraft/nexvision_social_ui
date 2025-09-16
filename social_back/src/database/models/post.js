// models/post.js
const mongoose = require("mongoose");

// The post document itself
const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    title: { type: String, required: true },
    tags: { type: Array },
    uid: { type: String },
    mentions: { type: Array },
    pageUrl: { type: String },
    links: { type: Array },
    publicationTime: { type: String },
    original: { type: Boolean },
    likes: { type: Number },
    shares: { type: Number },
    comments: { type: Number },
    type: { type: String },
    score: { type: Number },
    normalizedScore: { type: Number },
    minhash: { type: String },
    cleanTitle: { type: String },
    rank: { type: Number },
    userid: { type: String },
    collectionid: { type: String }
  }
);

// Keep your existing model name if you already use "Post"
const PostPage = mongoose.model("Post", postSchema);
module.exports = PostPage;
