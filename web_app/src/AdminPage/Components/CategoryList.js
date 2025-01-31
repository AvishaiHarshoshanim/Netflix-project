import React from 'react';

const CategoryList = ({ categories, editingCategory, setEditingCategory, updateCategory, deleteCategory }) => {
    return (
        <ul className="list-group">
            {categories.map((category) => (
                <li key={category._id} className="list-group-item d-flex justify-content-between">
                    {editingCategory?._id === category._id ? (
                        <div className="d-flex w-100">
                            <input
                                type="text"
                                className="form-control me-2"
                                value={editingCategory.name}
                                onChange={(e) =>
                                    setEditingCategory({ ...editingCategory, name: e.target.value })
                                }
                            />
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                checked={editingCategory.promoted}
                                onChange={(e) =>
                                    setEditingCategory({ ...editingCategory, promoted: e.target.checked })
                                }
                            />
                            <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => updateCategory(editingCategory)}
                            >
                                Save
                            </button>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingCategory(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <>
                            <div>
                                {category.name}{" "}
                                {category.promoted && <span className="badge bg-warning">Promoted</span>}
                            </div>
                            <div className='actions'>
                                <button
                                    className="btn btn-edit btn-sm ms-2"
                                    onClick={() => setEditingCategory(category)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteCategory(category._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default CategoryList;