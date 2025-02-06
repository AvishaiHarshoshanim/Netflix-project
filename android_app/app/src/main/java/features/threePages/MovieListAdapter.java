package features.threePages;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.android_app.R;

import java.util.List;

import views.movies.Movie;

public class MovieListAdapter extends RecyclerView.Adapter<MovieListAdapter.MovieViewHolder> {
    private List<Movie> movies; // List of movies
    private final OnMovieClickListener listener;

    // Constructor: Accepts a list of movies and a listener for item click events
    public MovieListAdapter(List<Movie> movies, OnMovieClickListener listener) {
        this.movies = movies;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the layout for each movie item
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_movie, parent, false);
        return new MovieViewHolder(view);
    }

    // Method to update the list when search results change
    public void updateList(List<Movie> newMovies) {
        this.movies = newMovies;
        notifyDataSetChanged();  // Notify the adapter that the data set has changed
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        // Bind data to the view holder for each movie
        holder.bind(movies.get(position));
    }

    @Override
    public int getItemCount() {
        // Return the size of the list of movies
        return movies.size();
    }

    // ViewHolder for each movie item
    class MovieViewHolder extends RecyclerView.ViewHolder {
        private final TextView titleTextView;
        private final ImageView posterImageView;

        public MovieViewHolder(@NonNull View itemView) {
            super(itemView);
            // Initialize views for the movie item
            titleTextView = itemView.findViewById(R.id.textViewMovieTitle);
            posterImageView = itemView.findViewById(R.id.imageViewMoviePoster);

            // Set up item click listener
            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    listener.onMovieClick(movies.get(position));
                }
            });
        }

        // Bind movie data to the views
        public void bind(Movie movie) {
            titleTextView.setText(movie.getMovieName());

            String imageUrl = movie.getImageURL();
            if (imageUrl != null && imageUrl.contains("localhost")) {
                imageUrl = imageUrl.replace("localhost", "10.0.2.2");
            }

            // Load image using Glide
            Glide.with(itemView.getContext())
                    .load(imageUrl)
                    .placeholder(R.drawable.ic_movie_poster_placeholder)
                    .into(posterImageView);
        }
    }

    // Interface for handling movie item clicks
    public interface OnMovieClickListener {
        void onMovieClick(Movie movie);
    }
}
