package features.threePages.ui.search;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.widget.SearchView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.android_app.databinding.FragmentSlideshowBinding;

import java.util.ArrayList;

import features.MovieDetails.MovieDetailsActivity;
import features.threePages.MovieListAdapter;
import views.movies.MovieViewModel;

public class SlideshowFragment extends Fragment {

    private FragmentSlideshowBinding binding;
    private MovieListAdapter movieAdapter;
    private MovieViewModel movieViewModel;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentSlideshowBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Initialize RecyclerView with LinearLayoutManager
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        // Initialize the MovieViewModel
        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);

        // Set up the adapter once, it will be updated manually
        movieAdapter = new MovieListAdapter(new ArrayList<>(), movie -> {
            Intent intent = new Intent(requireContext(), MovieDetailsActivity.class);
            intent.putExtra("MOVIE_ID", movie.get_id());
            intent.putExtra("USER_ID", userId);
            startActivity(intent);
        });
        binding.recyclerView.setAdapter(movieAdapter);

        // Observe the allMovies LiveData (to display the full movie list initially)
        movieViewModel.getMoviesToShow().observe(getViewLifecycleOwner(), searchedMovies -> {
            if (searchedMovies == null || searchedMovies.isEmpty()) {
                // No movies were found, show a message or placeholder
                binding.recyclerView.setVisibility(View.GONE);  // Optionally hide the RecyclerView
                binding.noResultsMessage.setVisibility(View.VISIBLE);  // Show a "No results found" message (you should add this TextView to your layout)
            } else {
                binding.recyclerView.setVisibility(View.VISIBLE);
                binding.noResultsMessage.setVisibility(View.GONE);  // Hide the "No results found" message
                movieAdapter.updateList(searchedMovies);
            }
        });

        SearchView searchView = binding.searchView;

        // Set hint text color
        EditText searchEditText = searchView.findViewById(androidx.appcompat.R.id.search_src_text);
        searchEditText.setHintTextColor(getResources().getColor(android.R.color.black));

        searchView.setIconifiedByDefault(true);

        // Handle SearchView input
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                movieViewModel.searchMovies(query);
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                movieViewModel.searchMovies(newText);
                return false;
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
