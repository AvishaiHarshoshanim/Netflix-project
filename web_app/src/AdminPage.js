import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: String, promoted: Boolean, _id: String });
  const [newMovie, setNewMovie] = useState({ movieName: String, categoryArray: Array, director: String, actors: String, _id: String });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);

  // Fetch categories from the server on page load
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

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
    fetch(`http://localhost:5000/api/categories/${categoryId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCategories(categories.filter((c) => c._id !== categoryId));
        setMovies(movies.filter((m) => m.categoryArray.some(c => c._id === categoryId)));
      })
      .catch((error) => console.error('Error deleting category:', error));
  };

  const updateCategory = (category) => {
    fetch(`http://localhost:5000/api/categories/${category._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    })
    .then((response) => {
      if (response.status == 400) {
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
        // Reset the editing state
        setEditingCategory(null);
      } else {
        throw new Error('Failed to update category');
      }
    })
      .catch((error) => console.error('Error updating category:', error));
  };


  const addMovie = () => {
    if (!newMovie.movieName) {
      alert("Movie name is required");
      return;
    }
    if (!newMovie.director) {
      alert("Director name is required");
      return;
    }
      fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setMovies([...movies, data]);
            setNewMovie({ movieName: '', categoryArray: [], director: '', actors: '' });
          }
        })
        .catch((error) => console.error('Error adding movie:', error));
  };

  const deleteMovie = (title) => {
    setMovies(movies.filter((m) => m.title !== title));
  };

  return (
    <div>
      <header className='admin-page-header'>
        <h1 className="text-center mb-4">Netflix Admin Page</h1>
        <ul className='admin-page-managment'>
          <li className='managment-block'>
            {/* Category Management */}
            <div className="mb-5">
              <h2>Manage Categories</h2>
              <div className="input-group mb-3">
                {/* Text Input for Category Name */}
                <label htmlFor="categoryName" className="form-label">
                <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="category's name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />

                {/* Checkbox for Promoted */}
                <div className="form-check d-flex align-items-center ms-1">
                  <label
                    className="form-check-label me-5 text-white"
                    htmlFor="promotedCheckbox"
                  >
                    Promoted:
                  </label>
                  <input
                    type="checkbox"
                    id="promotedCheckbox"
                    className="form-check-input"
                    checked={newCategory.promoted}
                    onChange={(e) => setNewCategory({ ...newCategory, promoted: e.target.checked })}
                  />
                </div>


                {/* Button to Add Category */}
                <button className="btn btn-primary ms-3" onClick={addCategory}>
                  Add Category
                </button>
              </div>
            </div>


            <ul className="list-group">
              {categories.map((category) => (
                <li key={category._id} className="list-group-item d-flex justify-content-between">
                  {editingCategory?._id === category._id ? (
                    <div className="d-flex w-100">
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                      />
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={editingCategory.promoted}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, promoted: e.target.checked })
                        }
                      />
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateCategory(editingCategory)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingCategory(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        {category.name}{" "}
                        {category.promoted && <span className="badge bg-warning">Promoted</span>}
                      </div>
                      <div>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => setEditingCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCategory(category._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </li>
          <li className='managment-block'>
            {/* Movie Management */}
            <div>
              <h2>Manage Movies</h2>
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Movie Title"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={newMovie.category}
                    onChange={(e) => setNewMovie({ ...newMovie, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-success" onClick={addMovie}>
                    Add Movie
                  </button>
                </div>
              </div>
              <ul className="list-group mt-3">
                {movies.map((movie, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    {movie.title} <span>({movie.category})</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteMovie(movie.title)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </header >
    </div >
  );
};

export default AdminPage;
