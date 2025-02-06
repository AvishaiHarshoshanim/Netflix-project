package features.threePages.ui.allMovies;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.databinding.FragmentGalleryBinding;

import features.MovieDetails.MovieDetailsActivity;
import features.threePages.CategoryWithMoviesAdapter;
import views.movies.MovieViewModel;

public class AllMoviesFragment extends Fragment {

    private FragmentGalleryBinding binding;
    private MovieViewModel movieViewModel;
    private CategoryWithMoviesAdapter movieAdapter;


    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentGalleryBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Initialize RecyclerView
        RecyclerView recyclerViewMovies = binding.recyclerViewMovies;
        recyclerViewMovies.setLayoutManager(new LinearLayoutManager(getContext()));

        // ViewModel to fetch movies
        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        movieViewModel.getMoviesByCategories().observe(getViewLifecycleOwner(), categorizedMovies -> {
            if (categorizedMovies != null) {
                movieAdapter = new CategoryWithMoviesAdapter(categorizedMovies, movie -> {
                    // Use requireContext() to get the activity context
                    Intent intent = new Intent(requireContext(), MovieDetailsActivity.class);
                    intent.putExtra("MOVIE_ID", movie.get_id());
                    startActivity(intent);
                });
                recyclerViewMovies.setAdapter(movieAdapter);
            }
        });

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}

