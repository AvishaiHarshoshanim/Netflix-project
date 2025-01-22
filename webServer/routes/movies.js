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
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname));
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
