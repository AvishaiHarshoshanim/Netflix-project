package data.repositories;

import static android.content.ContentValues.TAG;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.gson.Gson;

import data.remote.WebServiceAPI;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import views.user.LoginRequest;
import views.user.TokenResponse;

import java.io.File;

public class UserRepository {
    private static final String PREF_NAME = "user_prefs";
    private static final String KEY_TOKEN = "jwt_token";

    private final WebServiceAPI webServiceAPI;
    private final SharedPreferences sharedPreferences;

    public interface LoginCallback {
        void onLoginResult(boolean success);
    }

    public interface SignUpCallback {
        void onSignUpResult(boolean success);
    }
    //builder that connecting into the server and init share prefrence for jwt 
    public UserRepository(Application application) {
        sharedPreferences = application.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/api/")  
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public void login(String userName, String password, LoginCallback callback) {
        LoginRequest request = new LoginRequest(userName, password);

        webServiceAPI.login(request).enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(Call<TokenResponse> call, Response<TokenResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String token = response.body().getToken();
                    saveToken(token);
                    Log.d("Login", "Login success Token: " + token);
                    callback.onLoginResult(true);
                } else {
                    Log.e("Login", " Login failed. Response code: " + response.code());
                    Log.e("Login", " Response body: " + response.errorBody());
                    callback.onLoginResult(false);
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                Log.e("Login", " Login request failed: " + t.getMessage());
                callback.onLoginResult(false);
            }
        });
    }
    //signUp
    public void signUp(String username, String name, String password, File imageFile, SignUpCallback callback) {
        Log.d(TAG, "🔹 Starting sign-up process for: " + username);

        RequestBody usernameBody = RequestBody.create(MediaType.parse("text/plain"), username);
        RequestBody nameBody = RequestBody.create(MediaType.parse("text/plain"), name);
        RequestBody passwordBody = RequestBody.create(MediaType.parse("text/plain"), password);

        MultipartBody.Part imagePart = null;
        if (imageFile != null) {
            RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), imageFile);
            imagePart = MultipartBody.Part.createFormData("profile_image", imageFile.getName(), requestFile);
            Log.d(TAG, " Image attached: " + imageFile.getAbsolutePath());
        } else {
            Log.d(TAG, "No profile image");
        }

        Log.d(TAG, "Sending sign-up request");

        webServiceAPI.signUp(usernameBody, nameBody, passwordBody, imagePart)
                .enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        try {
                            if (response.isSuccessful() && response.body() != null) {
                                String rawResponse = response.body().string();
                                Log.d(TAG, "Sign-up successful! Server response: " + rawResponse);
                                callback.onSignUpResult(true);
                            } else {
                                String errorBody = response.errorBody() != null ? response.errorBody().string() : "null";
                                Log.e(TAG, " Sign-up failed. Response code: " + response.code());
                                Log.e(TAG, "Error body: " + errorBody);
                                callback.onSignUpResult(false);
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "Failed to read response body", e);
                            callback.onSignUpResult(false);
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Log.e(TAG, "Sign-up request failed: " + t.getMessage());
                        Log.e(TAG, "Request URL: " + call.request().url());
                        callback.onSignUpResult(false);
                    }
                });
    }
//puts the jwt in the KEY_TOKEN
    private void saveToken(String token) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString(KEY_TOKEN, token);
        editor.apply();
    }

    public String getToken() {
        return sharedPreferences.getString(KEY_TOKEN, null);
    }

    public void logout() {
        sharedPreferences.edit().remove(KEY_TOKEN).apply();
    }
}
