import React from "react";
import "./App.css";
import Products from "./pages/Products";
import Accounts from "./pages/Accounts";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Suppliers from "./pages/Suppliers";
import Dashboard from "./pages/Dashboard";
import { getUserRole } from "./utils/auth";

function App() {
  const currentPath = window.location.pathname;
  const role = getUserRole();

  // If there's no role (not logged in), redirect everyone to login pages
  // (Unless they are already on /login to prevent infinite loops)
  if (!role && currentPath !== "/login") {
     window.location.href = "/login";
     return null;
  }

  if (currentPath === "/login") {
    // If they are logged in but try to go to /login, redirect to Dashboard
    if (role) {
      window.location.href = "/";
      return null;
    }
    return <Login />;
  }

  // Handle protected accounts page
  if (currentPath === "/accounts" && role !== "ADMIN") {
    return (
      <div className="dashboard-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Handle protected categories page
  if (currentPath === "/categories" && role === "SUPPLIER") {
    return (
      <div className="dashboard-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  const renderContent = () => {
    if (currentPath === "/accounts" && role === "ADMIN") return <Accounts />;
    if (currentPath === "/categories" && role !== "SUPPLIER") return <Categories />;
    if (currentPath === "/suppliers" && role !== "SUPPLIER") return <Suppliers />;
    if (currentPath === "/inventory") return <Inventory />;
    if (currentPath === "/orders") return <Orders />;
    if (currentPath === "/products") return <Products />;
    return <Dashboard />;
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">✨</div>
          <h1 className="logo-text">Aura Inventory</h1>
        </div>
        <nav className="sidebar-nav">
          <a href="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>Dashboard</a>
          
          <a href="/products" className={`nav-item ${currentPath === '/products' ? 'active' : ''}`}>Products</a>
          
          <a href="/inventory" className={`nav-item ${currentPath === '/inventory' ? 'active' : ''}`}>Inventory Logs</a>
          
          {role === 'ADMIN' && (
            <a href="/accounts" className={`nav-item ${currentPath === '/accounts' ? 'active' : ''}`}>Accounts</a>
          )}
          
          {role !== 'SUPPLIER' && (
            <a href="/categories" className={`nav-item ${currentPath === '/categories' ? 'active' : ''}`}>Categories</a>
          )}

          {role !== 'SUPPLIER' && (
            <a href="/suppliers" className={`nav-item ${currentPath === '/suppliers' ? 'active' : ''}`}>Suppliers</a>
          )}

          <a href="/orders" className={`nav-item ${currentPath === '/orders' ? 'active' : ''}`}>Orders</a>
          


          <a href="#" onClick={handleLogout} className="nav-item" style={{ marginTop: 'auto', color: '#dc2626' }}>Logout</a>
        </nav>
      </aside>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;