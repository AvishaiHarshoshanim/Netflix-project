package views.categories;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.List;

import data.repositories.CategoryRepository;

public class CategoryViewModel extends AndroidViewModel {
    private final CategoryRepository categoryRepository;
    private final MutableLiveData<List<Category>> allCategories;

    public CategoryViewModel(@NonNull Application application) {
        super(application);
        categoryRepository = new CategoryRepository(application);
        allCategories = new MutableLiveData<>();
        refreshCategories();
    }

    public LiveData<List<Category>> getAllCategories() {
        return allCategories;
    }

    public Category getCategory(String id) {
        return categoryRepository.getCategory(id);
    }

    // Check if a category exists asynchronously using a callback
    public void checkCategoryExists(String name, CategoryRepository.CategoryExistsCallback callback) {
        categoryRepository.checkCategoryExists(name, callback);
    }

    public void insertCategory(Category category) {
        // Refresh list after insertion
        categoryRepository.insertCategory(category, this::refreshCategories);
    }

    public void updateCategory(Category categoryToEdit, Category updatedContent) {
        // Refresh list after update
        categoryRepository.updateCategory(categoryToEdit, updatedContent, this::refreshCategories);
    }

    public void deleteCategory(Category category) {
        // Refresh list after deletion
        categoryRepository.deleteCategory(category, this::refreshCategories);
    }

    public void refreshCategories() {
        // Update the LiveData
        categoryRepository.fetchAndStoreCategories(allCategories::postValue);
    }
}
