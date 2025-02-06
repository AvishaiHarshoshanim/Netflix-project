package views.user ;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;

import java.io.File;

import data.repositories.UserRepository;

public class UserViewModel extends AndroidViewModel {
    private final UserRepository userRepository;

    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application);
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public void login(String userName, String password, UserRepository.LoginCallback callback) {
        userRepository.login(userName, password, callback);
    }

public void signUp(String username, String name, String password, File imageFile, UserRepository.SignUpCallback callback) {
    userRepository.signUp(username, name, password, imageFile, callback);
}


    public void logout() {
        userRepository.logout();
    }
}