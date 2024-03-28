const express = require('express');
const { getDustbinStatus } = require('../controllers/dustbin.controllers');
const router = express.Router();

router.route('/status').get(getDustbinStatus);

module.exports = router;