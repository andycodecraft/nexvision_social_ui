const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/api.controller');

router.get("/users", collectionController.listUsers);
router.get("/connections", collectionController.listConnections);
router.get("/endorsements", collectionController.listEndorsements);
router.get("/followers", collectionController.listFollowers);
router.get("/friends", collectionController.listFriends);
router.get("/mentions", collectionController.listMentions);
router.get("/overview", collectionController.listOverview);
router.get("/posts", collectionController.listPosts);

module.exports = router;