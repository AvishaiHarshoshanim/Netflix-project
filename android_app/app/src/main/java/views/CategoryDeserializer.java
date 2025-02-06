package views;

import com.google.gson.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class CategoryDeserializer implements JsonDeserializer<List<CategoryWithMovies.Category>> {
    @Override
    public List<CategoryWithMovies.Category> deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        List<CategoryWithMovies.Category> categoryList = new ArrayList<>();

        if (json.isJsonArray()) {
            JsonArray jsonArray = json.getAsJsonArray();
            for (JsonElement element : jsonArray) {
                if (element.isJsonObject()) {
                    // Deserialize as a full Category object
                    CategoryWithMovies.Category category = context.deserialize(element, CategoryWithMovies.Category.class);
                    categoryList.add(category);
                } else if (element.isJsonPrimitive() && element.getAsJsonPrimitive().isString()) {
                    // Handle as a category ID (string)
                    String categoryId = element.getAsString();
                    CategoryWithMovies.Category category = new CategoryWithMovies.Category();
                    category.set_id(categoryId);  // Store the ID
                    categoryList.add(category);
                }
            }
        }
        return categoryList;
    }
}
