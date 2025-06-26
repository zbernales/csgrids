const express = require('express');
const router = express.Router();
const { handlePlayerPost } = require('../controllers/playerController');

// POST route for player selection
router.post('/', handlePlayerPost);

module.exports = router;