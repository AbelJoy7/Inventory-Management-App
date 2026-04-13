import React, { useState } from "react";
import suppliersService from "../services/suppliersService";

function EditSupplierModal({ supplier, onClose, onSave }) {
  const [countryCode, setCountryCode] = useState(() => {
    if (supplier.phone && supplier.phone.startsWith("+")) {
       return supplier.phone.split(" ")[0];
    }
    return "+91";
  });

  const [formData, setFormData] = useState(() => {
    let phoneNum = supplier.phone || "";
    if (phoneNum.startsWith("+")) {
       phoneNum = phoneNum.substring(phoneNum.indexOf(" ") + 1);
    }
    return {
      name: supplier.name,
      email: supplier.email,
      phone: phoneNum,
      address: supplier.address
    };
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = { ...formData, phone: `${countryCode} ${formData.phone}` };
      await suppliersService.update(supplier.id, finalData);
      onSave(); // Refresh data
      onClose(); // Close modal
    } catch (err) {
      console.error("Error updating supplier:", err);
      alert("Failed to update supplier.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={{ width: "30%", padding: "12px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", background: "#f8fafc" }}>
                <option value="+91">India (+91)</option>
                <option value="+1">USA (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+61">Australia (+61)</option>
              </select>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                style={{ width: "70%" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditSupplierModal;
