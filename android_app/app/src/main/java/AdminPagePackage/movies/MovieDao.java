package AdminPagePackage.movies;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface MovieDao {

    // Get all movies
    @Query("SELECT * FROM movies")
    LiveData<List<Movie>> getAllMovies();

    // Get a movie by its ID
    @Query("SELECT * FROM movies WHERE _id = :id LIMIT 1")
    Movie getMovieById(String id);

    // Get a movie by its name
    @Query("SELECT * FROM movies WHERE movieName = :movieName LIMIT 1")
    Movie getMovieByName(String movieName);

    // Insert a new movie or movies
    @Insert
    void insertMovie(Movie... movies);

    @Insert
    void insertMovies(List<Movie> movies);

    // Update an existing movie
    @Update
    void updateMovie(Movie movieToEdit, Movie updatedContent);

    // Delete a movie or movies
    @Delete
    void deleteMovie(Movie... movies);

    // Clear all movies from the table
    @Query("DELETE FROM movies")
    void clearAllMovies();
}
