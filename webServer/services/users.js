const Users = require('../models/users');
const Counter = require('../models/counters');

// function to generate a unique identifier
const getNextIdForRecServer = async () => {
    const counter = await Counter.findOneAndUpdate(  // Creating the counter
        { name: 'userIdCounter' },  // The name of the counter
        { $inc: { value: 1 } },     // Increasing the value by 1
        { new: true, upsert: true }  // Creating the counter if this is the first movie
    );
    return counter.value;    // Returning the current value of the counter
};

// Function that creates a new user
const createUser = async (userName, firstName, lastName, picture, email, password) => {
    const idForRecServer = await getNextIdForRecServer();  
  
    // Check if a user with the given userName already exists
    const existingUser = await Users.findOne({ userName });
    if (existingUser) {
        return null;
    }
    if(await Users.findOne({ email })) {
        return null;
    }

    // Create a new user
    const user = new Users({userName, firstName, lastName, email, password, idForRecServer});

    // Set the picture if provided
    if (picture) {
        user.picture = picture;
    }

    return await user.save();
};

// Function to fetch user information by ID
const getUserById = async (id) => {
    const user = await Users.findById(id).select('-password -idForRecServer');
    return user;
};

// Function to fetch all users
const getUsers = async () => {
    return await Users.find({});
};

module.exports = { createUser, getUserById, getUsers };