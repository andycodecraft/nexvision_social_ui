const pool = require("../connection");
const url = require("url");
const axios = require("axios");
const Collection = require("../models/collection");

exports.getProfiles = async (req, res) => {
  try {
    const { platform, query } = req.body;
    if (!platform || !query) {
      return res
        .status(400)
        .json({ status: false, message: "Platform and query are required." });
    }
    const apiUrl = `http://172.111.162.203:18100/${platform}/search_user?q=${query}`;
    const response = await axios.get(apiUrl)
    const resData = {
      status: true,
      response: response.data,
    };
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.saveCollection = async (req, res) => {
  try {
    const { name, platform, profiles } = req.body || {};

    if (!name || !platform) {
      return res
        .status(400)
        .json({ status: false, message: "name and platform are required." });
    }
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return res
        .status(400)
        .json({
          status: false,
          message: "profiles must be a non-empty array.",
        });
    }

    // Normalize to ensure `image` is used (and dedupe by username)
    const seen = new Set();
    const normalizedProfiles = profiles
      .map((p) => ({
        id: String(p.id ?? p._id ?? p.username ?? ""),
        name: p.name ?? p.username ?? "",
        username: p.username ?? "",
        description: p.description ?? "",
        image: p.image ?? p.profileImage ?? "", // ⬅️ accept legacy field, store as `image`
        platform: p.platform || platform,
        status: 'pending',
        source: p.source || "search",
      }))
      .filter((p) => {
        const u = (p.username || "").toLowerCase().trim();
        if (!u || seen.has(u)) return false;
        seen.add(u);
        return true;
      });

    if (normalizedProfiles.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "No valid profiles to save." });
    }

    const doc = await Collection.create({
      name,
      platform,
      profiles: normalizedProfiles,
    });

    return res.status(201).json({ status: true, response: doc });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.listCollections = async (req, res) => {
    try {
    //   const { status, q, platform } = req.query;
    const { platform } = req.query;
  
      const filter = {};
    //   if (status) filter.status = status;
      if (platform) filter.platform = platform;
  
    //   if (q && q.trim()) {
    //     const rx = new RegExp(q.trim(), "i");
    //     filter.$or = [
    //       { name: rx },
    //       { "profiles.username": rx },
    //       { "profiles.name": rx },
    //     ];
    //   }
  
      const docs = await Collection.find(filter)
        .sort({ createdAt: -1 })
        .lean();
  
      return res.status(200).json({ status: true, response: docs });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  };
  
  /**
   * DELETE /api/v1/collections/:id
   * Returns: { status: true, response: { removed: id } }
   */
  exports.removeCollection = async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: "Invalid id" });
      }
  
      const removed = await Collection.findByIdAndDelete(id);
      if (!removed) {
        return res.status(404).json({ status: false, message: "Not found" });
      }
  
      return res.status(200).json({ status: true, response: { removed: id } });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  };

function getHeaders(reqHeaders) {
  const headers = {};
  for (const [key, value] of Object.entries(reqHeaders)) {
    headers[key.toLowerCase()] = value; // Normalize header keys to lowercase
  }
  return headers;
}
