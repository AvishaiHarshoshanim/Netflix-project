package data.repositories;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.room.Room;

import java.util.List;

import AdminPagePackage.categories.Category;
import data.loacl.AppDB;
import data.remote.WebServiceAPI;

import data.loacl.dao.CategoryDao;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class CategoryRepository {
    private final CategoryDao categoryDao;
    private final WebServiceAPI webServiceAPI;

    public interface CategoryInsertCallback {
        void onCategoryInserted();
    }

    public interface CategoryDeleteCallback {
        void onCategoryDeleted();
    }

    public interface CategoryUpdateCallback {
        void onCategoryUpdated();
    }

    public interface CategoryFetchCallback {
        void onCategoriesFetched(List<Category> categories);
    }

    public interface CategoryExistsCallback {
        void onCategoryChecked(boolean exists);
    }

    public CategoryRepository(Application application) {
        AppDB appDatabase = Room.databaseBuilder(application, AppDB.class, "app_database").build();
        categoryDao = appDatabase.categoryDao();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:5000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        webServiceAPI = retrofit.create(WebServiceAPI.class);
    }

    public LiveData<List<Category>> getAllCategories() {
        return categoryDao.getAllCategories();
    }

    public Category getCategory(String id) {
        return categoryDao.getCategory(id);
    }

    // Check if a category exists by name on a background thread
    public void checkCategoryExists(String name, CategoryExistsCallback callback) {
        new Thread(() -> {
            Category category = categoryDao.getCategoryByName(name);
            boolean exists = category != null;

            // Now post to main thread
            new Handler(Looper.getMainLooper()).post(() -> {
                callback.onCategoryChecked(exists); // Notify via callback
            });
        }).start();
    }

    public void insertCategory(Category category, CategoryInsertCallback callback) {
        webServiceAPI.createCategory(category).enqueue(new Callback<Category>() {
            @Override
            public void onResponse(Call<Category> call, Response<Category> response) {
                if (response.isSuccessful() && response.body() != null) {
                    new Thread(() -> {
                        categoryDao.insertCategory(response.body());
                        callback.onCategoryInserted();  // Notify ViewModel that category is inserted
                    }).start();
                }
            }

            @Override
            public void onFailure(Call<Category> call, Throwable t) {
                // Handle failure
            }
        });
    }

    public void updateCategory(Category categoryToEdit, Category updatedContent, CategoryUpdateCallback callback) {
        webServiceAPI.updateCategory(categoryToEdit.getId(), updatedContent).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.code() == 204) {  // 204 No Content means successful deletion
                    new Thread(() -> {
                        categoryDao.updateCategory(categoryToEdit, updatedContent);
                        callback.onCategoryUpdated();  // Notify ViewModel that category is deleted
                    }).start();
                    Log.println(Log.ERROR, "updateCategory in repo", "good");
                } else {
                    Log.println(Log.ERROR, "updateCategory in repo", "response.code() != 204");
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Log.println(Log.ERROR, "updateCategory in repo", "onfailure");
            }
        });
    }

    public void deleteCategory(Category category, CategoryDeleteCallback callback) {
        webServiceAPI.deleteCategory(category.getId()).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.code() == 204) {  // 204 No Content means successful deletion
                    new Thread(() -> {
                        categoryDao.deleteCategory(category);
                        callback.onCategoryDeleted();  // Notify ViewModel that category is deleted
                    }).start();
                } else {
                    Log.println(Log.ERROR, "deleteCategory in repo", "response.code() != 204");
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                // Handle failure
            }
        });
    }

    public void fetchAndStoreCategories(CategoryFetchCallback callback) {
        webServiceAPI.getAllCategories().enqueue(new Callback<List<Category>>() {
            @Override
            public void onResponse(Call<List<Category>> call, Response<List<Category>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    new Thread(() -> {
                        List<Category> categoriesFromServer = response.body();
                        categoryDao.clearAllCategories();
                        categoryDao.insertCategories(categoriesFromServer);
                        callback.onCategoriesFetched(categoriesFromServer);  // Notify ViewModel with fetched categories
                    }).start();
                }
            }

            @Override
            public void onFailure(Call<List<Category>> call, Throwable t) {
                // Handle failure
            }
        });
    }
}

