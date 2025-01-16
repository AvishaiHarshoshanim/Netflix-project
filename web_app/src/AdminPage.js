import React, { useState } from 'react';
import './AdminPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newMovie, setNewMovie] = useState({ title: '', category: '' });

  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
    setMovies(movies.filter((m) => m.category !== category));
  };

  const addMovie = () => {
    if (newMovie.title && newMovie.category) {
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
        <ul className="list-group">
          {categories.map((category, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between">
              {category}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteCategory(category)}
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
                <option key={index} value={category}>
                  {category}
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
