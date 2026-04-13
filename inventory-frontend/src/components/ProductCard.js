import React, { useState } from "react";
import productsService from "../services/productsService";

function ProductCard({ product, role, onEdit, onDelete }) {
  const [demandForecast, setDemandForecast] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const handleGetForecast = async () => {
    setLoadingForecast(true);
    try {
      const response = await productsService.getDemandForecast(product.id);
      setDemandForecast(response.data.predicted_demand_next_month);
    } catch (error) {
      console.error("Failed to get demand forecast", error);
      alert("Failed to get demand forecast.");
    } finally {
      setLoadingForecast(false);
    }
  };

  const getStockStatusClass = () => {
    if (product.stock === 0) return "status-out-of-stock";
    if (product.stock <= product.minimum_stock_level) return "status-low-stock";
    return "status-in-stock";
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <h4><span style={{color: "#64748b", fontSize: "0.85em", marginRight: "0.5rem"}}>#{product.id}</span>{product.name}</h4>
        <span className={`stock-status ${getStockStatusClass()}`}>
          Stock: {product.stock}
        </span>
      </div>
      <p className="product-price">₹{product.price}</p>
      {product.supplier_name && (
        <p className="product-supplier"><strong>Supplier:</strong> {product.supplier_name}</p>
      )}
      <p className="product-description">{product.description}</p>
      
      <div className="product-actions" style={{display: "flex", gap: "0.5rem", marginTop: "1rem"}}>
        <button onClick={() => onEdit(product)} className="btn-secondary">Edit</button>
        <button onClick={() => onDelete(product.id)} className="btn-danger">Delete</button>
      </div>

      <div className="ai-actions">
        {demandForecast !== null ? (
          <div className="forecast-result">
            <strong>AI Forecast:</strong> {demandForecast} units expected next month.
          </div>
        ) : (
          <button 
            onClick={handleGetForecast} 
            disabled={loadingForecast}
            className="btn-ai"
          >
            {loadingForecast ? "Loading Forecast..." : "Get AI Demand Forecast"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
