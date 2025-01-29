const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
        }
        cb(null, dir); // Store both images and videos in the same directory
    },
    filename: (req, file, cb) => {
        const fileName = path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now();
        cb(null, fileName + path.extname(file.originalname)); // Append file extension based on type (image/video)
    },
});

const upload = multer({ storage });

// Define fields for both image and video uploads
router.route('/')
    .get(moviesController.getMoviesByCategory)
    .post(upload.fields([
        { name: 'pictureFileToAdd', maxCount: 1 },
        { name: 'videoFileToAdd', maxCount: 1 },
    ]), moviesController.createMovie);

router.route('/all')
    .get(moviesController.getAllMovies);


router.route('/:id')
    .get(moviesController.getMovie)
    .put(upload.fields([
        { name: 'pictureFileToUpdate', maxCount: 1 },
        { name: 'videoFileToUpdate', maxCount: 1 },
    ]), moviesController.updateMovie)
    .delete(moviesController.deleteMovie);
    
// route to get recommendations for id movie
router.get('/:id/recommend', moviesController.getRecommendations);

// route to add a user's view of id movie
router.post('/:id/recommend', moviesController.addUserMovie);

// Route to search movies by query
router.get('/search/:query', moviesController.searchMovies);

module.exports = router;
