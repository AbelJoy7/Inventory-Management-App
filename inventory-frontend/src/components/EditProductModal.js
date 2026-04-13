import React, { useState } from "react";
import productsService from "../services/productsService";

function EditProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    minimum_stock_level: product.minimum_stock_level,
    category: product.category,
    is_available: product.is_available
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productsService.update(product.id, formData);
      onSave(); // Trigger a refresh
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Minimum Stock Level</label>
            <input type="number" name="minimum_stock_level" value={formData.minimum_stock_level} onChange={handleChange} required />
          </div>

          <div className="form-group check-group">
            <label>
              <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleChange} />
              Is Available
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">Save Changes</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
