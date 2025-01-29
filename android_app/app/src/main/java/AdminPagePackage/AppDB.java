package AdminPagePackage;

import androidx.room.Database;
import androidx.room.RoomDatabase;

import AdminPagePackage.categories.Category;
import AdminPagePackage.categories.CategoryDao;
import AdminPagePackage.movies.Movie;
import AdminPagePackage.movies.MovieDao;

@Database(entities = {Category.class, Movie.class}, version = 1)  // Incremented version to 2
public abstract class AppDB extends RoomDatabase {
    public abstract CategoryDao categoryDao();
    public abstract MovieDao movieDao();
}
