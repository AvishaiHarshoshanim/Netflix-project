const Users = require('../models/users');
const Movie = require('../models/movies');
const Categories = require('../models/category');
const Counter = require('../models/counters');
const mongoose = require('mongoose');


const net = require('net'); // This module allows us to connect to servers via TCP, to send and receive data.
const { error } = require('console');

const getNextMovieIdForRecServer = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: 'movieIdCounter' }, // The name of the counter
        { $inc: { value: 1 } },     // Increasing the value by 1
        { new: true, upsert: true } // Creating the counter if this is the first movie
    );
    return counter.value; // Returning the current value of the counter
};

const getMoviesWatchedByUser = async (id) => {
    const user = await Users.findById(id).populate('viewingHistory');
    return user ? user.viewingHistory : [];
};

const getPromotedCategories = async () => {
    return await Categories.find({ promoted: true });
};

const getAllCategories = async () => {
    try {
        return await Categories.find(); 
    } catch (err) {
        throw new Error("Error fetching categories: " + err.message);
    }
};

// return movies according to thier categories
const getMoviesByCategory = async (categoryId, userId) => {
    const watchedMovieIds = await getMoviesWatchedByUser(userId);
    return await Movie.find({
        categories: { $in: [categoryId] },
        _id: { $nin: watchedMovieIds },
    }).populate('categories');
};

const getAllMovies = async () => { return await Movie.find({}); };

const createMovie = async (movieName, categories, director, actors, imageName, imageURL, videoName, videoURL) => {
    try {
        // Check if the movie already exists
        const existingMovie = await Movie.findOne({ movieName: movieName });
        if (existingMovie) {
            throw new Error(`Movie with name "${movieName}" already exists`);
        }

        // Get the next movie ID for the recommendation server
        const movieIdForRecServer = await getNextMovieIdForRecServer();

        // Set up the movie object
        const movie = new Movie({
            movieName,
            categories,
            director,
            actors,
            movieIdForRecServer,
        });

        // If there's a picture uploaded, save the file path and name
        if (imageName) {
            movie.imageName = imageName;
            movie.imageURL = imageURL;
        }

        // If there's a video uploaded, save the file path and name
        if (videoName) {
            movie.videoName = videoName;
            movie.videoURL = videoURL;
        }

        // Save the movie to the database
        const savedMovie = await movie.save();
        return savedMovie;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getMovieById = async (movieId) => {
    const movie = await Movie.findById(movieId)
        .select('-movieIdForRecServer')
        .populate('categories');

    // Convert categories to an array of strings
    const transformedMovie = movie.toObject();
    transformedMovie.categories = transformedMovie.categories.map(cat => cat.name); 

    return transformedMovie;
};

const replaceMovie = async (movieId, replace) => {
    return await Movie.findByIdAndUpdate(movieId, replace, { new: true }).populate('categories');
};

async function deleteMovieFromRecServer(userId, movieId) {
    try {
        const user = await Users.findOne({ _id: userId });
        if (!user) throw new Error("User not found");
        const idForRecServer = user.idForRecServer;

        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) throw new Error("Movie not found");
        const movieIdForRecServer = movie.movieIdForRecServer;

        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(process.env.REC_TO_WEB_PORT, process.env.REC_TO_WEB_IP, () => {
                const data = `DELETE ${idForRecServer} ${movieIdForRecServer}`;
                client.write(data + '\n'); // Sending a deletion request to the recommendations server
            });

            // Receive a response from the server
            client.on('data', (data) => {
                resolve(data.toString());
                client.end(); // Closing the connection
            });

            client.on('error', (err) => {
                reject(err);
            });

            client.on('close', () => { });
        });
    } catch (err) {
        throw new Error(err.message);
    }
}


const deleteMovieById = async (movieId) => {
    try {
        //  Retrieving all users who have the movie in their viewing history
        const users = await Users.find({ viewingHistory: movieId });

        // Updating the users' viewing history
        await Users.updateMany(
            { viewingHistory: movieId },
            { $pull: { viewingHistory: movieId } }
        );

        // Deleting the movie from the recommendations server for each user
        for (const user of users) {
            await deleteMovieFromRecServer(user._id, movieId);
        }

        // Deleting the movie from mongo
        const movie = await Movie.findByIdAndDelete(movieId);

        return movie;
    } catch (err) {
        throw new Error(err.message);
    }
};


