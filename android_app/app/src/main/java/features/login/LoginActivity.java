package features.Login;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.android_app.R;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.MainActivity;

import features.adminPage.AdminPage;
import views.user.UserViewModel;

public class LoginActivity extends AppCompatActivity {
    private EditText userNameInput, passwordInput;
    private Button loginButton;
    private ProgressBar progressBar;
    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        userNameInput = findViewById(R.id.userName_input);
        passwordInput = findViewById(R.id.password_input);
        loginButton = findViewById(R.id.login_button);
        progressBar = findViewById(R.id.progress_bar);

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);
        userNameInput.requestFocus();
        userNameInput.postDelayed(new Runnable() {
            @Override
            public void run() {
                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                if (imm != null) {
                    imm.showSoftInput(userNameInput, InputMethodManager.SHOW_IMPLICIT);
                }
            }
        }, 200);

        loginButton.setOnClickListener(v -> {
            String userName = userNameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            if (userName.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                return;
            }

            progressBar.setVisibility(View.VISIBLE);
            userViewModel.login(userName, password, success -> {
                progressBar.setVisibility(View.GONE);
                if (success) {
                    Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show();
                    String jwtToken = userViewModel.getUserRepository().getToken();
                    Intent intent = new Intent(LoginActivity.this, AdminPage.class);
                    intent.putExtra("jwtToken", jwtToken);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(this, "Login Failed. Check credentials.", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}

