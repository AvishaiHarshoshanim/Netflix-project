package views.movies;

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
    private String imageURL;
    private File imageFile;
    private String imageName;
    private String videoURL;
    private File videoFile;
    private String videoName;


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

    public String getVideoName() {
        return videoName;
    }

    public void setVideoName(String videoName) {
        this.videoName = videoName;
    }

    public String getVideoURL() {
        return videoURL;
    }

    public void setVideoURL(String videoURL) {
        this.videoURL = videoURL;
    }

    public File getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(File videoFile) {
        this.videoFile = videoFile;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
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

    public Movie(@NonNull String _id, String movieName, List<String> categories, String director, String actors, File imageFile, String imageName, File videoFile, String videoName) {
        this._id = _id;
        this.movieName = movieName;
        this.categories = categories;
        this.director = director;
        this.actors = actors;
        this.imageFile = imageFile;
        this.imageName = imageName;
        this.videoFile = videoFile;
        this.videoName = videoName;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "_id='" + _id + '\'' +
                ", movieName='" + movieName + '\'' +
                ", categories=" + categories +
                ", director='" + director + '\'' +
                ", actors='" + actors + '\'' +
                '}';
    }
}
