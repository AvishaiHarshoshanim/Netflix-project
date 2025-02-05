const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    userName: { 
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    picture: { type: String },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user",
      },
    viewingHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movies',
        },
    ],
    idForRecServer: {
        type: Number,
        required: true,
        unique: true,
    }
});
module.exports = mongoose.model('Users', UsersSchema);