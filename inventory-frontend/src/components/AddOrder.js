import React, { useState, useEffect } from "react";
import ordersService from "../services/ordersService";
import productsService from "../services/productsService";

function AddOrder({ fetchOrders }) {
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { product: "", quantity: 1 }
  ]);

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

  const handleItemChange = (index, e) => {
    const newItems = [...orderItems];
    newItems[index][e.target.name] = e.target.value;
    setOrderItems(newItems);
  };

  const addItemRow = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all rows have a product selected
    for (let item of orderItems) {
      if (!item.product) {
        alert("Please select a product for all rows.");
        return;
      }
    }

    try {
      await ordersService.create({ items: orderItems });
      alert("Order Created Successfully!");
      fetchOrders();
      setOrderItems([{ product: "", quantity: 1 }]);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Check product stock levels.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>Create New Order</h2>

      {orderItems.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Product</label>
            <select 
              name="product" 
              value={item.product} 
              onChange={(e) => handleItemChange(index, e)} 
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc' }}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} | Price: ₹{p.price})</option>
              ))}
            </select>
          </div>

          <div style={{ width: '120px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              min="1" 
              value={item.quantity} 
              onChange={(e) => handleItemChange(index, e)} 
              required 
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>

          {orderItems.length > 1 && (
            <button 
              type="button" 
              onClick={() => removeItemRow(index)}
              style={{ padding: '10px 15px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, height: '42px' }}
            >
              X
            </button>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
        <button 
          type="button" 
          onClick={addItemRow}
          style={{ padding: '12px 20px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Add another item
        </button>
        <button 
          type="submit" 
          className="btn-primary"
          style={{ padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Place Order
        </button>
      </div>

    </form>
  );
}

export default AddOrder;
