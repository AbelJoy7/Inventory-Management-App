import React, { useState, useEffect } from "react";
import inventoryService from "../services/inventoryService";
import productsService from "../services/productsService";

function AddTransaction({ fetchInventory }) {

  const [products, setProducts] = useState([]);
  const [transaction, setTransaction] = useState({
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

  const handleChange = (e) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!transaction.product) {
      alert("Please select a product.");
      return;
    }

    try {
      await inventoryService.create(transaction);
      alert("Transaction Logged Successfully");
      fetchInventory(); // refresh list
      setTransaction({
        product: "",
        quantity: "",
        transaction_type: "IN",
        reference: ""
      });
    } catch (error) {
      console.error("Error logging transaction:", error);
      alert("Failed to log transaction. Check product stock levels.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log New Transaction</h2>

      <div className="form-group">
        <label>Product</label>
        <select 
          name="product" 
          value={transaction.product} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
        >
          <option value="">-- Select a Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Transaction Type</label>
        <select 
          name="transaction_type" 
          value={transaction.transaction_type} 
          onChange={handleChange} 
          required
          style={{ width: '100%', padding: '12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', boxSizing: 'border-box', background: '#f8fafc', fontSize: '0.95rem' }}
        >
          <option value="IN">Stock IN (Receive)</option>
          <option value="OUT">Stock OUT (Dispatch / Sell)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input 
          type="number" 
          name="quantity" 
          min="1" 
          placeholder="Quantity" 
          value={transaction.quantity} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Reference (Optional)</label>
        <input 
          type="text" 
          name="reference" 
          placeholder="PO Number, Order ID, etc." 
          value={transaction.reference} 
          onChange={handleChange} 
        />
      </div>

      <button type="submit" className="btn-primary">Log Transaction</button>

    </form>
  );
}

export default AddTransaction;
