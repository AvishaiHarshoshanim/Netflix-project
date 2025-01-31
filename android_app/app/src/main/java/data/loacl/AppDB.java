package data.loacl;

import androidx.room.Database;
import androidx.room.RoomDatabase;

import AdminPagePackage.categories.Category;
import data.loacl.dao.CategoryDao;
import AdminPagePackage.movies.Movie;
import data.loacl.dao.MovieDao;

@Database(entities = {Category.class, Movie.class}, version = 1)
public abstract class AppDB extends RoomDatabase {
    public abstract CategoryDao categoryDao();
    public abstract MovieDao movieDao();
}
