package AdminPagePackage.movies;

import androidx.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.File;
import java.lang.reflect.Type;
import java.util.List;

public class Converters {

    // Convert a List<String> to a String (in JSON format)
    @TypeConverter
    public static String fromListToString(List<String> list) {
        if (list == null) {
            return null;
        }
        Gson gson = new Gson();
        return gson.toJson(list);
    }

    // Convert a String (in JSON format) to a List<String>
    @TypeConverter
    public static List<String> fromStringToList(String string) {
        if (string == null) {
            return null;
        }
        Gson gson = new Gson();
        Type listType = new TypeToken<List<String>>() {}.getType();
        return gson.fromJson(string, listType);
    }

    // Convert File to String (path)
    @TypeConverter
    public static String fromFile(File file) {
        return file != null ? file.getAbsolutePath() : null;
    }

    // Convert String (path) back to File
    @TypeConverter
    public static File toFile(String path) {
        return path != null ? new File(path) : null;
    }
}
