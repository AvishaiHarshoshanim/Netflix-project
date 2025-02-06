package features.login;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.R;
import com.example.android_app.MainActivity;

import features.signUp.SignUpActivity;
import features.threePages.HomePageWithBarActivity;
import views.user.UserViewModel;

public class LoginActivity extends AppCompatActivity {
    private EditText userNameInput, passwordInput;
    private Button loginButton;
    private Button signButton;
    private UserViewModel userViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        userNameInput = findViewById(R.id.userName_input);
        passwordInput = findViewById(R.id.password_input);
        loginButton = findViewById(R.id.login_button);
        signButton = findViewById(R.id.signup_button);

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

        signButton.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, SignUpActivity.class);
            startActivity(intent);
        });
        loginButton.setOnClickListener(v -> {
            String userName = userNameInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            if (userName.isEmpty()) {
                userNameInput.setError("please fill user name");;
                return;
            }
            if (password.isEmpty()) {
                userNameInput.setError("please fill password");
                ;
                return;
            }

            userViewModel.login(userName, password, success -> {
                if (success) {
                    Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show();
                    startActivity(new Intent(LoginActivity.this, HomePageWithBarActivity.class));
                    finish();
                } else {
                    Toast.makeText(this, "Login Failed. Check credentials.", Toast.LENGTH_SHORT).show();
                }
            });
        });
    }
}

