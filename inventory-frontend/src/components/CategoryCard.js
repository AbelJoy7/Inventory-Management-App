import React from 'react';

function CategoryCard({ category, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-info">
        <h4>{category.name}</h4>
        <p className="description">{category.description}</p>
      </div>
      <div className="card-actions">
        <button 
          className="btn-danger" 
          onClick={() => onDelete(category.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default CategoryCard;
