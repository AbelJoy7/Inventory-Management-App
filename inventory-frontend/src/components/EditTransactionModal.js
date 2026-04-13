import React, { useState, useEffect } from "react";
import inventoryService from "../services/inventoryService";
import productsService from "../services/productsService";

function EditTransactionModal({ transaction, onClose, fetchInventory }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product: "",
    quantity: "",
    transaction_type: "IN",
    reference: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productsService.getAll();
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData({
        product: transaction.product || "",
        quantity: transaction.quantity || "",
        transaction_type: transaction.transaction_type || "IN",
        reference: transaction.reference || ""
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product) {
      alert("Please select a product.");
      return;
    }
    try {
      await inventoryService.update(transaction.id, formData);
      alert("Transaction Updated Successfully");
      fetchInventory(); 
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction.");
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.5rem', color: '#1e293b' }}>Edit Transaction</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Product</label>
            <select 
              name="product" 
              value={formData.product} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
            >
              <option value="">-- Select a Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Transaction Type</label>
            <select 
              name="transaction_type" 
              value={formData.transaction_type} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
            >
              <option value="IN">Stock IN (Receive)</option>
              <option value="OUT">Stock OUT (Dispatch / Sell)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              min="1" 
              placeholder="Quantity" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569' }}>Reference (Optional)</label>
            <input 
              type="text" 
              name="reference" 
              placeholder="PO Number, Order ID, etc." 
              value={formData.reference} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;
