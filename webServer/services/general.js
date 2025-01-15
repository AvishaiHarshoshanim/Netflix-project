const mongoose = require('mongoose');
//checks if the id is in valid format
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {isValidObjectId};