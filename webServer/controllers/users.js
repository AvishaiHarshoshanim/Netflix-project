const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const userService = require('../services/users');
const jwt = require("jsonwebtoken");
const key = require("../config/config").secretKey;


const createUser = async (req, res) => {
    try {
        const fields = ['userName', 'name', 'password'];
        const missing = [];

        // Check for missing fields
        fields.forEach(field => {
            if (!req.body[field]) {
                missing.push(field);
            }
        });

        if (missing.length > 0) {
            return res.status(400).json({
                errors: [`The following field(s) are missing: ${missing.join(', ')}`],
            });
        }

        const picture = req.file ? req.file.filename : null;

        role = "user";
        if (req.body.userName == "admin") { // Here you can change the name of the user that you ant to be an admin
            role = "admin"
        }

        // Try to create the user
        const user = await userService.createUser(
            req.body.userName,
            req.body.name,
            picture ? `/uploads/${picture}` : undefined,
            req.body.password,
            role
        );

        if (user) {
            return res.status(201).json(user);
        } else {
            return res.status(400).json({
                errors: ['Username is already taken'],
            });
        }
    } catch (error) {
        console.error('Error in createUser:', error.message); // Log the actual error message
        return res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
};

// Return user data if it exists
const getUser = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ errors: ['Invalid user ID'] });
    }
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in getUser:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

    const isLoggedIn = (req, res, next) => {
        if (req.headers.authorization) {
          const token = req.headers.authorization.split(" ")[1];
          try {
            const data = jwt.verify(token, key);
            req.user = data;
            return next();
          } catch (err) {
            return res.status(401).send("Invalid Token");
          }
        } else {
          return res.status(403).send("Token required");
        }
      }


      const index = (req, res) => {
        res.json({ data: "secret data", user: req.user.username });
      };
      
      module.exports = { createUser, getUser, isLoggedIn, index };