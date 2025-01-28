package AdminPagePackage;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.android_app.R;

import java.util.List;

import AdminPagePackage.categories.Category;

public class CategoryAdapter extends ArrayAdapter<Category> {

    private final OnCategoryActionListener actionListener;

    public CategoryAdapter(@NonNull Context context, @NonNull List<Category> categories, OnCategoryActionListener listener) {
        super(context, 0, categories);
        this.actionListener = listener;
    }

    public interface OnCategoryActionListener {
        void onEditCategory(Category category);
        void onDeleteCategory(Category category);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.list_item_category, parent, false);
        }

        // Get the current category
        Category category = getItem(position);

        // Find views
        TextView title = convertView.findViewById(R.id.category_name);
        TextView subtitle = convertView.findViewById(R.id.category_subtitle);
        Button editButton = convertView.findViewById(R.id.edit_category_button);
        Button deleteButton = convertView.findViewById(R.id.delete_category_button);

        // Set data
        if (category != null) {
            title.setText(category.getName());
            if (category.isPromoted()) {
                subtitle.setText("Promoted");
                subtitle.setVisibility(View.VISIBLE);
            } else {
                subtitle.setVisibility(View.GONE);
            }

            // Set up button listeners
            editButton.setOnClickListener(v -> {
                if (actionListener != null) {
                    actionListener.onEditCategory(category);
                }
            });

            deleteButton.setOnClickListener(v -> {
                if (actionListener != null) {
                    actionListener.onDeleteCategory(category);
                }
            });
        }

        return convertView;
    }

    @Override
    public View getDropDownView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        return super.getView(position, convertView, parent);
    }
}
