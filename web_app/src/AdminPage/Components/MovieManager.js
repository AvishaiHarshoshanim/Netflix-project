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
    imageName: '',
    imageFile: null,
    imageURL: '',
    videoName: '',
    videoFile: null,
    videoURL: ''
  });

  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;

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

    if (newMovie.imageFile) {
      formData.append('pictureFileToAdd', newMovie.imageFile);
    }

    if (newMovie.videoFile) {
      formData.append('videoFileToAdd', newMovie.videoFile);
    }

    fetch(`${API_URL}/movies`, {
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

          setMovies([...movies, transformedMovie]);

          setNewMovie({ _id: '', movieName: '', categories: [], director: '', actors: '', imageName: '', imageFile: null, imageURL: '', videoName: '', videoFile: null, videoURL: ''});

          // Manually reset the file input elements (if necessary)
          document.getElementById("imageInput").value = null;
          document.getElementById("videoInput").value = null;
        }
      })
      .catch((error) => console.error('Error adding movie:', error));
  };

  const deleteMovie = (movieId) => {
    fetch(`${API_URL}/movies/${movieId}`, {
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
      imageName: editingMovie.imageName,
      imageURL: editingMovie.imageURL,
      videoName: editingMovie.videoName,
      videoURL: editingMovie.videoURL,
    };

    const formData = new FormData();

    // Append movie data as JSON string
    formData.append('movieData', JSON.stringify(movieData));

    if (editingMovie.imageFile) {
      formData.append('pictureFileToUpdate', editingMovie.imageFile);
    }

    if (editingMovie.videoFile) {
      formData.append('videoFileToAdd', editingMovie.videoFile);
    }

    fetch(`${API_URL}/movies/${movie._id}`, {
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