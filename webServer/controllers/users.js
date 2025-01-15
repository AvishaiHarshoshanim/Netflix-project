const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const userService = require('../services/users');

// Create a user with the required fields
const createUser = async (req, res) => {
    try {
        const fields = ['userName', 'firstName', 'lastName', 'email', 'password'];
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

        // If picture is provided, validate that it exists in the uploads directory
        const picture = req.body.picture;
        if (picture) {
            // Create the full path for the picture
            const picturePath = path.join(__dirname, '../uploads', picture);

            // If the picture file does not exist, return an error
            if (!fs.existsSync(picturePath)) {
                return res.status(400).json({
                    errors: [`Picture file "${picture}" does not exist in the uploads directory.`],
                });
            }
        }
        const email = req.body.email; 
        const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailReg.test(email)) {
        return res.status(400).json({
            errors: ['Invalid email'], 
    });
}

        // Try to create the user
        const user = await userService.createUser(
            req.body.userName,
            req.body.firstName,
            req.body.lastName,
            picture ? `/uploads/${picture}` : undefined, // Set picture path
            req.body.email,
            req.body.password
        );

        if (user) {
            // If user is created successfully
            return res.status(201).json(user);
        } else {
            // If username or email is already taken
            return res.status(400).json({
                errors: ['Username is already taken or this email is already in the system.'],
            });
        }
    } catch (error) {
        console.error('Error in createUser:', error);
        return res.status(500).json({ error: 'Internal server error' });
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
};

module.exports = { createUser, getUser };