// function that sends the data and receives a list of recommended movies
async function getRecommendationsFromServer(userId, movieId) {
    try {
        const user = await Users.findOne({ _id: userId });
        if (!user) throw new Error("User not found");
        const idForRecServer = user.idForRecServer;

        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) throw new Error("Movie not found");
        const movieIdForRecServer = movie.movieIdForRecServer;

        return new Promise((resolve, reject) => {
            const client = new net.Socket(); // This object is used to establish a connection with the server.

            // Login to the recommendation system
            client.connect(process.env.REC_TO_WEB_PORT, process.env.REC_TO_WEB_IP, () => {
                // Sending userid and movieid to the server from exercise 2
                const data = `GET ${idForRecServer} ${movieIdForRecServer}`;
                client.write(data + '\n');  // Sending the string to the server
            });

            // Receive a response from the server
            client.on('data', async (data) => {  // 'data' contains the information received from the server.
                const recommendations = data.toString().trim().split("\n");
                const movieIdsForRecServer = recommendations.slice(1).join(" ").split(" ").filter(id => id);

                // Convert movie IDs from recommendation server back to MongoDB _id
                const convertedMovies = await Promise.all(
                    movieIdsForRecServer.map(async (idForRec) => {
                        const movie = await Movie.findOne({ movieIdForRecServer: idForRec });
                        return movie ? movie : null;
                    })
                );

                resolve(convertedMovies.filter(movie => movie)); // Return only valid movies
                client.end(); // Closing the connection with the server from exercise 2
            });

            client.on('error', (err) => {
                reject(err);
            });
        });
    } catch (err) {
        throw new Error(err.message);
    }
}


async function addUserMovieToServer(userId, movieId) {
    try {
        const user = await Users.findOne({ _id: userId });
        if (!user) resolve("User not found");

        const idForRecServer = user.idForRecServer;
        const movie = await Movie.findOne({ _id: movieId });
        if (!movie) resolve("Movie not found");
        const movieIdForRecServer = movie.movieIdForRecServer;
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            // Connecting to the server of the recommendation system
            client.connect(process.env.REC_TO_WEB_PORT, process.env.REC_TO_WEB_IP, () => {
                const postCommand = `POST ${idForRecServer} ${movieIdForRecServer}`;
                client.write(postCommand + '\n'); // Sending the POST command to the server
            });

            let responseReceived = false; // Flag to track if response has been handled

            // Handle the response from the server (for both POST and PATCH)
            client.on('data', (data) => {
                const response = data.toString().trim();

                if (!responseReceived) {
                    if (response === "404 Not Found") {
                        // If POST fails, try PATCH
                        const patchCommand = `PATCH ${idForRecServer} ${movieIdForRecServer}`;
                        client.write(patchCommand + '\n');  // Sending the PATCH command
                    } else {
                        // POST succeeded or PATCH succeeded, resolve with the response
                        responseReceived = true; // Set flag to indicate that response was handled
                        resolve(response); // Resolve with the first successful response
                        client.end(); // Close connection after response is received
                    }
                } else {
                    // After the PATCH request, we handle its response here
                    responseReceived = true; // Ensure we don't resolve multiple times
                    resolve(response); // Resolve with the PATCH response
                    client.end(); // Close connection after PATCH response
                }
            });

            // Handle any connection errors
            client.on('error', (err) => {
                console.error("Connection error:", err);
                reject(err); // Reject if there is an error with the connection
            });

            // Handle the connection close event
            client.on('close', () => {
                //console.log("Connection closed.");
            });
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

// function to update mongoDB
async function addMoviesToViewingHistory(userId, movieId) {
    try {
        const user = await Users.findOne({ _id: userId });
        if (!user) {
            throw new Error("user not found in MongoDB");
        }

        if (user.viewingHistory.includes(movieId)) {
            return ("Movie already exists in viewing history");
        }
        user.viewingHistory.push(movieId);
        await user.save();

    } catch (err) {
        throw new Error(err.message);
    }
}

async function isUserExists(userId) {
    try {
        const user = await Users.findOne({ _id: userId });
        return !!user; // Conversion the value of user to boolean
    } catch (err) {
        console.error("Error in isUserExists:", err.message);
        return false;
    }
}


async function isMovieExists(movieId) {
    try {
        const movie = await Movie.findOne({ _id: movieId });
        return !!movie;
    } catch (err) {
        console.error("Error in isMovieExists:", err.message);
        return false;
    }
}

// Function to search movies in the database by query
async function searchMoviesInDatabase(query) {
    try {
        const movies = await Movie.find({
            $or: [
                { movieName: { $regex: query, $options: 'i' } },
                { categories: { $in: await Categories.find({ name: { $regex: query, $options: 'i' } }).then(categories => categories.map(c => c._id)) } },
                { director: { $regex: query, $options: 'i' } },
                { actors: { $regex: query, $options: 'i' } },
            ]
        });
        return movies;

    } catch (err) {
        throw new Error("Error searching for movies: " + err.message);
    }
}


module.exports = { getMoviesWatchedByUser, getPromotedCategories, getMoviesByCategory, createMovie, getMovieById, replaceMovie, deleteMovieById, getRecommendationsFromServer, addUserMovieToServer, searchMoviesInDatabase, isUserExists, addMoviesToViewingHistory, isMovieExists, getAllMovies, getAllCategories };