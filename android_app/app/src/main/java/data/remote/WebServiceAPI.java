package data.remote;

import views.categories.Category;
import views.movies.Movie;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Part;
import retrofit2.http.Path;

import java.util.List;

public interface WebServiceAPI {
    @GET("categories")
    Call<List<Category>> getAllCategories();

    @GET("categories")
    Call<Category> getCategory();

    @POST("categories")
    Call<Category> createCategory(@Body Category category);

    @PATCH("categories/{id}")
    Call<Void> updateCategory(@Path("id") String _id, @Body Category category);

    @DELETE("categories/{id}")
    Call<Void> deleteCategory(@Path("id") String _id);

    // Get all movies
    @GET("movies/all")
    Call<List<Movie>> getAllMovies();

    // Get a specific movie by ID
    @GET("movies/{id}")
    Call<Movie> getMovieById(@Path("id") String _id);

    // Create a new movie
    @Multipart
    @POST("movies")
    Call<Movie> createMovie(@Part MultipartBody.Part pictureFileToAdd,
                            @Part MultipartBody.Part videoFileToAdd,
                            @Part("movieData") RequestBody movieData);

    // Update an existing movie
    @Multipart
    @PUT("movies/{id}")
    Call<Void> updateMovie(@Path("id") String _id,
                           @Part MultipartBody.Part movieData,
                           @Part MultipartBody.Part pictureFileToUpdate,
                           @Part MultipartBody.Part videoFileToUpdate);

    // Delete a movie by ID
    @DELETE("movies/{id}")
    Call<Void> deleteMovie(@Path("id") String _id);

}