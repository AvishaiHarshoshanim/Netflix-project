const mongoose = require('mongoose');
const categoryService = require('../services/category');

const createCategory = async (req, res) => {
    try {
        // Try to create the category
        const newCategory = await categoryService.createCategory(req.body.name, req.body.promoted);
        res.status(201).json(newCategory); // Send the created category with a 201 status code
    } catch (err) {
        // If there's an error (e.g., duplicate category name)
        res.status(400).json({ errors: [err.message] });
    }
};

const getCategories = async (req, res) => {
    res.json(await categoryService.getCategories());
};

const getCategory = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ errors: ['Invalid category ID'] });
    }

    // If the ID is valid, fetch the category by ID
    const category = await categoryService.getCategoryById(id);

    // If the category doesn't exist, return 404
    if (!category) {
        return res.status(404).json({ errors: ['Category not found'] });
    }

    // Return the category
    res.json(category);
};

const updateCategory = async (req, res) => {
    const updatedCtegoryData = {...req.body};
    try {
        // Try to update the category
        const updatedCategory = await categoryService.updateCategory(req.params.id, updatedCtegoryData);
        res.status(204).json("Category updated sucssesfuly"); // Send the created category with a 201 status code
    } catch (err) {
        if (err.message == "Category not found") {
            res.status(404).json({ errors: ['Category not found'] });
        } else {
            // If there's an error (e.g., duplicate category name)
            res.status(400).json({ errors: [err.message] });
        }
    }
};

const deleteCategory = async (req, res) => {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) {
        return res.status(404).json({ errors: ['Category not found'] });
    }
    return res.status(204).send("Category deleted sucssesfuly");
};

module.exports = {createCategory, getCategories, getCategory, updateCategory, deleteCategory };