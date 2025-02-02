package views.movies;
import views.categories.Category;
import data.repositories.CategoryRepository;
import data.repositories.MovieRepository;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

public class MovieViewModel extends AndroidViewModel {
    private final MovieRepository movieRepository;
    private CategoryRepository categoryRepository;
    private final MutableLiveData<List<Movie>> allMovies;
    private final MutableLiveData<List<Category>> allCategories;

    public MovieViewModel(@NonNull Application application) {
        super(application);
        movieRepository = new MovieRepository(application);
        allMovies = new MutableLiveData<>();
        allCategories = new MutableLiveData<>();
        categoryRepository = new CategoryRepository(application);
        refreshMovies();
    }

    public LiveData<List<Movie>> getAllMovies() {
        return allMovies;
    }

    public LiveData<List<Category>> getCategories() {
        categoryRepository.fetchAndStoreCategories(allCategories::postValue);
        return allCategories;
    }

    public Movie getMovie(String id) {
        return movieRepository.getMovie(id);
    }

    // Check if a movie exists asynchronously using a callback
    public void checkMovieExists(String movieName, MovieRepository.MovieExistsCallback callback) {
        movieRepository.checkMovieExists(movieName, callback);
    }

    public void insertMovie(Movie movie) {
        // Refresh list after insertion
        movieRepository.insertMovie(movie, this::refreshMovies);
    }

    public void updateMovie(Movie movieToEdit, Movie updatedContent) {
        // Refresh list after update
        movieRepository.updateMovie(movieToEdit, updatedContent, this::refreshMovies);
    }

    public void deleteMovie(Movie movie) {
        // Refresh list after deletion
        movieRepository.deleteMovie(movie, this::refreshMovies);
    }

    public void refreshMovies() {
        // Update the LiveData
        movieRepository.fetchAndStoreMovies(allMovies::postValue);
    }

    public void fetchMovieDetails(String movieId) {
        movieRepository.fetchMovieDetails(movieId, movie -> {
            List<Movie> currentMovies = allMovies.getValue();
            if (currentMovies != null) {
                // Find and update the movie in the list
                for (int i = 0; i < currentMovies.size(); i++) {
                    if (currentMovies.get(i).get_id().equals(movieId)) {
                        currentMovies.set(i, movie); // Update the movie in the list
                        allMovies.postValue(currentMovies); // Notify observers with updated list
                        break;
                    }
                }
            }
        });
    }
}
