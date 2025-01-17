package AdminPagePackage;

import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class CategoryManager {
    private List<Category> categories = new ArrayList<>();
    private String newCategory;
    private boolean promoted;

    // Modified to accept category name and promoted status
    public void addCategory(String categoryName, boolean promoted) {
        if (categoryName != null && !categoryName.isEmpty()) {
            new AddCategoryTask().execute(categoryName, String.valueOf(promoted));
        }
    }

    private class AddCategoryTask extends AsyncTask<String, Void, Category> {
        @Override
        protected Category doInBackground(String... params) {
            String categoryName = params[0];
            boolean isPromoted = Boolean.parseBoolean(params[1]);

            HttpURLConnection connection = null;

            try {
                URL url = new URL("http://10.0.2.2:5000/api/categories"); // Use 10.0.2.2 for localhost in Android emulator
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setDoOutput(true);

                JSONObject jsonBody = new JSONObject();
                jsonBody.put("name", categoryName);
                jsonBody.put("promoted", isPromoted);

                OutputStream os = connection.getOutputStream();
                os.write(jsonBody.toString().getBytes("UTF-8"));
                os.flush();
                os.close();

                if (connection.getResponseCode() == HttpURLConnection.HTTP_CREATED) {
                    // Parse the response and create a Category object
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stringBuilder.append(line);
                    }
                    reader.close();
                    String response = stringBuilder.toString();
                    JSONObject responseJson = new JSONObject(response);
                    return new Category(responseJson.getString("name"), responseJson.getBoolean("promoted"));
                } else {
                    Log.e("AddCategoryTask", "Error: " + connection.getResponseCode());
                }
            } catch (Exception e) {
                Log.e("AddCategoryTask", "Error adding category", e);
            } finally {
                if (connection != null) {
                    connection.disconnect();
                }
            }
            return null;
        }

        @Override
        protected void onPostExecute(Category category) {
            if (category != null) {
                categories.add(category);
                // Update categories list after successfully adding
                // Notify AdminPage about new category addition (this can be done via a callback or by updating the UI directly)
            } else {
                Log.e("AddCategoryTask", "Failed to add category");
            }
        }
    }
}
