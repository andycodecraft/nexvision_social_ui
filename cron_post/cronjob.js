// cronjob.js
"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");

// ------------ Config ------------
const {
  MONGO_URI,
  CRON = "*/10 * * * * *",
  TIMEZONE = "Asia/Tokyo",
  LOG_QUERIES = "false",
  API_BASE_URL, // fallback if a platform URL is missing
  API_URL_LINKEDIN,
  API_URL_TWITTER,
  API_URL_INSTAGRAM,
  API_URL_FACEBOOK,
  API_URL_TIKTOK,
  API_URL_YOUTUBE,
} = process.env;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is required");
  process.exit(1);
}

if (LOG_QUERIES === "true") mongoose.set("debug", true);

// A small, resilient axios client
const http = axios.create({
  // timeout: 60_000,
  // avoid socket exhaustion in long-running cron
  httpAgent: new (require("http").Agent)({ keepAlive: true }),
  httpsAgent: new (require("https").Agent)({ keepAlive: true }),
});

const PLATFORM_URLS = {
  linkedin: API_URL_LINKEDIN,
  twitter: API_URL_TWITTER,
  instagram: API_URL_INSTAGRAM,
  facebook: API_URL_FACEBOOK,
  tiktok: API_URL_TIKTOK,
  youtube: API_URL_YOUTUBE,
};

// ------------ Schemas ------------
const profileItemSchema = new mongoose.Schema(
  {
    platform: { type: String, index: true }, // 'linkedin' | 'twitter' | ...
    status: String, // 'pending' | 'completed' | ...
    data: mongoose.Schema.Types.Mixed,
    processedAt: Date,
    name: String,
    username: String,
    lastUpsert: {
      upserted: Number,
      modified: Number,
      matched: Number,
      count: Number, // number of items processed
    },
  },
  { _id: true, strict: false }
);

const collectionSchema = new mongoose.Schema(
  {
    name: String,
    platform: String, // default platform for this collection (optional)
    profiles: [profileItemSchema],
  },
  { timestamps: true, strict: false }
);
collectionSchema.index({ "profiles.status": 1, "profiles.platform": 1 });

const userProfileSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    name: String,
    source: String, // platform label (e.g., "LinkedIn")
    items: { type: Number, default: 0 }, // number of posts seen
    profileImage: String,
    pageUrl: String,
    description: String,
    mentions: { type: Number, default: 0 },
    friends: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    headline: String,
    about: String,
    experience: [mongoose.Schema.Types.Mixed],
    education: [mongoose.Schema.Types.Mixed],
    interest: [mongoose.Schema.Types.Mixed],
    connection: [mongoose.Schema.Types.Mixed],
    license: [mongoose.Schema.Types.Mixed],
    endorsement: [mongoose.Schema.Types.Mixed],
    skill: [mongoose.Schema.Types.Mixed],
    id: String,
  },
  { timestamps: true, strict: false }
);

const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true, unique: true }, // platform#<id>
    collectionid: mongoose.Schema.Types.ObjectId,
    userid: String, // username the fetch ran for
    source: String, // platform label ("LinkedIn", "Twitter", ...)
    title: String,
    url: String,
    publicationTime: Number,
    publishedAt: Date,
    updatedAt: Date,
    likes: Number,
    shares: Number,
    comment: Number,
    images: [mongoose.Schema.Types.Mixed],
    videos: [mongoose.Schema.Types.Mixed],
    documents: [mongoose.Schema.Types.Mixed],
    like_people: [mongoose.Schema.Types.Mixed],
    comment_detail: [mongoose.Schema.Types.Mixed]
  },
  { timestamps: true, strict: false }
);

// helpful indexes for UI queries
postSchema.index({ collectionid: 1, publicationTime: -1 });
postSchema.index({ userid: 1, publicationTime: -1 });
postSchema.index({ source: 1, publicationTime: -1 });

const Collection = mongoose.model("Collection", collectionSchema, "collections");
const UserProfile = mongoose.model("UserProfile", userProfileSchema, "profiles");
const Post = mongoose.model("Post", postSchema, "posts");

// ------------ Utils ------------
const asArray = (x) => (Array.isArray(x) ? x : []);
const toNum = (v) =>
  Number.isFinite(v)
    ? v
    : v !== undefined && v !== null && !isNaN(Number(v))
    ? Number(v)
    : undefined;
const nonEmpty = (v) => (v === undefined || v === null || v === "" ? undefined : v);
const normalizePlatform = (p) => (p || "").toString().trim().toLowerCase();

function platformLabel(p) {
  switch (normalizePlatform(p)) {
    case "linkedin":
      return "LinkedIn";
    case "twitter":
      return "Twitter";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "tiktok":
      return "TikTok";
    case "youtube":
      return "YouTube";
    default:
      return (p || "Unknown").toString();
  }
}

