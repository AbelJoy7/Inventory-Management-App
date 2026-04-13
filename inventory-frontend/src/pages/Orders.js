import React, { useEffect, useState } from "react";
import ordersService from "../services/ordersService";
import AddOrder from "../components/AddOrder";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchOrdersData = async () => {
    try {
      const res = await ordersService.getAll();
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders data:", err);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order? (Stock will NOT be reverted)")) {
      try {
        await ordersService.delete(id);
        alert("Order Deleted Successfully");
        fetchOrdersData();
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete order.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Orders Dashboard</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel Order" : "+ Place New Order"}
        </button>
      </div>

      {showAddForm && (
        <AddOrder fetchOrders={fetchOrdersData} />
      )}

      <div className="products-wrapper">
        <h3>Order History</h3>
        
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Order ID</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Items</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>#{o.id}</td>
                    <td style={{ padding: '16px' }}>{new Date(o.created_at).toLocaleString()}</td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#475569' }}>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {o.items.map((item, idx) => (
                          <li key={idx}>Product ID {item.product} (Qty: {item.quantity})</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#059669' }}>₹{o.total_amount}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(o.id)}
                        style={{ padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
