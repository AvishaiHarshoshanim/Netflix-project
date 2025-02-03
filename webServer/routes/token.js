const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/token');
const usersController = require('../controllers/users');

// Route for generating a token for user authentication
router.post('/', tokenController.processLogin);
router.get("/", usersController.isLoggedIn, usersController.index);
module.exports = router;