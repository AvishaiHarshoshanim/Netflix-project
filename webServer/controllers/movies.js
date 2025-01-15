const mongoose = require('mongoose');
const movieService = require('../services/movies');
const usersService = require('../services/users');
const categoryService = require('../services/category');
const general = require('../services/general');

//shuffel the array
function shuffle(arr) {
    const array = [...arr]; 
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
//convert catregoryName to category Id
const getCategoryIdsFromNames = async (categoryNames) => {
    const categoryIds = [];
    for (const categoryName of categoryNames) {
        const categoryObj = await categoryService.getCategoryByName(categoryName.trim());
        if (categoryObj) {
            categoryIds.push(categoryObj._id); // Push valid ObjectId
        } else {
            throw new Error(`Category '${categoryName}' does not exist`);
        }
    }
    return categoryIds;
};
//function that returns a list of movies by promoted categories
const getMoviesByCategory = async (req, res) => {
    try {
        const userId = req.headers['userId'] || req.headers['userid'];

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if userId is a valid ObjectId
        if (!general.isValidObjectId(userId)) {
            return res.status(400).json({ errors: ['Invalid user ID'] });
        }

        // Check if the user exists
        const user = await usersService.getUserById(userId); // Await the function
        if (!user) {
            return res.status(404).json({ error: 'User ID was not found' });
        }

        // Fetch promoted categories and movies
        const promotedCategories = await movieService.getPromotedCategories();
        const moviesByCategories = [];

        for (const category of promotedCategories) {
            const movies = await movieService.getMoviesByCategory(category._id, userId);
            const shuffledMovies = shuffle(movies);
            moviesByCategories.push({
                category: category.name,
                movies: shuffledMovies.slice(0, 20),
            });
        }

        const watchAgainMovies = await movieService.getMoviesWatchedByUser(userId);
        const last20Movies = shuffle(watchAgainMovies.slice(-20));

        moviesByCategories.push({
            category: 'Watch Again',
            movies: last20Movies,
        });

        return res.status(200).json(moviesByCategories);
    } catch (error) {
        console.error('Error in getMoviesByCategory:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const createMovie = async (req, res) => {
    try {
        const fields = ['movieName', 'categories', 'director', 'actors'];
        const missing = []; 

    // Push the missing fields into missing
    fields.forEach(field => {
        if (!req.body[field]) {
            missing.push(field);
        }
    });
        if (missing.length > 0) {
            return res.status(400).json({
                errors: [`The following field/fields are missing: ${missing.join(', ')}`],
            });
        }
        
        if (!Array.isArray(req.body.categories)) {
            return res.status(400).json({
                error: 'The "categories" field must be an array.',
            });
        }

        // Validate that categories array doesn't contain empty strings
        if (req.body.categories) {
            const validCategories = req.body.categories.filter(category => category.trim().length > 0);
            
            if (validCategories.length === 0) {
                let noCategory = await mongoose.model('Category').findOne({ name: 'no_category' }).exec();
                if (!noCategory) {
                    noCategory = new mongoose.model('Category')({
                        name: 'no_category',
                    });
                    await noCategory.save();
                }
                return res.status(201).json(await movieService.createMovie(
                    req.body.movieName,
                    [noCategory._id],
                    req.body.director
                ));
            }

            try {
                const categoryIds = await getCategoryIdsFromNames(validCategories);
                return res.status(201).json(await movieService.createMovie(
                    req.body.movieName,
                    categoryIds,
                    req.body.director,
                    req.body.actors
                ));
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

        // If we get here, something went wrong with categories
        return res.status(400).json({ error: 'Invalid categories format' });
    } catch (error) {
        console.error('Error in createMovie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getMovie = async (req, res) => {
    try {
    const { id } = req.params;

    // Validate the ID format
    if (!general.isValidObjectId(id)) {
        return res.status(400).json({ errors: ['Invalid movie ID'] });
    }

        // Fetch the movie
        const movie = await movieService.getMovieById(id);

        // Check if the movie exists
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Return the movie data
        return res.json(movie);
    } catch (error) {
        console.error('Error in getMovie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const updateMovie = async (req, res) => {
    try {
        const fields = ['movieName', 'categories', 'director', 'actors'];
        const missing = []; 

    // Push the missing fields into missing
    fields.forEach(field => {
        if (!req.body[field]) {
            missing.push(field);
        }
    });
        const id = req.params.id;

        if (missing.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missing.join(', ')}`,
            });
        }
        if (!Array.isArray(req.body.categories)) {
            return res.status(400).json({
                error: 'The "categories" field must be an array.',
            });
        }

        if (!general.isValidObjectId(id)) {
            return res.status(400).json({ errors: ['Invalid movie ID'] });
        }

        // Validate categories array and handle empty strings
        if (req.body.categories) {
            const validCategories = req.body.categories.filter(category => category.trim().length > 0);
            
            if (validCategories.length === 0) {
                // Handle case where all categories are empty - use no_category
                let noCategory = await mongoose.model('Category').findOne({ name: 'no_category' }).exec();
                if (!noCategory) {
                    noCategory = new mongoose.model('Category')({
                        name: 'no_category',
                    });
                    await noCategory.save();
                }

                const updatedMovieData = {
                    ...req.body,
                    categories: [noCategory._id],
                };

                const movie = await movieService.replaceMovie(id, updatedMovieData);
                if (!movie) {
                    return res.status(404).json({ error: 'Movie not found' });
                }
                return res.json(movie);
            }

            try {
                // Process valid categories
                const categoryIds = await getCategoryIdsFromNames(validCategories);
                const updatedMovieData = {
                    ...req.body,
                    categories: categoryIds,
                };

                const movie = await movieService.replaceMovie(id, updatedMovieData);
                if (!movie) {
                    return res.status(404).json({ error: 'Movie not found' });
                }
                return res.json(movie);
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

        // If we get here, something went wrong with categories
        return res.status(400).json({ error: 'Invalid categories format' });
    } catch (error) {
        console.error('Error in updateMovie:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await movieService.deleteMovieById(req.params.id);
      
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        return res.status(204).send("movie deleted sucssesfuly");
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


// function for receiving movie recommendations by movie ID
async function getRecommendations(req, res) {
    const movieId = req.params.id;  
    const userId = req.headers['userId'] || req.headers['userid'];
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required in headers' });
    }

    if (!general.isValidObjectId(userId)) {
        return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    if (!general.isValidObjectId(movieId)) {
        return res.status(400).json({ errors: ['Invalid movie ID'] });
    }
        
    // Checking if the userId exists
    const userExists = await movieService.isUserExists(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found" });
    }

    // Checking if the movieId exists
    const movieExists = await movieService.isMovieExists(movieId);
    if (!movieExists) {
        return res.status(404).json({ message: "Movie not found" });
    }

    try {
        const recommendations = await movieService.getRecommendationsFromServer(userId, movieId);

        // The request was successful but there is no content to return
        if (recommendations.length === 0) {
            return res.status(204).send();
        }

        res.json({ recommendations }); // Send the recommendations as json to the client
    } catch (err) {
        // Check if it's a user or movie not found error
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        } else if (err.message === "Movie not found") {
            return res.status(404).json({ error: err.message });
        } else {
            res.status(500).json({ message: "Error fetching recommendations", error: err.message });
        }
    }
}


// Add a movie to the user function
async function addUserMovie(req, res) {
    // Receiving the data from the request
    const movieId = req.params.id; // 'movieId' is taken directly from the URL
    const userId = req.headers['userId'] || req.headers['userid'];
    if (!userId) {
    return res.status(400).json({ error: 'User ID is required in headers' });
    }

    if (!general.isValidObjectId(userId)) {
        return res.status(400).json({ errors: ['Invalid user ID'] });
    }

    if (!general.isValidObjectId(movieId)) {
        return res.status(400).json({ errors: ['Invalid movie ID'] });
    }
    
    // Checking if the userId exists
    const userExists = await movieService.isUserExists(userId);
    if (!userExists) {
        return res.status(404).json({ message: "User not found" });
    }

    // Checking if the movieId exists
    const movieExists = await movieService.isMovieExists(movieId);
    if (!movieExists) {
        return res.status(404).json({ message: "Movie not found" });
    }


    try {

        const mongoResponse = await movieService.addMoviesToViewingHistory(userId, movieId);

        // Check the response from addMoviesToViewingHistory
        if (mongoResponse === "Movie already exists in viewing history") {
            return res.status(404).json({ message: "Movie already exists in viewing history" }); 
        }

        // Adding the movie to the userId on the server of the recommendation system
        const response = await movieService.addUserMovieToServer(userId, movieId);

        // Checking the response from the server
        if (response.trim() === "201 Created") {
            // Adding the movie to mongoDB
            await movieService.addMoviesToViewingHistory(userId, movieId);
            return res.status(201).send("201 Created");
        } else if (response.trim() === "204 No Content") {
            // Adding the movie to mongoDB
            await movieService.addMoviesToViewingHistory(userId, movieId);
            return res.status(201).send("201 Created");
        } else if (response.trim() === "404 Not Found") {
            return res.status(404).send("404 Not Found");
        } else if (response.trim() === "Movie not found" || response.trim() === "User not found") {
                return res.status(404).send("404 Not Found");      
        }  else if (response.trim() === "Movie already exists in viewing history") {
            return res.status(404).send("404 Not Found");
    }
    } catch (err) {
        res.status(500).json({ message: "Error adding movie to user", error: err.message });
    }
}


// Function to search movies by query
async function searchMovies(req, res) {
    const query = req.params.query;  // The search term is in the URL

    try {
        const movies = await movieService.searchMoviesInDatabase(query);

        // Checking if there are no suitable movies
        if (movies.length === 0) {
            return res.status(204).send(); // No movies found
        }

        res.json({ results: movies });   // 200 ok return (default)
    } catch (err) {
        res.status(500).json({ message: "Error searching for movies", error: err.message });
    }
}


module.exports = {createMovie, getMovie, updateMovie, deleteMovie, getMoviesByCategory, getRecommendations, addUserMovie, searchMovies};