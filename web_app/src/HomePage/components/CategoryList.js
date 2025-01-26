import React from 'react';
import CategoryRow from './CategoryRow';

function CategoryList({ categories }) {
  return (
    <div className="categories-container">  {/* div for all categories */}
    {/* For each category (array object), we will run the function and it will give us a custom <CategoryRow /> element */}
      {categories.map((category) => (
        <CategoryRow
          key={category.categoryName}
          categoryName={category.categoryName}
          movies={category.movies}
        />
      ))}
    </div>
  );
}

export default CategoryList;
