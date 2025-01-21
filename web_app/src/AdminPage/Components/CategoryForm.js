import React from 'react';

const CategoryForm = ({ newCategory, setNewCategory, addCategory }) => {

    return (
        <div className="input-group mb-3">
            {/* Text Input for Category Name */}
            <label htmlFor="categoryName" className="form-label"><span className="text-danger">*</span></label>
            <input
                type="text"
                className="form-control"
                placeholder="category's name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />

            {/* Checkbox for Promoted */}
            <div className="form-check d-flex align-items-center ms-1">
                <label
                    className="form-check-label me-5 text-white"
                    htmlFor="promotedCheckbox"
                >
                    Promoted:
                </label>
                <input
                    type="checkbox"
                    id="promotedCheckbox"
                    className="form-check-input"
                    checked={newCategory.promoted}
                    onChange={(e) => setNewCategory({ ...newCategory, promoted: e.target.checked })}
                />
            </div>


            {/* Button to Add Category */}
            <button className="btn btn-success ms-3" onClick={addCategory}>
                Add Category
            </button>
        </div>
    );
};

export default CategoryForm;