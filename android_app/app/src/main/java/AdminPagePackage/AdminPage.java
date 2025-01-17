package AdminPagePackage;

import android.os.Bundle;
import android.widget.*;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.R;

import java.util.ArrayList;

public class AdminPage extends AppCompatActivity {

    private EditText categoryInput, movieTitleInput;
    private CheckBox promotedCheckbox;
    private Spinner categorySpinner;
    private Button addCategoryButton, addMovieButton;
    private RecyclerView categoryList, movieList;

    private ArrayList<String> categories = new ArrayList<>();
    private ArrayList<Movie> movies = new ArrayList<>();
    private CategoryAdapter categoryAdapter;
    private MovieAdapter movieAdapter;
    private CategoryManager categoryManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_page);

        // Initialize UI elements
        categoryInput = findViewById(R.id.category_input);
        promotedCheckbox = findViewById(R.id.promoted_checkbox);
        addCategoryButton = findViewById(R.id.add_category_button);
        categoryList = findViewById(R.id.category_list);

        movieTitleInput = findViewById(R.id.movie_title_input);
        categorySpinner = findViewById(R.id.category_spinner);
        addMovieButton = findViewById(R.id.add_movie_button);
        movieList = findViewById(R.id.movie_list);

        // Initialize CategoryManager
        categoryManager = new CategoryManager();

        // Initialize adapters for RecyclerViews
        categoryAdapter = new CategoryAdapter(categories, this::deleteCategory);
        categoryList.setLayoutManager(new LinearLayoutManager(this));
        categoryList.setAdapter(categoryAdapter);

        movieAdapter = new MovieAdapter(movies, this::deleteMovie);
        movieList.setLayoutManager(new LinearLayoutManager(this));
        movieList.setAdapter(movieAdapter);

        // Fetch initial categories
        fetchCategories();

        // Set up button listeners
        addCategoryButton.setOnClickListener(v -> addCategory());
        addMovieButton.setOnClickListener(v -> addMovie());
    }

    private void fetchCategories() {
        // Example data; replace with API fetch logic
        categories.add("Action");
        categories.add("Drama");
        updateCategorySpinner();
        categoryAdapter.notifyDataSetChanged();
    }

    private void updateCategorySpinner() {
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_spinner_item, categories);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        categorySpinner.setAdapter(spinnerAdapter);
    }

    private void addCategory() {
        String categoryName = categoryInput.getText().toString();
        boolean promoted = promotedCheckbox.isChecked();

        if (!categoryName.isEmpty()) {
            // Use CategoryManager to add a category
            categoryManager.addCategory(categoryName, promoted);

            // Clear inputs after adding
            categoryInput.setText("");
            promotedCheckbox.setChecked(false);
        } else {
            Toast.makeText(this, "Category name cannot be empty!", Toast.LENGTH_SHORT).show();
        }
    }

    private void deleteCategory(String category) {
        // Remove category and update RecyclerView
        categories.remove(category);
        updateCategorySpinner();
        categoryAdapter.notifyDataSetChanged();

        // Remove movies belonging to the deleted category
        movies.removeIf(movie -> movie.getCategory().equals(category));
        movieAdapter.notifyDataSetChanged();
    }

    private void addMovie() {
        String movieTitle = movieTitleInput.getText().toString();
        String category = (String) categorySpinner.getSelectedItem();

        if (!movieTitle.isEmpty() && category != null) {
            movies.add(new Movie(movieTitle, category));
            movieAdapter.notifyDataSetChanged();

            // Reset input field
            movieTitleInput.setText("");
        } else {
            Toast.makeText(this, "Please fill in all fields!", Toast.LENGTH_SHORT).show();
        }
    }

    private void deleteMovie(String title) {
        movies.removeIf(movie -> movie.getTitle().equals(title));
        movieAdapter.notifyDataSetChanged();
    }

    // Nested Movie class for simplicity
    static class Movie {
        private final String title;
        private final String category;

        public Movie(String title, String category) {
            this.title = title;
            this.category = category;
        }

        public String getTitle() {
            return title;
        }

        public String getCategory() {
            return category;
        }
    }
}
