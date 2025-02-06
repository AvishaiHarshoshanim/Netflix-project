package features.signUp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.android_app.R;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import java.io.File;

import features.login.LoginActivity;
import views.user.FileUtils;
import views.user.UserViewModel;

public class SignUpActivity extends AppCompatActivity {

    private EditText userNameInput, nameInput, passwordInput, confirmPasswordInput;
    private ProgressBar progressBar;
    private Uri selectedImageUri = null;
    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);

        userNameInput = findViewById(R.id.userName_input);
        nameInput = findViewById(R.id.name_input);
        passwordInput = findViewById(R.id.password_input);
        confirmPasswordInput = findViewById(R.id.confirm_password_input);
        Button signUpButton = findViewById(R.id.sign_up_button);
        Button uploadImageButton = findViewById(R.id.upload_image_button);
        progressBar = findViewById(R.id.progress_bar);

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        // Handle Image Selection
        ActivityResultLauncher<Intent> imagePickerLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        selectedImageUri = result.getData().getData();
                        Toast.makeText(this, "Image Selected!", Toast.LENGTH_SHORT).show();
                    }
                });

        // Button Click to Choose Image
        uploadImageButton.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
            imagePickerLauncher.launch(intent);
        });

        // Sign Up Button Click
        signUpButton.setOnClickListener(v -> {
            String username = userNameInput.getText().toString().trim();
            String name = nameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();
            String confirmPassword = confirmPasswordInput.getText().toString().trim();

            if (username.isEmpty() || name.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            // Validate Password
            String passwordError = validatePassword(password);
            if (!passwordError.isEmpty()) {
                passwordInput.setError(passwordError);
                return;
            }

            if (!password.equals(confirmPassword)) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show();
                return;
            }

            progressBar.setVisibility(View.VISIBLE);

            // Convert image URI to file (if selected)
            File imageFile = null;
            if (selectedImageUri != null) {
                String imagePath = FileUtils.getPath(this, selectedImageUri);
                if (imagePath != null) {
                    imageFile = new File(imagePath);
                }
            }

            // Call ViewModel to sign up user
            userViewModel.signUp(username, name, password, imageFile, success -> {
                progressBar.setVisibility(View.GONE);
                if (success) {
                    Toast.makeText(this, "Sign-Up Successful!", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(SignUpActivity.this, LoginActivity.class));
                    finish();
                } else {
                    Toast.makeText(this, "Sign-Up Failed. Try again.", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
    private String validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return "Password cannot be empty";
        }

        boolean hasUppercase = password.matches(".*[A-Z].*");
        boolean hasLowercase = password.matches(".*[a-z].*");
        boolean hasNumber = password.matches(".*\\d.*");
        boolean hasMinLength = password.length() >= 8;

        if (hasUppercase && hasLowercase && hasNumber && hasMinLength) {
            return ""; // No error
        } else {
            return "Password must contain:\n• One uppercase letter\n• One lowercase letter\n• One number\n• Minimum 8 characters";
        }
    }
}
