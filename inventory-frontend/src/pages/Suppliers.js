import React, { useEffect, useState } from "react";
import suppliersService from "../services/suppliersService";
import SupplierCard from "../components/SupplierCard";
import AddSupplier from "../components/AddSupplier";
import EditSupplierModal from "../components/EditSupplierModal";
import { getUserRole } from "../utils/auth";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  
  const role = getUserRole();

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersService.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await suppliersService.delete(id);
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("Failed to delete supplier.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Suppliers Management</h2>
        
        {(role === "ADMIN" || role === "STAFF") && (
          <button 
            className="btn-primary" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel Adding" : "+ Add New Supplier"}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="add-product-section" style={{ marginBottom: "2rem" }}>
          <AddSupplier fetchSuppliers={fetchSuppliers} />
        </div>
      )}

      <div className="products-wrapper">
        <h3>All Suppliers ({suppliers.length})</h3>
        <div className="products-grid">
          {suppliers.map(supplier => (
            <SupplierCard 
              key={supplier.id}
              supplier={supplier}
              role={role}
              onEdit={setEditingSupplier}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {editingSupplier && (
        <EditSupplierModal 
          supplier={editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onSave={fetchSuppliers}
        />
      )}
    </div>
  );
}

export default Suppliers;
