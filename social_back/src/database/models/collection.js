// models/collection.js
const mongoose = require("mongoose");

// Each profile in the array
const profileSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    username: String,
    description: String,
    image: String,
    platform: String,
    source: String,
  }
);

// The collection document itself
const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    platform: { type: String, required: true },
    profiles: { type: [profileSchema], default: [] },
  }
);

// Keep your existing model name if you already use "Collection"
const CollectionPage = mongoose.model("Collection", collectionSchema);
module.exports = CollectionPage;
