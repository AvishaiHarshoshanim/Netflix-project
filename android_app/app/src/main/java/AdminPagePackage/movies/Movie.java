package AdminPagePackage.movies;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverters;

import java.io.File;
import java.util.List;

@Entity(tableName = "movies")
@TypeConverters(Converters.class)
public class Movie {
    @PrimaryKey
    @NonNull
    private String _id;
    private String movieName;
    private List<String> categories;
    private String director;
    private String actors;
    private String pictureName;
    private String pictureURL;
    private File imageFile;
    private String imageName;

    @NonNull
    public String get_id() {
        return _id;
    }

    public void set_id(@NonNull String _id) {
        this._id = _id;
    }

    public String getMovieName() {
        return movieName;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getActors() {
        return actors;
    }

    public void setActors(String actors) {
        this.actors = actors;
    }

    public String getPictureName() {
        return pictureName;
    }

    public void setPictureName(String pictureName) {
        this.pictureName = pictureName;
    }

    public String getPictureURL() {
        return pictureURL;
    }

    public void setPictureURL(String pictureURL) {
        this.pictureURL = pictureURL;
    }

    public File getImageFile() {
        return imageFile;
    }

    public void setImageFile(File imageFile) {
        this.imageFile = imageFile;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public Movie(@NonNull String _id, String movieName, List<String> categories, String director, String actors, File imageFile, String imageName) {
        this._id = _id;
        this.movieName = movieName;
        this.categories = categories;
        this.director = director;
        this.actors = actors;
        this.imageFile = imageFile;
        this.imageName = imageName;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "_id='" + _id + '\'' +
                ", movieName='" + movieName + '\'' +
                ", categories=" + categories +
                ", director='" + director + '\'' +
                ", actors='" + actors + '\'' +
                ", pictureName='" + pictureName + '\'' +
                ", pictureURL='" + pictureURL + '\'' +
                '}';
    }
}
