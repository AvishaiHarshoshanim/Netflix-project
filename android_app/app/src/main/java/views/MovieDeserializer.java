package views;

import com.google.gson.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
public class MovieDeserializer implements JsonDeserializer<CategoryWithMovies.Movie> {

    @Override
    public CategoryWithMovies.Movie deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        JsonObject jsonObject = json.getAsJsonObject();
        CategoryWithMovies.Movie movie = new CategoryWithMovies().new Movie();

        movie.set_id(jsonObject.get("_id").getAsString());
        movie.setMovieName(jsonObject.get("movieName").getAsString());
        movie.setDirector(jsonObject.get("director").getAsString());
        movie.setActors(jsonObject.get("actors").getAsString());
        movie.setMovieIdForRecServer(jsonObject.get("movieIdForRecServer").getAsInt());
        movie.setImageName(jsonObject.get("imageName").getAsString());
        movie.setImageURL(jsonObject.get("imageURL").getAsString());
        movie.setVideoName(jsonObject.get("videoName").getAsString());
        movie.setVideoURL(jsonObject.get("videoURL").getAsString());
        movie.set__v(jsonObject.get("__v").getAsInt());

        // Handling categories
        List<Object> categories = new ArrayList<>();
        JsonArray categoriesArray = jsonObject.getAsJsonArray("categories");

        for (JsonElement element : categoriesArray) {
            if (element.isJsonObject()) {
                // Deserialize as Category object
                categories.add(context.deserialize(element, CategoryWithMovies.Category.class));
            } else if (element.isJsonPrimitive() && element.getAsJsonPrimitive().isString()) {
                // Deserialize as String ID
                categories.add(element.getAsString());
            }
        }

        movie.setCategories(categories);
        return movie;
    }
}
