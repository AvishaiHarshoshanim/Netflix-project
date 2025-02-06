package views;

import java.util.ArrayList;
import java.util.List;

public class CategoryWithMovies {

    private String category;  // Category name
    private List<Movie> movies;  // List of movies under this category

    // Getter for category
    public String getCategory() {
        return category;
    }

    // Getter for movies
    public List<Movie> getMovies() {
        return movies;
    }

    public class Movie {
        private String _id;
        private String movieName;
        private List<Object> categories; // Can hold both Category objects and String IDs
        private String director;
        private String actors;
        private int movieIdForRecServer;
        private String imageName;
        private String imageURL;
        private String videoName;
        private String videoURL;
        private int __v;

        // Getters and Setters
        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }

        public String getMovieName() {
            return movieName;
        }

        public void setMovieName(String movieName) {
            this.movieName = movieName;
        }

        public List<Object> getCategories() {
            return categories;
        }

        public void setCategories(List<Object> categories) {
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

        public int getMovieIdForRecServer() {
            return movieIdForRecServer;
        }

        public void setMovieIdForRecServer(int movieIdForRecServer) {
            this.movieIdForRecServer = movieIdForRecServer;
        }

        public String getImageName() {
            return imageName;
        }

        public void setImageName(String imageName) {
            this.imageName = imageName;
        }

        public String getImageURL() {
            return imageURL;
        }

        public void setImageURL(String imageURL) {
            this.imageURL = imageURL;
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

        public int get__v() {
            return __v;
        }

        public void set__v(int __v) {
            this.__v = __v;
        }
    }



    // Inner Category class
    public static class Category {
        private String _id = "";  // Category ID
        private String name;  // Category name (e.g., "Action", "Comedy")
        private boolean promoted = false;  // Whether the category is promoted
        private int __v = 0;  // Version field (if applicable)

        // Getters and Setters
        public String get_id() {
            return _id;
        }

        public void set_id(String _id) {
            this._id = _id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public boolean isPromoted() {
            return promoted;
        }

        public void setPromoted(boolean promoted) {
            this.promoted = promoted;
        }

        public int get__v() {
            return __v;
        }

        public void set__v(int __v) {
            this.__v = __v;
        }
    }
}