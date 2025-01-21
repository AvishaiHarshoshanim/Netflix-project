const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const multer = require('multer');
const path = require('path');

// Set up multer to handle file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // You can change this directory to where you want to store the images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid file name collisions
    },
});

const upload = multer({ storage });

router.route('/')
    .get(moviesController.getMoviesByCategory)
    .post(upload.single('pictureFileToAdd'), moviesController.createMovie);

router.route('/all')
    .get(moviesController.getAllMovies);

router.route('/:id')
    .get(moviesController.getMovie)
    .put(upload.single('pictureFileToUpdate'), moviesController.updateMovie)
    .delete(moviesController.deleteMovie);

    
// route to get recommendations for id movie
router.get('/:id/recommend', moviesController.getRecommendations);

// route to add a user's view of id movie
router.post('/:id/recommend', moviesController.addUserMovie);

// Route to search movies by query
router.get('/search/:query', moviesController.searchMovies);

module.exports = router;
