const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');

router.post('/get-profiles/', collectionController.getProfiles);
router.post('/save-collection/', collectionController.saveCollection);
router.get("/collections", collectionController.listCollections);
router.delete("/collections/:id", collectionController.removeCollection);

module.exports = router;