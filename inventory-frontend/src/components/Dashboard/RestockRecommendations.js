import React, { useState } from "react";
import productsService from "../../services/productsService";

function RestockRecommendations({ recommendations, onRestockSuccess }) {
  const [loading, setLoading] = useState(null);

  if (!recommendations || Object.keys(recommendations).length === 0) {
    return (
      <div className="widget alert-info">
        <h3>🤖 AI Restock Recommendations</h3>
        <p>No restock recommendations at this time.</p>
      </div>
    );
  }

  const handleRestock = async (productId, quantity) => {
    setLoading(productId);
    try {
      await productsService.restock(productId, quantity);
      alert("Successfully restocked!");
      if (onRestockSuccess) {
        onRestockSuccess();
      }
    } catch (error) {
      console.error("Failed to restock:", error);
      alert("Failed to restock product.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="widget alert-info">
      <h3>🤖 AI Restock Recommendations</h3>
      <ul>
        {Object.keys(recommendations).map(key => {
          const rec = recommendations[key];
          return (
            <li key={key} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{rec.product_name}</strong>: Recommend +{rec.recommended_restock_quantity} units
                  <br />
                  <small>Current Stock: {rec.current_stock} | Forecasted Demand: {rec.predicted_demand}</small>
                </div>
                <button 
                  className="btn-primary" 
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                  onClick={() => handleRestock(rec.product_id, rec.recommended_restock_quantity)}
                  disabled={loading === rec.product_id}
                >
                  {loading === rec.product_id ? "Restocking..." : "Quick Restock"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RestockRecommendations;
