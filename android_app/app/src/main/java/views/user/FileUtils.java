package views.user;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;

public class FileUtils {
    // Function to return the path to the profile picture
    public static String getPath(Context context, Uri uri) {
        String path = null;
        String[] col = {MediaStore.Images.Media.DATA};
        Cursor cursor = context.getContentResolver().query(uri, col, null, null, null);
        if (cursor != null) {
            int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            result = cursor.getString(columnIndex);
            cursor.close();
        }
        return path;
    }
}
