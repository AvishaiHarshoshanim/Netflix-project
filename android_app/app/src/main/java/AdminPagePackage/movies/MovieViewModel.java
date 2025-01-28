package AdminPagePackage.movies;
import AdminPagePackage.categories.Category;
import AdminPagePackage.categories.CategoryRepository;

import android.app.Application;
import android.util.Log;

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
        Log.println(Log.INFO,"refreshMovies", "geting movies");

        // Update the LiveData
        movieRepository.fetchAndStoreMovies(allMovies::postValue);
    }
}
