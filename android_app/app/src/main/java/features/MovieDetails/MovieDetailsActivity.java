package features.MovieDetails;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.example.android_app.R;

import java.util.List;

import views.movies.Movie;
import views.movies.MovieViewModel;

public class MovieDetailsActivity extends AppCompatActivity {

    private MovieViewModel movieViewModel;
    private ImageView moviePoster;
    private TextView movieName, movieDirector, movieActors, movieCategories;
    private VideoView movieVideo;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_details);

        moviePoster = findViewById(R.id.movie_poster);
        movieName = findViewById(R.id.movie_name);
        movieDirector = findViewById(R.id.movie_director);
        movieActors = findViewById(R.id.movie_actors);
        movieCategories = findViewById(R.id.movie_categories);
        movieVideo = findViewById(R.id.movie_video);

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);

        // Get movie ID from intent
        String movieId = getIntent().getStringExtra("MOVIE_ID");

        if (movieId != null) {
            movieViewModel.fetchMovieDetails(movieId);

            // Observe changes in all movies
            movieViewModel.getAllMovies().observe(this, movies -> {
                if (movies != null) {
                    // Find the movie with the matching ID
                    Movie movie = findMovieById(movies, movieId);
                    if (movie != null) {
                        updateUIWithMovieDetails(movie);
                    } else {
                        Log.e("MovieDetailsActivity", "Movie not found");
                    }
                } else {
                    Log.e("MovieDetailsActivity", "Movies not found");
                }
            });
        }
    }

    private Movie findMovieById(List<Movie> movies, String movieId) {
        for (Movie movie : movies) {
            if (movie.get_id().equals(movieId)) {
                return movie;
            }
        }
        return null;
    }

    private void updateUIWithMovieDetails(Movie movie) {
        movieName.setText(movie.getMovieName());
        movieDirector.setText("Director: " + movie.getDirector());
        movieActors.setText("Actors: " + movie.getActors());
        movieCategories.setText("Categories: " + String.join(", ", movie.getCategories()));

        // Load poster image using Glide
        String imageUrl = movie.getImageURL() != null ? movie.getImageURL().replace("localhost", "10.0.2.2") : "";
        if (!imageUrl.isEmpty()) {
            Glide.with(this).load(imageUrl).into(moviePoster);
        }

        // Play movie video
        String videoUrl = movie.getVideoURL() != null ? movie.getVideoURL().replace("localhost", "10.0.2.2") : "";
        if (!videoUrl.isEmpty()) {
            movieVideo.setVideoURI(Uri.parse(videoUrl));
            movieVideo.start();
        }
    }
}
