const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

router.get("/posts/:id", postController.listPosts);

module.exports = router;