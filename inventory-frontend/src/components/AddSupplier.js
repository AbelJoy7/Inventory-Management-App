import React, { useState } from "react";
import suppliersService from "../services/suppliersService";

function AddSupplier({ fetchSuppliers }) {

  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [countryCode, setCountryCode] = useState("+91");

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const finalSupplier = { ...supplier, phone: `${countryCode} ${supplier.phone}` };
      await suppliersService.create(finalSupplier);
      alert("Supplier Added Successfully");
      fetchSuppliers(); // refresh list
      setSupplier({
        name: "",
        email: "",
        phone: "",
        address: ""
      });
      setCountryCode("+91");
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert("Failed to add supplier. Please check the inputs.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <h2>Add New Supplier</h2>

      <div className="form-group">
        <label>Name</label>
        <input type="text" name="name" placeholder="Supplier Name" value={supplier.name} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" placeholder="Email" value={supplier.email} onChange={handleChange} required />
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
          <input type="text" name="phone" placeholder="Phone Number" value={supplier.phone} onChange={handleChange} required style={{ width: "70%" }} />
        </div>
      </div>

      <div className="form-group">
        <label>Address</label>
        <textarea name="address" placeholder="Address" value={supplier.address} onChange={handleChange} required></textarea>
      </div>

      <button type="submit" className="btn-primary">Add Supplier</button>

    </form>
  );
}

export default AddSupplier;
