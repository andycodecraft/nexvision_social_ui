const Post = require("../models/post");
const Profile = require("../models/profile");

exports.listUsers = async (req, res) => {
    try {
        const users = await Profile.find({})
            .select('name username -_id')
            .lean();
        return res.status(200).json({ status: true, response: users });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listConnections = async (req, res) => {
    try {
        const { q } = req.query; 
        const profiles = await Profile.find({ 'username': q })
            .select('connection -_id')
            .lean();
        const connections = profiles.flatMap(profile => profile.connection || []);
        return res.status(200).json({ status: true, response: connections });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listEndorsements = async (req, res) => {
    try {
        const { q } = req.query;
        const profiles = await Profile.find({ 'username': q })
            .select('endorsement -_id')
            .lean();
        const endorsements = profiles.flatMap(profile => profile.endorsement || []);
        return res.status(200).json({ status: true, response: endorsements });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listFollowers = async (req, res) => {
    try {
        const { q } = req.query; 
        const profile = await Profile.findOne({ 'username': q })
            .select('followers -_id')
            .lean();
        return res.status(200).json({ status: true, response: profile.followers });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listFriends = async (req, res) => {
    try {
        const { q } = req.query; 
        const profile = await Profile.findOne({ 'username': q })
            .select('friends -_id')
            .lean();
        return res.status(200).json({ status: true, response: profile.friends });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listMentions = async (req, res) => {
    try {
        const { q } = req.query; 
        const profile = await Profile.findOne({ 'username': q })
            .select('mentions -_id')
            .lean();
        return res.status(200).json({ status: true, response: profile.mentions });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listOverview = async (req, res) => {
    try {
        const { q } = req.query; 
        const profile = await Profile.findOne({ 'username': q })
            .select('name headline about skill experience education interest license -_id')
            .lean();
        return res.status(200).json({ status: true, response: profile });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};

exports.listPosts = async (req, res) => {
    try {
        const { q } = req.query; 
        const posts = await Post.find({ 'userid': q })
            .select('title url like_people shares comment -_id')
            .lean();

        // Map through posts to rename fields
        const formattedPosts = posts.map(post => ({
            title: post.title,
            url: post.url,
            likes: post.like_people, // Rename like_people to likes
            shares: post.shares,
            comments: post.comment // Rename comment to comments
        }));

        return res.status(200).json({ status: true, response: formattedPosts });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};