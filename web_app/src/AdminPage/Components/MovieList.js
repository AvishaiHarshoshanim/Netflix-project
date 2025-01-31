import React from 'react';
import DropdownCheckbox from './DropdownCheckbox';

const MovieList = ({ movies, categories, editingMovie, setEditingMovie, deleteMovie, updateMovie }) => {
    return (
        <ul className="list-group mt-3">
            {movies.map((movie) => (
                <li key={movie._id} className="list-group-item d-flex justify-content-between">
                    {editingMovie?._id === movie._id ? (
                        <div>
                            <div className="input-group mb-3">
                                <label htmlFor="movieName" className="form-label"><span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Movie Name"
                                    value={editingMovie.movieName}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, movieName: e.target.value })}
                                />
                                <label htmlFor="Director" className="form-label"><span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Director"
                                    value={editingMovie.director}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, director: e.target.value })}
                                />
                                <input
                                    type="text"
                                    className="form-control ms-2"
                                    placeholder="Actors"
                                    value={editingMovie.actors}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, actors: e.target.value })}
                                />
                                {/* Custom Dropdown with Checkboxes */}
                                <DropdownCheckbox
                                    categories={categories}
                                    geter={editingMovie}
                                    seter={setEditingMovie}
                                />
                                <div className="input-group mb-3 mt-2">
                                    <label className="form-label" style={{ color: 'black' }}>You can change the image:</label>
                                    <input
                                        type="file"
                                        className="form-control ms-2"
                                        accept="image/*"
                                        onChange={(e) => {
                                            // Get the selected file
                                            const file = e.target.files[0];
                                            // Update state with the selected file
                                            setEditingMovie({
                                                ...editingMovie,
                                                imageName: file.name,
                                                imageFile: file,
                                            });
                                        }}
                                    />
                                    <label className="form-label ms-3" style={{ color: 'black' }}>You can change the video:</label>
                                    <input
                                        type="file"
                                        className="form-control ms-2"
                                        accept="video/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setEditingMovie({
                                                ...editingMovie,
                                                videoName: file.name,
                                                videoFile: file
                                            })
                                        }}
                                    />
                                    <button
                                        className="btn btn-success btn-sm me-2 ms-2"
                                        onClick={() => updateMovie(editingMovie)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setEditingMovie(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="movie-details">
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Movie Name:</span>
                                    <span>{movie.movieName}</span>
                                </div>
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Director:</span>
                                    <span>{movie.director}</span>
                                </div>
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Actors:</span>
                                    <span>{movie.actors || 'No actors listed'}</span>
                                </div>
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Categories:</span>
                                    <span>
                                        {movie.categories && movie.categories.length > 0
                                            ? movie.categories
                                                .map((category) => {
                                                    // Find the category name from the categories state
                                                    const showCategory = categories.find((cat) => cat.name === category);
                                                    return showCategory ? showCategory.name : 'unknown'; // Return 'Unknown' if category is not found
                                                })
                                                .join(', ')
                                            : 'No categories'}
                                    </span>
                                </div>
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Movie Picture:</span>
                                    <span>
                                        {movie.imageURL ? (
                                            <img
                                                src={movie.imageURL} // Path or URL of the image
                                                alt={`${movie.movieName} poster`} // Alternative text for the image
                                            />
                                        ) : (
                                            <span>No picture available</span>
                                        )}
                                    </span>
                                </div>
                                <div className="movie-detail-row">
                                    <span className="movie-detail-label">Movie Video:</span>
                                    <span>
                                        {movie.videoURL ? (
                                            <video controls>
                                                <source
                                                src={movie.videoURL}
                                                alt={(`${movie.movieName} video`)}/>
                                            </video>
                                        ) : (
                                            <span>No video available</span>
                                        )}
                                    </span>
                                </div>

                            </div>

                            <div className="actions">
                                <button
                                    className="btn btn-edit btn-sm ms-2"
                                    onClick={() => setEditingMovie(movie)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteMovie(movie._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default MovieList;