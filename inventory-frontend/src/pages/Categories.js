import React, { useEffect, useState } from "react";
import categoriesService from "../services/categoriesService";
import AddCategory from "../components/AddCategory";
import CategoryCard from "../components/CategoryCard";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchCategoriesData = async () => {
    try {
      const res = await categoriesService.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category? Products linked to this category may be affected.")) {
      try {
        await categoriesService.delete(id);
        fetchCategoriesData();
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h2>Categories</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel Adding Category" : "+ Add New Category"}
        </button>
      </div>

      {showAddForm && (
        <div className="add-product-section">
          <AddCategory fetchCategories={fetchCategoriesData} />
        </div>
      )}

      <div className="products-wrapper">
        <h3>All Categories ({categories.length})</h3>
        
        <div className="products-grid">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Categories;
