import React from 'react';
import DropdownCheckbox from './DropdownCheckbox';

const MovieForm = ({ categories, addMovie, newMovie, setNewMovie }) => {

    return (
        <div className="input-group mb-3">
            <label htmlFor="movieName" className="form-label"><span className="text-danger">*</span></label>
            <input
                type="text"
                className="form-control me-2"
                placeholder="Movie Name"
                value={newMovie.movieName}
                onChange={(e) => setNewMovie({ ...newMovie, movieName: e.target.value })}
            />
            <label htmlFor="Director" className="form-label"><span className="text-danger">*</span></label>
            <input
                type="text"
                className="form-control"
                placeholder="Director"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
            />
            <input
                type="text"
                className="form-control ms-2"
                placeholder="Actors"
                value={newMovie.actors}
                onChange={(e) => setNewMovie({ ...newMovie, actors: e.target.value })}
            />
            {/* Custom Dropdown with Checkboxes */}
            <DropdownCheckbox
                categories={categories}
                geter={newMovie}
                seter={setNewMovie}
            />
            <input
                type="file"
                className="form-control ms-2"
                accept="image/*"
                onChange={(e) => {
                    // Get the selected file
                    const file = e.target.files[0];
                    const pictureURL = URL.createObjectURL(file);

                    // Update state with the selected file
                    setNewMovie({
                        ...newMovie,
                        pictureName: file.name,
                        pictureFile: file,
                        pictureURL: pictureURL,
                      });
                }}
            />
            <button className="btn btn-success ms-2" onClick={addMovie}>
                Add Movie
            </button>
        </div>
    );
};

export default MovieForm;