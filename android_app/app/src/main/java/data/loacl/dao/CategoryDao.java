package data.loacl.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

import views.categories.Category;

@Dao
public interface CategoryDao {

    @Query("SELECT * FROM categories")
    LiveData<List<Category>> getAllCategories();

    @Query("SELECT * FROM categories WHERE _id=:id")
    Category getCategory(String id);

    @Query("SELECT * FROM categories WHERE name = :name LIMIT 1")
    Category getCategoryByName(String name);

    @Insert
    void insertCategory(Category... categories);

    @Insert
    void insertCategories(List<Category> categories);

    @Update
    void updateCategory(Category categoryToEdit, Category updatedContent);

    @Delete
    void deleteCategory(Category... categories);

    @Query("DELETE FROM categories")
    void clearAllCategories();

    @Query("SELECT * FROM categories WHERE _id IN (:ids)")
    List<Category> getCategoriesByIds(List<String> ids);
}
