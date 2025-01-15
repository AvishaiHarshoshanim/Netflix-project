const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
router.route('/')
    .get(moviesController.getMoviesByCategory)
    .post(moviesController.createMovie);

router.route('/:id')
    .get(moviesController.getMovie)
    .put(moviesController.updateMovie)
    .delete(moviesController.deleteMovie);

    
// route to get recommendations for id movie
router.get('/:id/recommend', moviesController.getRecommendations);

// route to add a user's view of id movie
router.post('/:id/recommend', moviesController.addUserMovie);

// Route to search movies by query
router.get('/search/:query', moviesController.searchMovies);

module.exports = router;
