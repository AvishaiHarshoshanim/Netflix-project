package views.movies;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.bumptech.glide.Glide;
import com.example.android_app.R;

import java.util.List;

import features.MovieDetails.MovieDetailsActivity;

public class MovieAdapter extends ArrayAdapter<Movie> {

    private final OnMovieActionListener actionListener;

    public MovieAdapter(@NonNull Context context, @NonNull List<Movie> movies, OnMovieActionListener listener) {
        super(context, 0, movies);
        this.actionListener = listener;
    }

    public interface OnMovieActionListener {
        void onEditMovie(Movie movie);
        void onDeleteMovie(Movie movie);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.list_item_movie, parent, false);
        }

        // Get the current movie
        Movie movie = getItem(position);

        // Bind data to views
        TextView movieName = convertView.findViewById(R.id.movie_name);
        TextView movieCategories = convertView.findViewById(R.id.movie_categories);
        TextView movieDirector = convertView.findViewById(R.id.movie_director);
        TextView movieActors = convertView.findViewById(R.id.movie_actors);
        ImageView moviePoster = convertView.findViewById(R.id.movie_poster);
        TextView videoName = convertView.findViewById(R.id.video_name);

        Button editButton = convertView.findViewById(R.id.edit_movie_button);
        Button deleteButton = convertView.findViewById(R.id.delete_movie_button);


        // Set data to the views
        if (movie != null) {
            movieName.setText(movie.getMovieName());

            // Set categories (you could join them into a comma-separated string)
            String categories = String.join(", ", movie.getCategories());
            movieCategories.setText(categories);

            // Set director
            movieDirector.setText(movie.getDirector());

            movieActors.setText((movie.getActors()));

            // Handle the picture URL to replace localhost with 10.0.2.2
            String imageUrl = movie.getImageURL();

            if (imageUrl != null && imageUrl.contains("localhost")) {
                imageUrl = imageUrl.replace("localhost", "10.0.2.2");
            }

            // Handle the video URL to replace localhost with 10.0.2.2
            String videoUrl = movie.getVideoURL();
            if (videoUrl != null && videoUrl.contains("localhost")) {
                videoUrl = videoUrl.replace("localhost", "10.0.2.2");
            }

            Glide.with(getContext())
                    .load(imageUrl)
                    .placeholder(R.drawable.ic_movie_poster_placeholder)
                    .into(moviePoster);

            videoName.setText(movie.getVideoName());


            // Set button click listeners
            editButton.setOnClickListener(v -> {
                if (actionListener != null) {
                    actionListener.onEditMovie(movie);
                }
            });

            deleteButton.setOnClickListener(v -> {
                if (actionListener != null) {
                    actionListener.onDeleteMovie(movie);
                }
            });

            convertView.setOnClickListener(v -> {
                Intent intent = new Intent(getContext(), MovieDetailsActivity.class);
                intent.putExtra("MOVIE_ID", movie.get_id());
                getContext().startActivity(intent);
            });
        }

        return convertView;
    }

    @Override
    public View getDropDownView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        return super.getView(position, convertView, parent);
    }
}
