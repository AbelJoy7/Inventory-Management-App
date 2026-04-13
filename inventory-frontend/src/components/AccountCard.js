import React from 'react';

function AccountCard({ account, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-info">
        <h4>{account.username}</h4>
        <p className="description">{account.email}</p>
        <p className="price">Role: {account.role}</p>
      </div>
      <div className="card-actions">
        <button 
          className="btn-danger" 
          onClick={() => onDelete(account.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default AccountCard;
