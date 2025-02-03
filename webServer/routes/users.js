const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const usersController = require('../controllers/users');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads'; // Directory to store uploaded files
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Routes
router
    .route('/')
    .post(upload.single('picture'), usersController.createUser); // Handle file uploads with multer

router
    .route('/:id')
    .get(usersController.getUser);

module.exports = router;