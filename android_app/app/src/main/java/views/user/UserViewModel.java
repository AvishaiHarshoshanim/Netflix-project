package views.user ;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.io.File;

import data.repositories.UserRepository;

public class UserViewModel extends AndroidViewModel {
    private final UserRepository userRepository;
    private final MutableLiveData<String> userId = new MutableLiveData<>();
    private final MutableLiveData<String> userRole = new MutableLiveData<>();
    private final MutableLiveData<String> userToken = new MutableLiveData<>();

    public UserViewModel(@NonNull Application application) {
        super(application);
        userRepository = new UserRepository(application);
        loadToken();
        loadUserDetails();
    }
    private void loadUserDetails() {
        userId.setValue(userRepository.getUserId());
        userRole.setValue(userRepository.getUserRole());
    }

    public LiveData<String> getUserId() {
        return userId;
    }

    public String getUserRole() {
        // now i have LiveData<String> userRole that is liveData<String> how i convert it to string?
        return userRole.getValue();
    }

    public void loadToken() {
        String token = userRepository.getToken();
        userToken.setValue(token);
    }

    public LiveData<String> getUserToken() {
        return userToken;
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