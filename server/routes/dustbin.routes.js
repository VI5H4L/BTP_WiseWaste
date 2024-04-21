const express = require('express');
const { updateDustbinFromThingSpeak,getDustbinStatus } = require('../controllers/dustbin.controllers');
const router = express.Router();

router.route('/status').get(updateDustbinFromThingSpeak,getDustbinStatus);

module.exports = router;