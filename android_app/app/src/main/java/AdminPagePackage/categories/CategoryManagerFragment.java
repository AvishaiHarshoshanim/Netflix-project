package AdminPagePackage.categories;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.example.android_app.R;

public class CategoryManagerFragment extends Fragment implements CategoryAdapter.OnCategoryActionListener {

    private CategoryViewModel categoryViewModel;
    private EditText categoryInput;
    private CheckBox promotedCheckbox;
    private Button addCategoryButton;
    private Button updateCategoryButton;
    private Button cancelEditButton;  // Cancel button
    private ListView categoryListView;

    private Category updatedContent;
    private Category CategoryToEdit;


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_category_manager, container, false);

        // Bind UI elements
        categoryInput = view.findViewById(R.id.category_input);
        promotedCheckbox = view.findViewById(R.id.promoted_checkbox);
        addCategoryButton = view.findViewById(R.id.add_category_button);
        updateCategoryButton = view.findViewById(R.id.update_category_button);
        cancelEditButton = view.findViewById(R.id.cancel_edit_button);  // Initialize Cancel button
        categoryListView = view.findViewById(R.id.category_list);

        // Initially, hide the update and cancel buttons
        updateCategoryButton.setVisibility(View.GONE);
        cancelEditButton.setVisibility(View.GONE);

        categoryViewModel = new ViewModelProvider(this).get(CategoryViewModel.class);

        // Observe categories
        categoryViewModel.getAllCategories().observe(getViewLifecycleOwner(), categories -> {
            CategoryAdapter adapter = new CategoryAdapter(getContext(), categories, CategoryManagerFragment.this);
            categoryListView.setAdapter(adapter);
        });

        // Add category button listener
        addCategoryButton.setOnClickListener(v -> {
            // Get the category name and the promoted from the input field
            String categoryName = categoryInput.getText().toString();
            boolean isPromoted = promotedCheckbox.isChecked();

            // Check if a category with the same name already exists
            if (!categoryName.isEmpty()) {
                categoryViewModel.checkCategoryExists(categoryName, exists -> {
                    if (exists) {
                        // Show a message or handle the case when the category already exists
                        Toast.makeText(getContext(), "Category with this name already exists", Toast.LENGTH_SHORT).show();
                    } else {
                        // Insert the new category
                        categoryViewModel.insertCategory(new Category("1", categoryName, isPromoted));
                        clearInputFields();
                    }
                });
            } else {
                Toast.makeText(getContext(), "Category's name is required", Toast.LENGTH_SHORT).show();
            }
        });

        // Update category button listener
        updateCategoryButton.setOnClickListener(v -> {
            if (CategoryToEdit != null) {
                // set a temporary name and promoted
                updatedContent = new Category(CategoryToEdit.getId(), "temp", false);
                String categoryName = categoryInput.getText().toString();
                boolean isPromoted = promotedCheckbox.isChecked();
                updatedContent.setName(categoryName);
                updatedContent.setPromoted(isPromoted);


                // Check if a category with the same name already exists
                if (!categoryName.isEmpty()) {
                    categoryViewModel.checkCategoryExists(categoryName, exists -> {
                        if (exists) {
                            // Show a message or handle the case when the category already exists
                            Toast.makeText(getContext(), "Category with this name already exists", Toast.LENGTH_SHORT).show();
                        } else {
                            // Insert the new category
                            categoryViewModel.updateCategory(CategoryToEdit, updatedContent);
                            clearInputFields();
                            resetToAddMode();
                            Toast.makeText(getContext(), "Category updated", Toast.LENGTH_SHORT).show();
                        }
                    });
                } else {
                    Toast.makeText(getContext(), "Category's name is required", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Cancel button listener
        cancelEditButton.setOnClickListener(v -> {
            clearInputFields();
            resetToAddMode();
        });

        return view;
    }

    @Override
    public void onEditCategory(Category category) {
        // Show the Edit Category section and populate with the category's data
        CategoryToEdit = category;
        if (category.getName().equals("no_category")){
            Toast.makeText(getContext(), "no_category cannot be edited", Toast.LENGTH_SHORT).show();
            return;
        }
        categoryInput.setText(category.getName());
        promotedCheckbox.setChecked(category.isPromoted());

        // Hide the "Add" button, and show the "Update" and "Cancel" buttons
        addCategoryButton.setVisibility(View.GONE);
        updateCategoryButton.setVisibility(View.VISIBLE);
        cancelEditButton.setVisibility(View.VISIBLE);  // Show the Cancel button
    }

    @Override
    public void onDeleteCategory(Category category) {
        if (category.getName().equals("no_category")){
            Toast.makeText(getContext(), "no_category cannot be deleted", Toast.LENGTH_SHORT).show();
            return;
        }
        categoryViewModel.deleteCategory(category);
        Toast.makeText(getContext(), "Category deleted", Toast.LENGTH_SHORT).show();
    }

    // Reset input fields after adding or editing a category
    private void clearInputFields() {
        categoryInput.setText("");
        promotedCheckbox.setChecked(false);
    }

    // Reset UI back to "Add Category" mode
    private void resetToAddMode() {
        addCategoryButton.setVisibility(View.VISIBLE);
        updateCategoryButton.setVisibility(View.GONE);
        cancelEditButton.setVisibility(View.GONE);  // Hide the Cancel button
    }

    @Override
    public void onPause() {
        super.onPause();

        // Re-enable the movieManagerButton when leaving CategoryManagerFragment
        Button movieManagerButton = getActivity().findViewById(R.id.movie_manager_button);
        if (movieManagerButton != null) {
            movieManagerButton.setEnabled(true);
        }
    }

}
