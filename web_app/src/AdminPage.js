import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [promoted, setPromoted] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: '', category: '' });

  // Fetch categories from the server on page load
  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  const addCategory = () => {
    if (newCategory) {
      fetch('http://localhost:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory, promoted: promoted }),
      })
        .then((response) => response.json())
        .then((data) => {
          setCategories([...categories, data]);
          setNewCategory('');
          setPromoted(false);
        })
        .catch((error) => console.error('Error adding category:', error));
    }
  };

  const deleteCategory = (category) => {
    fetch(`http://localhost:5000/api/categories/${category}`, {
      method: 'DELETE',
    })
      .then(() => {
        setCategories(categories.filter((c) => c !== category));
        setMovies(movies.filter((m) => m.category !== category));
      })
      .catch((error) => console.error('Error deleting category:', error));
  };

  const addMovie = () => {
    if (newMovie.title && newMovie.category) {
      // You would implement a similar POST call for adding movies to the server here.
      setMovies([...movies, newMovie]);
      setNewMovie({ title: '', category: '' });
    }
  };

  const deleteMovie = (title) => {
    setMovies(movies.filter((m) => m.title !== title));
  };

  return (
    <div className="admin-page container">
      <h1 className="text-center mb-4">Netflix Admin Page</h1>

      {/* Category Management */}
      <div className="mb-5">
        <h2>Manage Categories</h2>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addCategory}>
            Add Category
          </button>
        </div>

        {/* Checkbox for Promoted Category */}
        <div className="form-check mb-3">
          <label className="promoted-label">Promoted:</label>
          <input
            type="checkbox"
            className="form-check-input"
            checked={promoted}
            onChange={(e) => setPromoted(e.target.checked)}
          />
        </div>

        <ul className="list-group">
          {categories.map((category, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between">
              {category.name} {category.promoted && <span className="badge bg-warning">Promoted</span>}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteCategory(category.name)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

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
    </div>
  );
};

export default AdminPage;
