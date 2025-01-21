const mongoose = require('mongoose');
const Category = require('../models/category');

const createCategory = async (name, promoted) => {
    try {
        // Create a new category
        const category = new Category({ name : name });
        if (promoted !== undefined) category.promoted = promoted; 
        return await category.save(); // Return the saved category
    } catch (err) {
        console.log(err)
        // If there is a duplicate key error (unique constraint violation)
        if (err.code === 11000) {
            throw new Error('Category name must be unique');
        } else {
            // If any other error occurs
            throw new Error('Error creating category');
        }
    }
};

const getCategoryById = async (id) => { return await Category.findById(id); };

const getCategoryByName = async (name) => {
    return await Category.findOne({ name: name });
};

const getCategories = async () => { return await Category.find({}); };

const updateCategory = async (categoryId, replace) => {
    try {
        const category = await getCategoryById(categoryId);
        if (!category) throw new Error('Category not found');
        return await Category.findByIdAndUpdate(categoryId, replace, { new: true });
    } catch (err) {
        // If there is a duplicate key error (unique constraint violation)
        if (err.code === 11000) {
            throw new Error('Category name must be unique');
        } else {
            // If any other error occurs
            throw new Error('Error editing category');
        }
    }
};

const deleteCategory = async (id) => {
    // Get the category that is about to be deleted
    const category = await getCategoryById(id);
    if (!category) return null;

    // Get the "no_category" category (or create it if it doesn't exist)
    let noCategory = await mongoose.model('Category').findOne({ name: 'no_category' }).exec();
    if (!noCategory) {
        noCategory = new mongoose.model('Category')({
            name: 'no_category',
        });
        await noCategory.save();
    }

    // Find all movies that have the deleted category
    const movies = await mongoose.model('Movies').find({ categories: category._id }).exec();

    for (let movie of movies) {
        // Remove the deleted category from the movie's categories
        await movie.updateOne({
            $pull: { categories: category._id },
        });

        // Re-fetch the movie to ensure the latest state of the categories array
        const updatedMovie = await mongoose.model('Movies').findById(movie._id).exec();

        // If after removal the movie has no categories left, replace it with "no_category"
        if (updatedMovie.categories.length === 0) {
            await mongoose.model('Movies').findOneAndUpdate(
                { _id: updatedMovie._id },
                { $push: { categories: noCategory._id } },
                { new: true } // Return the updated movie
            );
        }
    }

    // Delete the category from the Category collection
    await category.deleteOne();

    return category;
};

module.exports = {createCategory, getCategoryById, getCategories, updateCategory, deleteCategory, getCategoryByName}