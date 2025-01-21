const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
    movieName: {
        type: String,
        required: true,
        unique: true
    },
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category'
        }
    ],
    director: { 
        type: String,
        required: true,
    },
    actors: { 
        type: String,
    },
    picture: {
        type: String, 
    },
    movieIdForRecServer: { 
        type: Number,
        required: true,
        unique: true   // // This field must be unique
    }
});

module.exports = mongoose.model('Movies', MoviesSchema);