package AdminPagePackage.movies;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.room.Room;

import com.google.gson.Gson;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import AdminPagePackage.AppDB;
import AdminPagePackage.WebServiceAPI;
import AdminPagePackage.categories.Category;
import AdminPagePackage.categories.CategoryDao;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MovieRepository {
    private final MovieDao movieDao;
    private final CategoryDao categoryDao;
    private final WebServiceAPI webServiceAPI;

    public interface MovieInsertCallback {
        void onMovieInserted();
    }

    public interface MovieDeleteCallback {
        void onMovieDeleted();
    }

    public interface MovieUpdateCallback {
        void onMovieUpdated();
    }

    public interface MovieFetchCallback {
        void onMoviesFetched(List<Movie> movies);
    }

    public interface MovieExistsCallback {
        void onMovieChecked(boolean exists);
    }

    public MovieRepository(Application application) {
        AppDB appDatabase = Room.databaseBuilder(application, AppDB.class, "app_database").build();
        movieDao = appDatabase.movieDao();
        categoryDao = appDatabase.categoryDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public LiveData<List<Movie>> getAllMovies() {
        return movieDao.getAllMovies();
    }

    public Movie getMovie(String id) {
        return movieDao.getMovieById(id);
    }

    // Check if a movie exists by name on a background thread
    public void checkMovieExists(String name, MovieExistsCallback callback) {
        new Thread(() -> {
            Movie movie = movieDao.getMovieByName(name);
            boolean exists = movie != null;

            // Now post to main thread
            new Handler(Looper.getMainLooper()).post(() -> {
                callback.onMovieChecked(exists); // Notify via callback
            });
        }).start();
    }

    public void insertMovie(Movie movie, MovieInsertCallback callback) {

        File imageFile = movie.getImageFile();
        File videoFile = movie.getVideoFile();

        MultipartBody.Part imagePart = null;
        MultipartBody.Part videoPart = null;


        if (imageFile != null){
            RequestBody imageRequestBody = RequestBody.create(MediaType.parse("image/*"), imageFile);
            imagePart = MultipartBody.Part.createFormData("pictureFileToAdd", movie.getImageName(), imageRequestBody);
        }

        if (videoFile != null){
            RequestBody videoRequestBody = RequestBody.create(MediaType.parse("video/*"), videoFile);
            videoPart = MultipartBody.Part.createFormData("videoFileToAdd", movie.getVideoName(), videoRequestBody);
        }

        // Convert movie data to JSON
        RequestBody movieDataRequestBody = RequestBody.create(MediaType.parse("application/json"), new Gson().toJson(movie));

        webServiceAPI.createMovie(imagePart, videoPart, movieDataRequestBody).enqueue(new Callback<Movie>() {
            @Override
            public void onResponse(Call<Movie> call, Response<Movie> response) {
                if (response.isSuccessful() && response.body() != null) {
                    new Thread(() -> {
                        movieDao.insertMovie(response.body());
                        callback.onMovieInserted();  // Notify ViewModel that movie is inserted
                    }).start();
                }
            }

            @Override
            public void onFailure(Call<Movie> call, Throwable t) {
                Log.println(Log.ERROR,"on fail", t.toString());
            }
        });
    }


    public void updateMovie(Movie movieToEdit, Movie updatedContent, MovieUpdateCallback callback) {

        // Prepare the movie data (excluding the files)
        JSONObject movieData = new JSONObject();
        try {
            movieData.put("movieName", updatedContent.getMovieName());
            movieData.put("director", updatedContent.getDirector());
            movieData.put("actors", updatedContent.getActors());
            movieData.put("categories", new JSONArray(updatedContent.getCategories()));
            movieData.put("imageName", updatedContent.getImageName());
            movieData.put("imageURL", updatedContent.getImageURL());
            movieData.put("videoName", updatedContent.getVideoName());
            movieData.put("videoURL", updatedContent.getVideoURL());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        // Create MultipartBody.Part for movieData
        MultipartBody.Part movieDataPart = MultipartBody.Part.createFormData("movieData", movieData.toString());

        // Create MultipartBody.Part for the image file if it exists
        MultipartBody.Part imagePart = null;
        MultipartBody.Part videoPart = null;

        File videoFile = updatedContent.getVideoFile();
        File imageFile = updatedContent.getImageFile();

        if (imageFile != null) {
            RequestBody imageRequestBody = RequestBody.create(MediaType.parse("image/*"), imageFile);
            imagePart = MultipartBody.Part.createFormData("pictureFileToUpdate", updatedContent.getImageName(), imageRequestBody);
        }

        if (videoFile != null) {
            RequestBody videoRequestBody = RequestBody.create(MediaType.parse("video/*"), videoFile);
            videoPart = MultipartBody.Part.createFormData("videoFileToUpdate", updatedContent.getVideoName(), videoRequestBody);
        }

        // Make the API call
        webServiceAPI.updateMovie(movieToEdit.get_id(), movieDataPart, imagePart, videoPart).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    new Thread(() -> {
                        movieDao.updateMovie(movieToEdit, updatedContent);
                        callback.onMovieUpdated();  // Notify ViewModel that movie is updated
                    }).start();
                } else {
                    Log.e("Error", "Response not successful: " + response.message());
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.e("Error", "Request failed", t);
            }
        });
    }

    public void deleteMovie(Movie movie, MovieDeleteCallback callback) {
        webServiceAPI.deleteMovie(movie.get_id()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.code() == 204) {  // 204 No Content means successful deletion
                    new Thread(() -> {
                        movieDao.deleteMovie(movie);
                        callback.onMovieDeleted();  // Notify ViewModel that movie is deleted
                    }).start();
                } else {
                    Log.println(Log.ERROR, "deleteMovie in repo", "response.code() != 204");
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Handle failure
            }
        });
    }

    public void fetchAndStoreMovies(MovieFetchCallback callback) {
        webServiceAPI.getAllMovies().enqueue(new Callback<List<Movie>>() {
            @Override
            public void onResponse(Call<List<Movie>> call, Response<List<Movie>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    new Thread(() -> {
                        Log.println(Log.DEBUG, "FETCH ", response.body().toString());

                        List<Movie> moviesFromServer = response.body();

                        // Fetch all category IDs from the movies received
                        List<String> categoryIds = new ArrayList<>();
                        for (Movie movie : moviesFromServer) {
                            categoryIds.addAll(movie.getCategories()); // Assuming getCategories() returns a list of IDs
                        }

                        // Fetch the category names from the database
                        List<Category> allCategories = categoryDao.getCategoriesByIds(categoryIds);

                        // Map category IDs to names for each movie
                        for (Movie movie : moviesFromServer) {
                            List<String> categoryNames = new ArrayList<>();
                            for (String categoryId : movie.getCategories()) {
                                // Find the corresponding category name
                                Category category = findCategoryById(categoryId, allCategories);
                                if (category != null) {
                                    categoryNames.add(category.getName());
                                }
                            }
                            // Update the movie with the category names
                            movie.setCategories(categoryNames);
                        }

                        movieDao.clearAllMovies();
                        movieDao.insertMovies(moviesFromServer);
                        callback.onMoviesFetched(moviesFromServer);  // Notify ViewModel with fetched movies
                    }).start();
                }
            }

            @Override
            public void onFailure(Call<List<Movie>> call, Throwable t) {
                // Handle failure
                Log.println(Log.INFO,"onfail", "fail to get movies");
            }
        });
    }

    // Helper method to find a category by its ID
    private Category findCategoryById(String categoryId, List<Category> allCategories) {
        for (Category category : allCategories) {
            if (category.getId().equals(categoryId)) {
                return category;
            }
        }
        return null; // Return null if no category with the given ID is found
    }

}

