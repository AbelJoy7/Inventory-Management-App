import React, { useState, useEffect } from "react";
import productsService from "../services/productsService";
import categoriesService from "../services/categoriesService";

function AddProduct({ fetchProducts }) {

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    minimum_stock_level: "",
    category: ""
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesService.getAll();
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock, 10),
        minimum_stock_level: parseInt(product.minimum_stock_level, 10),
        category: parseInt(product.category, 10)
      };
      
      console.log("Submitting payload:", payload);
      const res = await productsService.create(payload);
      console.log("Response:", res.data);
      alert("Product Added Successfully");
      fetchProducts(); // refresh list
      setProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        minimum_stock_level: "",
        category: ""
      });
    } catch (error) {
      console.error("Error adding product:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to add product: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input type="text" name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input type="number" step="0.01" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input type="number" name="stock" placeholder="Initial Stock" value={product.stock} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Minimum Stock Level</label>
        <input type="number" name="minimum_stock_level" placeholder="Alert Level" value={product.minimum_stock_level} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select 
          name="category" 
          value={product.category} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc' }}
        >
          <option value="">-- Select Category --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary">Add Product</button>

    </form>
  );
}

export default AddProduct;