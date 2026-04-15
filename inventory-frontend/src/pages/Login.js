import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Intentionally using raw axios to avoid interceptor issues before login is complete
      const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";
      const res = await axios.post(`${baseURL}token/`, credentials);
      
      // Store the tokens
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      
      // Redirect to the dashboard by reloading to /
      window.location.href = "/";
    } catch (err) {
      console.error("Login failed:", err);
      setError("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
      <div className="login-card" style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-icon" style={{ fontSize: '3rem' }}>✨</div>
          <h1 className="logo-text" style={{ margin: 0 }}>Aura Inventory</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={credentials.username} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={credentials.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
