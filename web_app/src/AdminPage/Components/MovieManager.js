import React, { useState } from 'react';
import MovieList from './MovieList';
import MovieForm from './MovieForm';

const MovieManager = ({ categories, movies, setMovies }) => {
  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    _id: '',
    movieName: '',
    categories: [],
    director: '',
    actors: '',
    pictureName: '',
    pictureFile: null,
    pictureURL: '', 
  });

  const addMovie = () => {
    if (!newMovie.movieName) {
      alert("Movie name is required");
      return;
    }
    if (!newMovie.director) {
      alert("Director name is required");
      return;
    }

    // Prepare the movie data (excluding the file)
    const movieData = {
      movieName: newMovie.movieName,
      director: newMovie.director,
      actors: newMovie.actors,
      categories: newMovie.categories,
    };

    const formData = new FormData();

    // Append movie data as JSON string
    formData.append('movieData', JSON.stringify(movieData));

    // Append the file
    if (newMovie.pictureFile) {
      formData.append('pictureFileToAdd', newMovie.pictureFile);
    }

    fetch('http://localhost:5000/api/movies', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status === 400) {
          // Handle the 400 Bad Request error
          return response.json().then((data) => {
            if (data.errors && data.errors.includes("Movie with name")) {
              alert("Movie name is already used");
            }
            if (data.error) {
              alert(data.error)
            } else if (data.errors) {
              alert(data.errors)
            }
            return;
          });
        } else if (response.status === 201) {
          // Successfully created movie
          return response.json();
        } else {
          // Catch all other errors
          throw new Error('Failed to create movie');
        }
      })
      .then((addedMovie) => {
        if (addedMovie) {
          const transformedCategories = addedMovie.categories.map((categoryId) => {
            const category = categories.find((cat) => cat._id === categoryId);
            return category ? category.name : 'Unknown'; // Replace with category name or 'Unknown' if not found
          });

          // Create a transformed movie object
          const transformedMovie = {
            ...addedMovie,
            categories: transformedCategories, // Replace IDs with names
          };

          const MovieToSave = {
            ...transformedMovie,
            pictureFile: newMovie.pictureFile,
            pictureName: newMovie.pictureName,
            pictureURL: newMovie.pictureURL
          };

          setMovies([...movies, MovieToSave]);

          setNewMovie({ movieName: '', categories: [], director: '', actors: '', pictureName: '', pictureFile: null });
        }
      })
      .catch((error) => console.error('Error adding movie:', error));
  };

  const deleteMovie = (movieId) => {
    fetch(`http://localhost:5000/api/movies/${movieId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setMovies(movies.filter((c) => c._id !== movieId));
      })
      .catch((error) => console.error('Error deleting movie:', error));
  };

  const updateMovie = (movie) => {
    if (!editingMovie.movieName) {
      alert("Movie name is required");
      return;
    }
    if (!editingMovie.director) {
      alert("Director name is required");
      return;
    }

    // Prepare the movie data (excluding the file)
    const movieData = {
      movieName: editingMovie.movieName,
      director: editingMovie.director,
      actors: editingMovie.actors,
      categories: editingMovie.categories,
    };

    const formData = new FormData();

    // Append movie data as JSON string
    formData.append('movieData', JSON.stringify(movieData));

    // Append the file
    if (editingMovie.pictureFile) {
      formData.append('pictureFileToUpdate', editingMovie.pictureFile);
    }

    fetch(`http://localhost:5000/api/movies/${movie._id}`, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => {
        if (response.status === 400) {
          // If the response is not OK (e.g., 400)
          return response.json().then((data) => {
            // Check if the error is related to uniqueness
            if (data.errors && data.errors.includes("duplicate key error")) {
              alert("Movie name is already used");
            }
            if (data.error) {
              alert(data.error)
            } else if (data.errors) {
              alert(data.errors)
            }
            return;
          });
        } else if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Failed to update movie');
        }
      })
      .then((updatedMovie) => {
        if (updatedMovie) {
          const transformedMovie = {
            ...updatedMovie,
            categories: updatedMovie.categories.map((category) => category.name),
            pictureFile: editingMovie.pictureFile,
            pictureName: editingMovie.pictureName,
            pictureURL: editingMovie.pictureURL
          };

          // Update the movies state with the modified movie
          setMovies((prevMovies) =>
            prevMovies.map((movie) =>
              movie._id === transformedMovie._id ? transformedMovie : movie
            )
          );
          // Reset the editing state
          setEditingMovie(null);
        }
      })
      .catch((error) => console.error('Error updating movie:', error));
  };

  return (
    <div className='mb-5'>
      <h2>Manage Movies</h2>
      <MovieForm
        categories={categories}
        addMovie={addMovie}
        newMovie={newMovie}
        setNewMovie={setNewMovie}
      />
      <MovieList
        movies={movies}
        categories={categories}
        editingMovie={editingMovie}
        setEditingMovie={setEditingMovie}
        deleteMovie={deleteMovie}
        updateMovie={updateMovie}
        newMovie={newMovie}
      />
    </div>
  );
};

export default MovieManager;