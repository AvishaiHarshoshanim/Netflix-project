package AdminPagePackage;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.R;

import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {

    private final List<AdminPage.Movie> movies;
    private final OnDeleteClickListener deleteClickListener;

    public interface OnDeleteClickListener {
        void onDeleteClick(String title);
    }

    public MovieAdapter(List<AdminPage.Movie> movies, OnDeleteClickListener deleteClickListener) {
        this.movies = movies;
        this.deleteClickListener = deleteClickListener;
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_movie, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        AdminPage.Movie movie = movies.get(position);
        holder.movieTitle.setText(movie.getTitle());
        holder.movieCategory.setText("(" + movie.getCategory() + ")");
        holder.deleteButton.setOnClickListener(v -> deleteClickListener.onDeleteClick(movie.getTitle()));
    }

    @Override
    public int getItemCount() {
        return movies.size();
    }

    static class MovieViewHolder extends RecyclerView.ViewHolder {
        TextView movieTitle, movieCategory;
        Button deleteButton;

        public MovieViewHolder(@NonNull View itemView) {
            super(itemView);
            movieTitle = itemView.findViewById(R.id.movie_title);
            movieCategory = itemView.findViewById(R.id.movie_category);
            deleteButton = itemView.findViewById(R.id.delete_movie_button);
        }
    }
}

