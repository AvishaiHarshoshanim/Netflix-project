const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token');

// Route for generating a token for user authentication
router.post('/', tokenController.generateToken);

module.exports = router;