function guessProfileUrl(platformLbl, username) {
  if (!username || /^https?:\/\//.test(username)) return undefined;
  switch (platformLbl) {
    case "LinkedIn":
      return `https://www.linkedin.com/in/${username}`;
    case "Twitter":
      return `https://twitter.com/${username}`;
    case "Instagram":
      return `https://instagram.com/${username}`;
    case "Facebook":
      return `https://facebook.com/${username}`;
    case "Tiktok":
      return `https://www.tiktok.com/@${username}`;
    case "YouTube":
      return `https://www.youtube.com/@${username}`;
    default:
      return undefined;
  }
}

// Normalize any per-platform payload into one array of posts
function normalizePayload(raw, platform) {
  const arr = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
    ? raw.data
    : [];

  const toArr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
  const toInt = (x, d = 0) => {
    const n = Number(x);
    return Number.isFinite(n) ? n : d;
  };
  const nowMs = Date.now();
  const label = platformLabel(platform);
  const p = normalizePlatform(platform);

  return arr.map((r) => {
    const users = toArr(r.users);
    const user0 = users[0] || {};
    const username =
      r.username ??
      user0.username ??
      user0.handle ??
      user0.id ??
      user0.name ??
      undefined;

    let id =
      r.id ||
      r.postId ||
      r.activityId ||
      r.tweet_id ||
      r.videoId ||
      r.shortcode;
    if (id) id = `${p}#${String(id)}`; // ensure global uniqueness

    let publicationTime =
      typeof r.publicationTime === "number"
        ? r.publicationTime
        : typeof r.publishedAt === "number"
        ? r.publishedAt
        : r.timestamp
        ? Date.parse(r.timestamp)
        : r.createTime
        ? Number(r.createTime) * 1000
        : nowMs;
    if (!Number.isFinite(publicationTime)) publicationTime = nowMs;
    const publishedAt = new Date(publicationTime);

    const url =
      r.url || r.pageUrl || r.permalink || r.link || r.videoUrl || r.tweetUrl;

    const title =
      r.title || r.text || r.caption || r.description || r.content || "";

    const likes = toInt(r.likes ?? r.likeCount ?? r.favorite_count);
    const shares = toInt(
      r.shares ?? r.shareCount ?? r.retweet_count ?? r.reposts
    );
    const comment = toInt(
      r.comment ?? r.comments ?? r.commentCount ?? r.reply_count
    );

    const images = toArr(r.images || r.thumbnails || r.image || r.picture);
    const videos = toArr(r.videos || r.video || r.media?.video);
    const documents = toArr(r.documents || r.docs);
    const like_people = toArr(r.like_people);
    const comment_detail = toArr(r.comment_detail);

    return {
      id,
      username,
      source: label,
      title,
      url,
      publicationTime,
      publishedAt,
      likes,
      shares,
      comment,
      images,
      videos,
      documents,
      like_people,
      comment_detail,
      _users: users, // keep for profile aggregation
    };
  });
}

// ------------ DB helpers ------------
async function upsertProfilesFromPayload(normalPosts, defaultPlatformLabel) {
  const perUser = new Map();

  for (const rec of asArray(normalPosts)) {
    for (const u of asArray(rec._users)) {
      const username = u?.username || u?.handle || u?.name || u?.id;
      if (!username) continue;

      if (!perUser.has(username)) {
        perUser.set(username, {
          count: 0,
          doc: {
            username,
            name: nonEmpty(u.name),
            source: nonEmpty(u.source) || defaultPlatformLabel,
            profileImage: nonEmpty(u.profileImage) || nonEmpty(u.image),
            pageUrl:
              nonEmpty(u.pageUrl) ||
              guessProfileUrl(defaultPlatformLabel, username),
            description: nonEmpty(u.description),
            headline: nonEmpty(u.headline),
            about: nonEmpty(u.about),
            id: nonEmpty(u.id) || nonEmpty(u.uid),
            experience: asArray(u.experience),
            education: asArray(u.education),
            interest: asArray(u.interest),
            connection: asArray(u.connection),
            license: asArray(u.license),
            endorsement: asArray(u.endorsement),
            skill: asArray(u.skill),
          },
          metrics: {
            mentions: toNum(u.mentions),
            friends: toNum(u.friends),
            followers: toNum(u.followers),
            shares: toNum(u.shares),
          },
        });
      }

      const entry = perUser.get(username);
      entry.count += 1;

      const d = entry.doc;
      const updIf = (k, v) => {
        if (nonEmpty(v) !== undefined) d[k] = v;
      };
      updIf("name", u.name);
      updIf("source", u.source);
      updIf("profileImage", u.profileImage || u.image);
      updIf("pageUrl", u.pageUrl);
      updIf("description", u.description);
      updIf("headline", u.headline);
      updIf("about", u.about);
      updIf("id", u.id || u.uid);

      ["experience", "education", "interest", "connection", "license", "endorsement", "skill"].forEach(
        (k) => {
          const arr = asArray(u[k]);
          if (arr.length) d[k] = arr;
        }
      );

      const m = entry.metrics;
      const mUpd = (k, v) => {
        const n = toNum(v);
        if (n !== undefined) m[k] = n;
      };
      mUpd("mentions", u.mentions);
      mUpd("friends", u.friends);
      mUpd("followers", u.followers);
      mUpd("shares", u.shares);
    }
  }

  if (!perUser.size)
    return { upsertedCount: 0, modifiedCount: 0, matchedCount: 0 };

  const ops = [];
  for (const [username, { count, doc, metrics }] of perUser.entries()) {
    const update = {
      $set: {
        name: doc.name,
        source: doc.source,
        profileImage: doc.profileImage,
        pageUrl: doc.pageUrl,
        description: doc.description,
        headline: doc.headline,
        about: doc.about,
        id: doc.id,
        ...(doc.experience?.length ? { experience: doc.experience } : {}),
        ...(doc.education?.length ? { education: doc.education } : {}),
        ...(doc.interest?.length ? { interest: doc.interest } : {}),
        ...(doc.connection?.length ? { connection: doc.connection } : {}),
        ...(doc.license?.length ? { license: doc.license } : {}),
        ...(doc.endorsement?.length ? { endorsement: doc.endorsement } : {}),
        ...(doc.skill?.length ? { skill: doc.skill } : {}),
      },
      $setOnInsert: {
        username,
        mentions: 0,
        friends: 0,
        followers: 0,
        shares: 0,
      },
      $inc: { items: count },
    };

    const metricSet = {};
    if (metrics.mentions !== undefined) metricSet.mentions = metrics.mentions;
    if (metrics.friends !== undefined) metricSet.friends = metrics.friends;
    if (metrics.followers !== undefined) metricSet.followers = metrics.followers;
    if (metrics.shares !== undefined) metricSet.shares = metrics.shares;
    if (Object.keys(metricSet).length)
      update.$set = { ...update.$set, ...metricSet };

    ops.push({ updateOne: { filter: { username }, update, upsert: true } });
  }

  const res = await UserProfile.bulkWrite(ops, { ordered: false });
  return {
    upsertedCount: res.upsertedCount ?? 0,
    modifiedCount: res.modifiedCount ?? 0,
    matchedCount: res.matchedCount ?? 0,
  };
}

async function upsertPosts(normalPosts, collectionId, username, platformLabel) {
  await Post.init();
  const now = new Date();

  const ops = [];
  let skippedNoId = 0;

  for (const rec of Array.isArray(normalPosts) ? normalPosts : []) {
    if (!rec?.id || typeof rec.id !== "string" || !rec.id.trim()) {
      skippedNoId++;
      continue;
    }

    ops.push({
      updateOne: {
        filter: { id: rec.id.trim() },
        update: {
          $setOnInsert: {
            id: rec.id.trim(),
            collectionid: collectionId,
            userid: username,
            createdAt: now,
          },
          $set: {
            source: rec.source ?? platformLabel,
            title: rec.title ?? "",
            url: rec.url ?? null,
            publicationTime: rec.publicationTime ?? null,
            publishedAt: rec.publishedAt ?? null,
            likes: Number.isFinite(rec.likes) ? rec.likes : 0,
            shares: Number.isFinite(rec.shares) ? rec.shares : 0,
            comment: Number.isFinite(rec.comment) ? rec.comment : 0,
            images: Array.isArray(rec.images) ? rec.images : [],
            videos: Array.isArray(rec.videos) ? rec.videos : [],
            documents: Array.isArray(rec.documents) ? rec.documents : [],
            like_people: Array.isArray(rec.like_people) ? rec.like_people : [],
            comment_detail: Array.isArray(rec.comment_detail) ? rec.comment_detail : [],
            updatedAt: now,
          },
        },
        upsert: true,
      },
    });
  }

  if (!ops.length) {
    return { upsertedCount: 0, modifiedCount: 0, matchedCount: 0, skippedNoId };
  }

  const result = await Post.bulkWrite(ops, { ordered: false });
  const upsertedCount =
    result.upsertedCount ??
    (result.upsertedIds ? Object.keys(result.upsertedIds).length : 0) ??
    0;

  return {
    upsertedCount,
    modifiedCount: result.modifiedCount ?? result.result?.nModified ?? 0,
    matchedCount: result.matchedCount ?? result.result?.nMatched ?? 0,
    skippedNoId,
  };
}

// ------------ Fetcher ------------
async function fetchData(platform, username) {
  const p = normalizePlatform(platform);
  const baseURL = PLATFORM_URLS[p] || API_BASE_URL;
  console.log(baseURL)
  if (!baseURL) {
    console.warn(`No API URL configured for platform="${platform}". Skipping.`);
    return null;
  }
  try {
    const { data } = await http.get(baseURL, { params: { id: username } });
    return data ?? null;
  } catch (e) {
    console.error(
      `API error [${p}] for "${username}":`,
      e.response?.status || "",
      e.message
    );
    return null;
  }
}

// ------------ Runner ------------
let isRunning = false;

async function tick() {
  if (isRunning) {
    console.log("⏭️  Previous run still in progress. Skipping this tick.");
    return;
  }
  isRunning = true;

  try {
    // find one collection with at least one pending profile
    const filter = { "profiles.status": { $regex: "^pending$", $options: "i" } };
    const doc = await Collection.findOne(filter)
      .sort({ updatedAt: 1, _id: 1 })
      .select({ name: 1, platform: 1, profiles: 1 })
      .lean();

    if (!doc) {
      console.log("No pending profiles found.");
      return;
    }

    const idx = doc.profiles.findIndex(
      (p) => p.status && /^pending$/i.test(p.status)
    );
    if (idx === -1) {
      console.log(`Doc ${doc._id} had no pending after read; maybe updated elsewhere.`);
      return;
    }

    const target = doc.profiles[idx];
    const platform = normalizePlatform(target.platform || doc.platform || "linkedin");
    const platformName = platformLabel(platform);
    const username = target.username || target.name || "";

    console.log(
      `Processing ${platform} | collection=${doc._id} profile#${idx} user="${username}"`
    );

    // (1) fetch
    const raw = await fetchData(platform, username);
    if (raw === null) {
      console.warn(
        `Skipping update due to API failure for "${username}" on ${platform}.`
      );
      return;
    }

    // (2) normalize
    const normalized = normalizePayload(raw, platform);
    console.log(`Fetched items: ${normalized.length}`);

    // (3) upsert profiles (best effort)
    try {
      const profRes = await upsertProfilesFromPayload(normalized, platformName);
      console.log(
        `Profiles upsert: upserted=${profRes.upsertedCount} modified=${profRes.modifiedCount} matched=${profRes.matchedCount}`
      );
    } catch (e) {
      console.error("❌ Profiles upsert error:", e.message);
    }

    // (4) upsert posts
    let summary = { upsertedCount: 0, modifiedCount: 0, matchedCount: 0, skippedNoId: 0 };
    try {
      summary = await upsertPosts(normalized, doc._id, username, platformName);
      console.log(
        `Upsert summary: upserted=${summary.upsertedCount} modified=${summary.modifiedCount} matched=${summary.matchedCount} skippedNoId=${summary.skippedNoId}`
      );
    } catch (e) {
      console.error("❌ Upsert error:", e.message);
      return; // do not mark completed if posts failed
    }

    // (5) mark only that array element completed
    const update = {
      $set: {
        [`profiles.${idx}.status`]: "completed",
        [`profiles.${idx}.processedAt`]: new Date(),
        [`profiles.${idx}.data`]: { items: normalized.length }, // keep small
        [`profiles.${idx}.lastUpsert`]: {
          upserted: summary.upsertedCount,
          modified: summary.modifiedCount,
          matched: summary.matchedCount,
          count: normalized.length,
        },
      },
    };
    const conditionalFilter = {
      _id: doc._id,
      [`profiles.${idx}.status`]: { $regex: "^pending$", $options: "i" },
    };
    const res = await Collection.updateOne(conditionalFilter, update);
    if (res.modifiedCount === 1) {
      console.log(
        `✅ Completed: doc=${doc._id} (${doc.name}) profile#${idx} -> completed (${username} on ${platform})`
      );
    } else {
      console.log(
        `⚠️  Nothing updated; element #${idx} may have changed since read (doc ${doc._id}).`
      );
    }
  } catch (e) {
    console.error("❌ Tick error:", e.message);
  } finally {
    isRunning = false;
  }
}

// ------------ Bootstrap ------------
(async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // ensure indexes (no-op after first run)
    await Promise.all([Collection.init(), UserProfile.init(), Post.init()]);

    // run once immediately, then schedule
    await tick();

    console.log(`⏲️  Scheduling: "${CRON}" (${TIMEZONE})`);
    cron.schedule(CRON, tick, { timezone: TIMEZONE });
  } catch (e) {
    console.error("Mongo connection error:", e.message);
    process.exit(1);
  }
})();

// ------------ Graceful shutdown ------------
const shutdown = async (sig) => {
  console.log(`\n${sig} received. Shutting down...`);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
