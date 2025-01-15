const User = require("../models/users"); 

// function to create a unique token for a user
const createToken = async (userName, password) => {
  const user = await User.findOne({ userName: userName });  // User search by userName

  // If the userName or password is incorrect
  if (!user || user.password !== password) {
    throw new Error("Invalid userName or password");  // This is not a message that will reach the client, but it is for us programmers to understand what the error is
  }

  return user._id; // The user._id is a unique identifier found in mongoDB (And this will be our token)
};

module.exports = { createToken };