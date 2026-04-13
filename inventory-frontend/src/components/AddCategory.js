import React, { useState } from "react";
import categoriesService from "../services/categoriesService";

function AddCategory({ fetchCategories }) {

  const [category, setCategory] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {
    setCategory({
      ...category,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Submitting category: ", category);
      const res = await categoriesService.create(category);
      console.log("Response:", res);
      alert("Category Added Successfully");
      fetchCategories(); // refresh list
      setCategory({
        name: "",
        description: ""
      });
    } catch (error) {
      console.error("Error adding category:", error);
      console.error("Error Details:", error.response?.data || error.message);
      alert(`Failed to add category: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Category</h2>

      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" placeholder="Category Name" value={category.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea 
          name="description" 
          placeholder="Category Description" 
          value={category.description} 
          onChange={handleChange} 
          rows="4"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <button type="submit" className="btn-primary">Add Category</button>

    </form>
  );
}

export default AddCategory;
