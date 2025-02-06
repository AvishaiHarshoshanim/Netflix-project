package views.movies;
import views.CategoryWithMovies;
import views.categories.Category;
import data.repositories.CategoryRepository;
import data.repositories.MovieRepository;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MovieViewModel extends AndroidViewModel {
    private final MovieRepository movieRepository;
    private CategoryRepository categoryRepository;
    private final MutableLiveData<List<Movie>> allMovies;
    private final MutableLiveData<List<Category>> allCategories;
    private final MutableLiveData<Map<String, List<CategoryWithMovies.Movie>>> categorizedMovies;
    private final MutableLiveData<List<Movie>> moviesToShow;


    public MovieViewModel(@NonNull Application application) {
        super(application);
        movieRepository = new MovieRepository(application);
        allMovies = new MutableLiveData<>();
        allCategories = new MutableLiveData<>();
        categorizedMovies = new MutableLiveData<>();
        moviesToShow = new MutableLiveData<>();
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

    public LiveData<List<Movie>> getRecMovies(String userId, String movieId) {
        movieRepository.getRecMovies(userId, movieId, recoMovies -> {
            if (recoMovies == null) {
                Log.e("MovieViewModel", "No searchedMovies received!");
            }
            moviesToShow.postValue(recoMovies);
        });

        return moviesToShow;
    }

    public void updateRecServer(String userId, String movieId) {
        movieRepository.updateRecServer(userId, movieId, () -> {});
    }

    public LiveData<Map<String, List<CategoryWithMovies.Movie>>> getMoviesByCategories() {
        if (categorizedMovies.getValue() == null) {
            categorizedMovies.setValue(new HashMap<>());  // Ensure it's never null
        }

        movieRepository.getMoviesByCategories(categoryWithMoviesList -> {
            if (categoryWithMoviesList == null || categoryWithMoviesList.isEmpty()) {
                Log.e("MovieViewModel", "No categories received!");
                return;
            }

            Map<String, List<CategoryWithMovies.Movie>> categorized = new HashMap<>();
            for (CategoryWithMovies categoryWithMovies : categoryWithMoviesList) {
                categorized.put(categoryWithMovies.getCategory(), categoryWithMovies.getMovies());
            }

            Log.d("MovieViewModel", "Fetched categories: " + categorized.keySet());
            categorizedMovies.postValue(categorized);
        });

        return categorizedMovies;
    }

    public LiveData<Map<String, List<CategoryWithMovies.Movie>>> getMoviesByCategory(String userId) {
        if (categorizedMovies.getValue() == null) {
            categorizedMovies.setValue(new HashMap<>());  // Ensure it's never null
        }

        movieRepository.getMoviesByCategory(userId, categoryWithMoviesList -> {
            if (categoryWithMoviesList == null || categoryWithMoviesList.isEmpty()) {
                Log.e("MovieViewModel", "No movies received!");
                return;
            }

            Map<String, List<CategoryWithMovies.Movie>> categorized = new HashMap<>();
            for (CategoryWithMovies categoryWithMovies : categoryWithMoviesList) {
                categorized.put(categoryWithMovies.getCategory(), categoryWithMovies.getMovies());
            }

            Log.d("MovieViewModel", "Fetched categories: " + categorized.keySet());
            categorizedMovies.postValue(categorized);
        });

        return categorizedMovies;
    }

    public LiveData<List<Movie>> searchMovies(String query) {
        movieRepository.searchMovies(query, newSearchedMovies -> {
            if (newSearchedMovies == null) {
                Log.e("MovieViewModel", "No searchedMovies received!");
            }
            moviesToShow.postValue(newSearchedMovies);
        });

        return moviesToShow;
    }

    public MutableLiveData<List<Movie>> getMoviesToShow() {
        return moviesToShow;
    }
}
