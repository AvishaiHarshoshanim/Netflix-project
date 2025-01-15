const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    name: {
        type: String,    // The name of the counter
        required: true, 
        unique: true  // Each counter will have a unique name
    },
    value: {
        type: Number,  // The current value of the counter
        required: true
    }
});

module.exports = mongoose.model('Counter', CounterSchema);