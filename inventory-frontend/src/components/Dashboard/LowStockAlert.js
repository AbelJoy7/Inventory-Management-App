import React from "react";


function LowStockAlert({ lowStockProducts }) {
  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="widget alert-success">
        <h3>Low Stock Alerts</h3>
        <p>All products have sufficient stock.</p>
      </div>
    );
  }

  return (
    <div className="widget alert-warning">
      <h3>⚠️ Low Stock Alerts</h3>
      <ul>
        {lowStockProducts.map(product => (
          <li key={product.id}>
            <strong>{product.name}</strong> - Stock: {product.stock} (Min: {product.minimum_stock_level})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LowStockAlert;
