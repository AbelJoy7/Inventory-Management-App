import React, { useEffect, useState } from "react";
import productsService from "../services/productsService";
import categoriesService from "../services/categoriesService";
import AddProduct from "../components/AddProduct";
import ProductCard from "../components/ProductCard";
import EditProductModal from "../components/EditProductModal";
import LowStockAlert from "../components/Dashboard/LowStockAlert";
import RestockRecommendations from "../components/Dashboard/RestockRecommendations";
import { getUserRole } from "../utils/auth";

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // New category state
  const [selectedCategory, setSelectedCategory] = useState("ALL"); // Category filter state
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [restockRecs, setRestockRecs] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const role = getUserRole();

  const fetchDashboardData = async () => {
    try {
      const [productsRes, lowStockRes, restockRes, categoriesRes] = await Promise.all([
        productsService.getAll(),
        productsService.getLowStock(),
        productsService.getRestockRecommendations(),
        categoriesService.getAll() // Fetch categories too
      ]);
      setProducts(productsRes.data);
      setLowStockProducts(lowStockRes.data);
      setRestockRecs(restockRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsService.delete(id);
        fetchDashboardData();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-header">
        <h2>Inventory Dashboard</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel Adding Product" : "+ Add New Product"}
        </button>
      </div>

      <div className="widgets-row">
        <LowStockAlert lowStockProducts={lowStockProducts} />
        <RestockRecommendations recommendations={restockRecs} onRestockSuccess={fetchDashboardData} />
      </div>

      {showAddForm && (
        <div className="add-product-section">
          <AddProduct fetchProducts={fetchDashboardData} />
        </div>
      )}

      <div className="products-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3>All Products ({products.length})</h3>
          
          <div className="category-filter">
            <label style={{ marginRight: "0.5rem", fontWeight: "bold" }}>Filter by Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "0.4rem", borderRadius: "5px", border: "1px solid #cbd5e1" }}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="products-grid">
          {products
            .filter(product => selectedCategory === "ALL" || product.category === parseInt(selectedCategory))
            .map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              role={role}
              onEdit={setEditingProduct} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </div>

      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSave={fetchDashboardData} 
        />
      )}

    </div>
  );
}

export default Products;