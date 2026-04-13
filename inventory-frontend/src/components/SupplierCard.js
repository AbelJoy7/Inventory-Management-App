import React from "react";

function SupplierCard({ supplier, role, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <h4>{supplier.name}</h4>
      </div>
      <div className="product-body">
        <p><strong>Email:</strong> {supplier.email}</p>
        <p><strong>Phone:</strong> {supplier.phone}</p>
        <p><strong>Address:</strong> {supplier.address}</p>
      </div>
      
      {/* Both ADMIN and STAFF can edit/delete suppliers */}
      {(role === "ADMIN" || role === "STAFF") && (
        <div className="card-actions">
          <button className="btn-edit" onClick={() => onEdit(supplier)}>Edit</button>
          <button className="btn-delete" onClick={() => onDelete(supplier.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default SupplierCard;
