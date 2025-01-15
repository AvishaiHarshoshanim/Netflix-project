const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: { 
        type: String,
        required: true,
    },
    picture: {
        type: String, 
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true,
    },
    viewingHistory: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Movies'
        },
    ],
    idForRecServer: {
        type: Number,
        required: true,
        unique: true  // This field must be unique
    }
});

module.exports = mongoose.model('Users', UsersSchema);