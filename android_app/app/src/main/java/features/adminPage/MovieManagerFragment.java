package features.adminPage;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import android.database.Cursor;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import android.Manifest;
import com.example.android_app.R;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import views.movies.Movie;
import views.movies.MovieAdapter;
import views.movies.MovieViewModel;
import views.movies.SpinnerAdapter;

public class MovieManagerFragment extends Fragment implements MovieAdapter.OnMovieActionListener {

    private MovieViewModel movieViewModel;
    private EditText movieNameInput;
    private EditText directorInput;
    private EditText actorsInput;
    private Spinner categorySpinner;
    private TextView imageNameTextView;
    private TextView videoNameTextView;
    private byte[] fileBytes;
    private File imageFile;
    private File videoFile;
    private String imageName;
    private String videoName;
    private Button addMovieButton;
    private Button updateMovieButton;
    private Button cancelEditButton;
    private ListView movieListView;
    private Button selectImageButton;
    private Button selectVideoButton;
    private Movie updatedContent;
    private Movie movieToEdit;
    private SpinnerAdapter spinnerAdapter;
    private ArrayList<String> selectedCategories = new ArrayList<>();
    // Flag to store which picker was clicked (image or video)
    private boolean isImagePicker = false;
    // Permission result launcher
    private final ActivityResultLauncher<String> permissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                if (isGranted) {
                    // If permission is granted, open the appropriate picker based on the flag
                    if (isImagePicker) {
                        Log.println(Log.ERROR,"PER","permission ok image");

                        openImagePicker();  // Open image picker if the flag is set
                    } else {
                        Log.println(Log.ERROR,"PER","permission ok video");
                        openVideoPicker();  // Open video picker if the flag is not set
                    }
                } else {
                    Log.println(Log.ERROR,"PER","permission denied");

                    // If permission is denied, show a message
                    Toast.makeText(getContext(), "Permission denied", Toast.LENGTH_SHORT).show();
                }
            });

    // Image picker result launcher
    private final ActivityResultLauncher<Intent> imagePickerLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {

                    Uri imageUri = result.getData().getData();

                    imageName = getImageFileName(imageUri);

                    try {
                        fileBytes = getBytesFromUri(imageUri);
                        imageFile = createTempFileFromBytes(fileBytes, imageName);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    imageNameTextView.setText(imageName);
                } else {
                    Toast.makeText(getContext(), "No image selected", Toast.LENGTH_SHORT).show();
                }
            });

    // Video picker result launcher
    private final ActivityResultLauncher<Intent> videoPickerLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    Uri videoUri = result.getData().getData();
                    videoName = getVideoFileName(videoUri);
                    try {
                        fileBytes = getBytesFromUri(videoUri);
                        videoFile = createTempFileFromBytes(fileBytes, videoName);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    videoNameTextView.setText(videoName);
                } else {
                    Toast.makeText(getContext(), "No video selected", Toast.LENGTH_SHORT).show();
                }
            });

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_movie_manager, container, false);

        // Bind UI elements
        movieNameInput = view.findViewById(R.id.movie_name_input);
        directorInput = view.findViewById(R.id.director_input);
        actorsInput = view.findViewById(R.id.actors_input);
        selectImageButton = view.findViewById(R.id.select_image_button);
        selectVideoButton = view.findViewById(R.id.select_video_button);
        addMovieButton = view.findViewById(R.id.add_movie_button);
        updateMovieButton = view.findViewById(R.id.update_movie_button);
        cancelEditButton = view.findViewById(R.id.cancel_edit_button);
        movieListView = view.findViewById(R.id.movie_list);
        categorySpinner = view.findViewById(R.id.category_spinner);
        imageNameTextView = view.findViewById(R.id.image_name_text_view);
        videoNameTextView = view.findViewById(R.id.video_name_text_view);


        // Initially, hide the update and cancel buttons
        updateMovieButton.setVisibility(View.GONE);
        cancelEditButton.setVisibility(View.GONE);

        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);

        // Button click listener to open image picker
        selectImageButton.setOnClickListener(v -> {
            isImagePicker = true;  // Set the flag for image picker
            // Check if the permission is already granted
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.println(Log.ERROR,"PER","permission already have image");

                // Permission is already granted, open the image picker
                openImagePicker();
            } else {
                // Request the permission using the launcher
                permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
        });

        // Button click listener to open video picker
        selectVideoButton.setOnClickListener(v -> {
            isImagePicker = false;  // Set the flag for video picker
            // Check if the permission is already granted
            if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.println(Log.ERROR,"PER","permission already have video");

                // Permission is already granted, open the video picker
                openVideoPicker();
            } else {
                // Request the permission using the launcher
                permissionLauncher.launch(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
        });

        // Observe movies and update the movie list
        movieViewModel.getAllMovies().observe(getViewLifecycleOwner(), movies -> {
            MovieAdapter adapter = new MovieAdapter(getContext(), movies, MovieManagerFragment.this);
            movieListView.setAdapter(adapter);
        });

        // Observe categories list and update the spinner
        movieViewModel.getCategories().observe(getViewLifecycleOwner(), categories -> {
            // Create the adapter with the dynamic categories
            spinnerAdapter = new SpinnerAdapter(getContext(), categories, selectedCategories);
            categorySpinner.setAdapter(spinnerAdapter);
        });

        // Add movie button listener
        addMovieButton.setOnClickListener(v -> {
            String movieName = movieNameInput.getText().toString();
            String director = directorInput.getText().toString();
            String actors = actorsInput.getText().toString();

            // Check if all required fields are filled
            if (!movieName.isEmpty()) {

                movieViewModel.insertMovie(new Movie("1", movieName, selectedCategories, director, actors, imageFile, imageName, videoFile, videoName));
                clearInputFields();
            } else {
                Toast.makeText(getContext(), "Movie's name is required", Toast.LENGTH_SHORT).show();
            }
        });

        // Update movie button listener
        updateMovieButton.setOnClickListener(v -> {
            if (movieToEdit != null) {
                String movieName = movieNameInput.getText().toString();
                String director = directorInput.getText().toString();
                String actors = actorsInput.getText().toString();

                // Check if all required fields are filled
                if (!movieName.isEmpty()) {
                    updatedContent = new Movie(movieToEdit.get_id(), movieName, selectedCategories, director, actors, imageFile, imageName, videoFile, videoName);
                    movieViewModel.updateMovie(movieToEdit, updatedContent);
                    clearInputFields();
                    resetToAddMode();
                    Toast.makeText(getContext(), "Movie updated", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(getContext(), "Movie's name is required", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Cancel button listener
        cancelEditButton.setOnClickListener(v -> {
            clearInputFields();
            resetToAddMode();
        });

        return view;
    }

    // Method to open the image picker
    private void openImagePicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
        imagePickerLauncher.launch(intent);
    }

    // Method to open the video picker
    private void openVideoPicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setDataAndType(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, "video/*");
        videoPickerLauncher.launch(intent);
    }

    // Method to get the file name from the URI
    private String getImageFileName(Uri uri) {
        String fileName = null;
        if (uri != null) {
            String[] projection = {MediaStore.Images.Media.DISPLAY_NAME};
            try (Cursor cursor = getContext().getContentResolver().query(uri, projection, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME);
                    fileName = cursor.getString(columnIndex);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return fileName;
    }

    private String getVideoFileName(Uri uri) {
        String fileName = null;
        if (uri != null) {
            String[] projection = {MediaStore.Video.Media.DISPLAY_NAME};
            try (Cursor cursor = getContext().getContentResolver().query(uri, projection, null, null, null)) {
                if (cursor != null && cursor.moveToFirst()) {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DISPLAY_NAME);
                    fileName = cursor.getString(columnIndex);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return fileName;
    }

    // This helper method creates a temporary file from the byte array
    private File createTempFileFromBytes(byte[] fileBytes, String fileName) throws IOException {
        // Create a temporary file in your app's cache directory
        File tempFile = new File(getContext().getCacheDir(), fileName);

        // Write the byte array to the temporary file
        FileOutputStream fos = new FileOutputStream(tempFile);
        fos.write(fileBytes);
        fos.close();

        return tempFile;  // Return the created file
    }

    private byte[] getBytesFromUri(Uri uri) {
        try {
            InputStream inputStream = getContext().getContentResolver().openInputStream(uri);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = inputStream.read(buffer)) != -1) {
                byteArrayOutputStream.write(buffer, 0, length);
            }
            return byteArrayOutputStream.toByteArray();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void onEditMovie(Movie movie) {
        // Show the Edit Movie section and populate with the movie's data
        movieToEdit = movie;
        movieNameInput.setText(movie.getMovieName());
        directorInput.setText(movie.getDirector());
        actorsInput.setText(movie.getActors());

        // Clear and update selected categories
        selectedCategories.clear();
        selectedCategories.addAll(movie.getCategories());

        // Now update the spinner's adapter with the new selected categories
        spinnerAdapter.setSelectedCategories(selectedCategories);
        spinnerAdapter.notifyDataSetChanged(); // This will ensure the spinner refreshes

        // Hide the "Add" button, and show the "Update" and "Cancel" buttons
        addMovieButton.setVisibility(View.GONE);
        updateMovieButton.setVisibility(View.VISIBLE);
        cancelEditButton.setVisibility(View.VISIBLE);  // Show the Cancel button
    }

    @Override
    public void onDeleteMovie(Movie movie) {
        movieViewModel.deleteMovie(movie);
        Toast.makeText(getContext(), "Movie deleted", Toast.LENGTH_SHORT).show();
    }

    private void clearInputFields() {
        movieNameInput.setText("");
        directorInput.setText("");
        actorsInput.setText("");
        selectedCategories.clear();
        imageNameTextView.setText("No image selected");
        videoNameTextView.setText("No video selected");
        imageFile = null;
        videoFile = null;
    }

    // Reset UI back to "Add Movie" mode
    private void resetToAddMode() {
        addMovieButton.setVisibility(View.VISIBLE);
        updateMovieButton.setVisibility(View.GONE);
        cancelEditButton.setVisibility(View.GONE);  // Hide the Cancel button
    }

    @Override
    public void onPause() {
        super.onPause();

        // Re-enable the categoryManagerButton when leaving MovieManagerFragment
        Button categoryManagerButton = getActivity().findViewById(R.id.category_manager_button);
        if (categoryManagerButton != null) {
            categoryManagerButton.setEnabled(true);
        }
    }
}
