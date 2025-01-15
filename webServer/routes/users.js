const express = require('express');
var router = express.Router();
const usersController = require('../controllers/users');
router.route('/')
.post(usersController.createUser);
router.route('/:id')
.get(usersController.getUser)
module.exports = router;