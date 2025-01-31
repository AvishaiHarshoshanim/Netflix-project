package features.adminPage;

import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.example.android_app.R;

import AdminPagePackage.categories.CategoryManagerFragment;
import AdminPagePackage.movies.MovieManagerFragment;

public class AdminPage extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_page);

        Button categoryManagerButton = findViewById(R.id.category_manager_button);
        Button movieManagerButton = findViewById(R.id.movie_manager_button);

        // Initially, enable both buttons
        movieManagerButton.setEnabled(true);
        categoryManagerButton.setEnabled(true);

        categoryManagerButton.setOnClickListener(v -> {
            movieManagerButton.setEnabled(false);
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(android.R.id.content, new CategoryManagerFragment())
                    .addToBackStack(null)
                    .commit();
        });

        movieManagerButton.setOnClickListener(v -> {
            categoryManagerButton.setEnabled(false);
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(android.R.id.content, new MovieManagerFragment())
                    .addToBackStack(null)
                    .commit();
        });
    }
}
