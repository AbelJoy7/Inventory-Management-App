import React, { useEffect, useState } from "react";
import accountsService from "../services/accountsService";
import AddAccount from "../components/AddAccount";
import AccountCard from "../components/AccountCard";

function Accounts() {

  const [accounts, setAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAccountsData = async () => {
    try {
      const res = await accountsService.getAll();
      setAccounts(res.data);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    fetchAccountsData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountsService.delete(id);
        fetchAccountsData();
      } catch (err) {
        console.error("Error deleting account:", err);
        alert("Failed to delete account.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h2>Accounts & Users</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel Adding Account" : "+ Add New Account"}
        </button>
      </div>

      {showAddForm && (
        <div className="add-product-section">
          <AddAccount fetchAccounts={fetchAccountsData} />
        </div>
      )}

      <div className="products-wrapper">
        <h3>All Accounts ({accounts.length})</h3>
        
        <div className="products-grid">
          {accounts.map((account) => (
            <AccountCard 
              key={account.id} 
              account={account} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Accounts;
