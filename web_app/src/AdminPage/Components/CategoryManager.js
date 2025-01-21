import React, { useState } from 'react';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';

const CategoryManager = ({ categories, setCategories, movies, setMovies }) => {
    const [newCategory, setNewCategory] = useState({ name: String, promoted: Boolean, _id: String });
    const [editingCategory, setEditingCategory] = useState(null);

    const addCategory = () => {
        // Check if category name is empty
        if (!newCategory.name) {
            alert("Category name is required");
            return;
        }

        fetch('http://localhost:5000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        })
            .then((response) => {
                if (response.status === 400) {
                    // Handle the 400 Bad Request error
                    return response.json().then((data) => {
                        if (data.errors && data.errors.includes("Category name must be unique")) {
                            alert("Category name is already used");
                        }
                    });
                } else if (response.status === 201) {
                    // Successfully created category
                    return response.json();
                } else {
                    // Catch all other errors
                    throw new Error('Failed to create category');
                }
            })
            .then((data) => {
                if (data) {
                    // If the category was created successfully, update the state
                    setCategories([...categories, data]);
                    setNewCategory({ name: '', promoted: false });
                }
            })
            .catch((error) => {
                // Log any errors that occur
                console.error('Error adding category:', error);
            });
    };

    const deleteCategory = (categoryId) => {
        const categoryName = categories.find((c) => c._id === categoryId)?.name;
        if (categoryName === 'no_category') {
            alert("no_category canot be deleted")
            return;
        }
        fetch(`http://localhost:5000/api/categories/${categoryId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setCategories(categories.filter((c) => c._id !== categoryId));
                setMovies((prevMovies) =>
                    prevMovies.map((movie) => ({
                        ...movie,
                        categories: movie.categories.filter((catName) => catName !== categoryName), // Remove the deleted category
                    }))
                )
            })
            .catch((error) => console.error('Error deleting category:', error));
    };

    const updateCategory = (category) => {
        const categoryName = categories.find((c) => c._id === category._id)?.name;
        if (categoryName === 'no_category') {
            alert("no_category canot be edited")
            return;
        }
        fetch(`http://localhost:5000/api/categories/${category._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category),
        })
            .then((response) => {
                if (response.status === 400) {
                    // If the response is not OK (e.g., 400)
                    return response.json().then((data) => {
                        // Check if the error is related to uniqueness
                        if (data.errors && data.errors.includes("Category name must be unique")) {
                            alert("Category name is already used");
                        }
                        return;
                    });
                } else if (response.status === 204) {
                    // No content to return, but update the UI
                    // Update the category in the state based on the current editingCategory
                    setCategories((prevCategories) =>
                        prevCategories.map((c) =>
                            c._id === category._id ? { ...c, ...category } : c
                        )
                    );

                    // Update the category name in the movies state
                    setMovies((prevMovies) =>
                        prevMovies.map((movie) => ({
                            ...movie,
                            categories: movie.categories.map((catName) =>
                                catName === categoryName ? category.name : catName
                            ),
                        }))
                    );

                    // Reset the editing state
                    setEditingCategory(null);
                } else {
                    throw new Error('Failed to update category');
                }
            })
            .catch((error) => console.error('Error updating category:', error));
    };

    return (
        <div className='mb-5'>
            <h2>Manage Categories</h2>
            <CategoryForm
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                addCategory={addCategory}
            />
            <CategoryList
                categories={categories}
                editingCategory={editingCategory}
                setEditingCategory={setEditingCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
            />
        </div>
    );
};

export default CategoryManager;