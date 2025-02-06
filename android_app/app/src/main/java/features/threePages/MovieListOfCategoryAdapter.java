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

import views.CategoryWithMovies;

public class MovieListOfCategoryAdapter extends RecyclerView.Adapter<MovieListOfCategoryAdapter.MovieViewHolder> {
    private final List<CategoryWithMovies.Movie> movies;
    private final CategoryWithMoviesAdapter.OnMovieClickListener listener;

    public MovieListOfCategoryAdapter(List<CategoryWithMovies.Movie> movies, CategoryWithMoviesAdapter.OnMovieClickListener listener) {
        this.movies = movies;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_movie, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        holder.bind(movies.get(position));
    }

    @Override
    public int getItemCount() {
        return movies.size();
    }

    class MovieViewHolder extends RecyclerView.ViewHolder {
        private final TextView titleTextView;
        private final ImageView posterImageView;

        public MovieViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.textViewMovieTitle);
            posterImageView = itemView.findViewById(R.id.imageViewMoviePoster);

            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (position != RecyclerView.NO_POSITION) {
                    listener.onMovieClick(movies.get(position));
                }
            });
        }

        public void bind(CategoryWithMovies.Movie movie) {
            titleTextView.setText(movie.getMovieName());

            String imageUrl = movie.getImageURL();
            if (imageUrl != null && imageUrl.contains("localhost")) {
                imageUrl = imageUrl.replace("localhost", "10.0.2.2");
            }

            Glide.with(itemView.getContext())
                    .load(imageUrl)
                    .placeholder(R.drawable.ic_movie_poster_placeholder)
                    .into(posterImageView);
        }
    }
}
