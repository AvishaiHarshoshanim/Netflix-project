package features.homePage;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.R;

import features.MovieDetails.MovieDetailsActivity;
import views.movies.MovieViewModel;

public class HomePageActivity extends AppCompatActivity {

    private MovieViewModel movieViewModel;
    private RecyclerView recyclerView;
    private MovieHomeAdapter movieAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_page);

        recyclerView = findViewById(R.id.recyclerViewMovies);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        movieAdapter = new MovieHomeAdapter(movie -> {
            Intent intent = new Intent(HomePageActivity.this, MovieDetailsActivity.class);
            intent.putExtra("MOVIE_ID", movie.get_id());
            startActivity(intent);
        });

        recyclerView.setAdapter(movieAdapter);

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);

        // Observe movies list and update UI
        movieViewModel.getAllMovies().observe(this, movies -> {
            if (movies != null) {
                movieAdapter.setMovies(movies);
            }
        });

        // Fetch movies from API and store in database
        movieViewModel.fetchAllMovies();
    }
}

