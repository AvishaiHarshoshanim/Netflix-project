import React from 'react';

const DropdownCheckbox = ({ categories, geter, seter }) => {


    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
    
        seter((prev) => ({
          ...prev,
          categories: checked
            ? [...prev.categories, value] // Add category name if checked
            : prev.categories.filter((name) => name !== value), // Remove category name if unchecked
        }));
    }

    return (
        <div className="dropdown">
            <button className="btn btn-light dropdown-toggle ms-2" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Select Categories
            </button>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {categories.map((category) => (
                    <li key={category.name} className="dropdown-item">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`category-${category.name}`}
                                value={category.name}
                                checked={geter.categories.includes(category.name)}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={`category-${category.name}`}>
                                {category.name}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DropdownCheckbox;