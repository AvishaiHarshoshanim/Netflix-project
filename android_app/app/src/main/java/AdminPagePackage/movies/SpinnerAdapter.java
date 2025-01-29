package AdminPagePackage.movies;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.TextView;

import com.example.android_app.R;

import java.util.ArrayList;
import java.util.List;

import AdminPagePackage.categories.Category;

public class SpinnerAdapter extends BaseAdapter {

    private final Context context;
    private final List<Category> categories;
    private List<String> selectedCategoriesNames;  // List of selected category names
    private final String defaultText = "Choose Categories:";  // The default text for the spinner
    private boolean isFromView = false; // Flag to check if event is from view or user interaction


    // Constructor
    public SpinnerAdapter(Context context, List<Category> categories, ArrayList<String> selectedCategoriesNames) {
        this.context = context;
        this.categories = categories;
        this.selectedCategoriesNames = selectedCategoriesNames;
    }

    public void setSelectedCategories(List<String> selectedCategoriesNames) {
        this.selectedCategoriesNames = selectedCategoriesNames;
        notifyDataSetChanged();
    }

    @Override
    public int getCount() {
        // Include 1 extra for the "Choose Categories" option
        return categories.size() + 1;
    }

    @Override
    public Object getItem(int position) {
        // Return the default text for position 0, otherwise return the category
        if (position == 0) {
            return defaultText;  // Default text
        }
        return categories.get(position - 1);  // Offset by 1 for categories
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.category_item_with_checkbox, parent, false);
        }

        TextView categoryText = convertView.findViewById(R.id.category_name);
        CheckBox categoryCheckBox = convertView.findViewById(R.id.category_checkbox);

        // If position is 0, show the "Choose Categories" text
        if (position == 0) {
            categoryText.setText(defaultText);
            categoryCheckBox.setVisibility(View.GONE);  // Hide checkbox for "Choose Categories"
        } else {
            // Otherwise, show the actual category name and checkbox
            Category category = categories.get(position - 1);  // Offset by 1 for categories
            categoryText.setText(category.getName());

            // Set checkbox state based on selectedCategoriesValues
            categoryCheckBox.setVisibility(View.VISIBLE);  // Show checkbox for categories

            isFromView = true;
            // Update the checkbox based on the current state
            categoryCheckBox.setChecked(selectedCategoriesNames.contains(category.getName()));
            isFromView = false;

            categoryCheckBox.setTag(position);  // Set tag to identify position

            categoryCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
                int getPosition = (Integer) buttonView.getTag();  // Get the position from the tag
                Category selectedCategory = categories.get(getPosition - 1);
                if (!isFromView) { // Only update when the checkbox is clicked by the user
                    if (isChecked) {
                        selectedCategoriesNames.add(selectedCategory.getName());  // Add the category to selectedCategoriesNames
                    } else {
                        selectedCategoriesNames.remove(selectedCategory.getName());  // Remove the category from selectedCategoriesNames
                    }
                }
            });
        }

        return convertView;
    }

    @Override
    public boolean isEnabled(int position) {
        // Disable the "Choose Categories" item at position 0 so it can't be selected
        return position != 0;
    }
}
