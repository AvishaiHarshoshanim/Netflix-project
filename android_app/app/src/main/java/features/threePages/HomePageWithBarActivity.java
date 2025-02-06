package features.threePages;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.FragmentTransaction;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.android_app.MainActivity;
import com.example.android_app.R;
import com.example.android_app.databinding.ActivityHomePageWithBarBinding;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import features.adminPage.AdminPage;
import features.login.LoginActivity;
import features.threePages.ui.allMovies.AllMoviesFragment;
import features.threePages.ui.homePage.HomeFragment;
import features.threePages.ui.search.SlideshowFragment;
import views.user.UserViewModel;

public class HomePageWithBarActivity extends AppCompatActivity {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityHomePageWithBarBinding binding;
    UserViewModel userViewModel;
    String userRole;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set up View Binding
        binding = ActivityHomePageWithBarBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);
        userViewModel.getUserToken().observe(this, token -> {
            if (token == null) {
                Log.e("HomePage", "No token found! Redirecting to login...");
                startActivity(new Intent(this, LoginActivity.class));
                finish();
            } else {
                Log.d("HomePage", "JWT Token: " + token);
                LiveData<String> userId = userViewModel.getUserId();
                userRole = userViewModel.getUserRole();
            }
        });

        // Set up toolbar
        setSupportActionBar(binding.appBarHomePageWithBar.toolbar);
        binding.appBarHomePageWithBar.fab.setOnClickListener(view ->
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null)
                        .setAnchorView(R.id.fab).show()
        );

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow, R.id.nav_admin_page)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home_page_with_bar);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        // Set up item selection listener
        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                getSupportFragmentManager().beginTransaction();
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                getSupportFragmentManager().popBackStack();
                transaction.replace(R.id.nav_host_fragment_content_home_page_with_bar, new HomeFragment());
                transaction.commit();
            } else if (id == R.id.nav_gallery) {
                getSupportFragmentManager().beginTransaction();
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                getSupportFragmentManager().popBackStack();
                transaction.replace(R.id.nav_host_fragment_content_home_page_with_bar, new AllMoviesFragment());
                transaction.commit();
            } else if (id == R.id.nav_admin_page) {
                if (userRole.equals("admin")) {
                    Intent intent = new Intent(this, AdminPage.class);
                    startActivity(intent);
                } else {
                    Toast.makeText(this, "You are not an admin!", Toast.LENGTH_SHORT).show();
                }

            } else if (id == R.id.nav_slideshow) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.nav_host_fragment_content_home_page_with_bar, new SlideshowFragment())
                        .addToBackStack(null)
                        .commit();
            }
            drawer.closeDrawer(GravityCompat.START);
            return true;
        });
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_settings) { // "Logout" option
            userViewModel.logout();
            Intent intent = new Intent(this, LoginActivity.class);
            startActivity(intent);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.home_page_with_bar, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_home_page_with_bar);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }
}
