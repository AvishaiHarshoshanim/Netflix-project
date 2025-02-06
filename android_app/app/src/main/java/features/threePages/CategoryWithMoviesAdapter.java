package features.threePages;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.R;

import java.util.List;
import java.util.Map;

import views.CategoryWithMovies;

public class CategoryWithMoviesAdapter extends RecyclerView.Adapter<CategoryWithMoviesAdapter.CategoryViewHolder> {
    private final Map<String, List<CategoryWithMovies.Movie>> categorizedMovies; // Category name -> List of Movies
    private final OnMovieClickListener listener;

    public interface OnMovieClickListener {
        void onMovieClick(CategoryWithMovies.Movie movie);
    }

    public CategoryWithMoviesAdapter(Map<String, List<CategoryWithMovies.Movie>> categorizedMovies, OnMovieClickListener listener) {
        this.categorizedMovies = categorizedMovies;
        this.listener = listener;
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_category, parent, false);
        return new CategoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        String category = (String) categorizedMovies.keySet().toArray()[position];
        holder.bind(category, categorizedMovies.get(category));
    }

    @Override
    public int getItemCount() {
        return categorizedMovies.size();
    }

    class CategoryViewHolder extends RecyclerView.ViewHolder {
        private final TextView categoryTitle;
        private final RecyclerView movieRecyclerView;

        public CategoryViewHolder(@NonNull View itemView) {
            super(itemView);
            categoryTitle = itemView.findViewById(R.id.textViewCategoryTitle);
            movieRecyclerView = itemView.findViewById(R.id.recyclerViewCategoryMovies);
            movieRecyclerView.setLayoutManager(new LinearLayoutManager(itemView.getContext(), LinearLayoutManager.HORIZONTAL, false));
        }

        public void bind(String category, List<CategoryWithMovies.Movie> movies) {
            categoryTitle.setText(category);
            MovieListOfCategoryAdapter movieListAdapter = new MovieListOfCategoryAdapter(movies, listener);
            movieRecyclerView.setAdapter(movieListAdapter);
        }
    }
}
