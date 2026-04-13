import React, { useEffect, useState } from "react";
import inventoryService from "../services/inventoryService";
import AddTransaction from "../components/AddTransaction";
import EditTransactionModal from "../components/EditTransactionModal";

function Inventory() {

  const [transactions, setTransactions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchInventoryData = async () => {
    try {
      const res = await inventoryService.getAll();
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching inventory data:", err);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await inventoryService.delete(id);
        alert("Transaction Deleted Successfully");
        fetchInventoryData();
      } catch (error) {
        console.error("Error deleting transaction:", error);
        alert("Failed to delete transaction.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h2>Inventory Logs</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel Logging" : "+ Log Transaction"}
        </button>
      </div>

      {showAddForm && (
        <div className="add-product-section">
          <AddTransaction fetchInventory={fetchInventoryData} />
        </div>
      )}

      {editingTransaction && (
        <EditTransactionModal 
          transaction={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
          fetchInventory={fetchInventoryData} 
        />
      )}

      <div className="products-wrapper">
        <h3>Transaction History</h3>
        
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Product</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Quantity</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>Reference</th>
                <th style={{ padding: '16px', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px' }}>{new Date(t.date).toLocaleString()}</td>
                    <td style={{ padding: '16px', fontWeight: 500 }}>{t.product_name}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        background: t.transaction_type === 'IN' ? '#d1fae5' : '#fee2e2',
                        color: t.transaction_type === 'IN' ? '#10b981' : '#ef4444'
                      }}>
                        {t.transaction_type === 'IN' ? 'STOCK IN' : 'STOCK OUT'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{t.quantity}</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>{t.reference || '-'}</td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setEditingTransaction(t)}
                        style={{ marginRight: '8px', padding: '6px 12px', background: '#e0f2fe', color: '#0284c7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
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

export default Inventory;
