import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import LowStockAlert from "../components/Dashboard/LowStockAlert";
import RestockRecommendations from "../components/Dashboard/RestockRecommendations";
import productsService from "../services/productsService";
import analyticsService from "../services/analyticsService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const [lowStock, setLowStock] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [stockDist, setStockDist] = useState([]);
  const [summary, setSummary] = useState({
    total_products: 0,
    total_suppliers: 0,
    total_orders: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("all");

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        lowStockRes,
        recRes,
        topProdRes,
        salesRes,
        stockDistRes,
        summaryRes
      ] = await Promise.all([
        productsService.getLowStock(),
        productsService.getRestockRecommendations(),
        analyticsService.getTopProducts(timePeriod),
        analyticsService.getMonthlySales(timePeriod),
        analyticsService.getStockDistribution(),
        analyticsService.getSummary(timePeriod)
      ]);

      setLowStock(lowStockRes.data || []);
      setRecommendations(recRes.data || {});
      setTopProducts(topProdRes.data || []);
      setSummary(summaryRes.data || {});
      
      // format monthly sales for line chart
      const salesData = (salesRes.data || []).map(item => ({
        month: `${item.month}`,
        total: parseFloat(item.total_sales) || 0
      }));
      setMonthlySales(salesData);
      
      // format stock dist for pie chart
      const distData = (stockDistRes.data || []).map(item => ({
        name: item.name || "Uncategorized",
        value: item.stock || 0
      }));
      setStockDist(distData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timePeriod]);

  if (loading) {
    return (
      <div className="dashboard-wrapper" style={{ justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "1.2rem", color: "#64748b" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Overview</h1>
        
        {/* TIME PERIOD FILTER */}
        <div className="time-filter-pills" style={{ display: 'flex', gap: '0.25rem', background: '#f8fafc', padding: '0.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          {['all', 'today', 'week', 'month', 'year'].map(period => (
            <button 
              key={period}
              onClick={() => setTimePeriod(period)}
              style={{
                border: 'none',
                background: timePeriod === period ? '#ffffff' : 'transparent',
                color: timePeriod === period ? '#0f172a' : '#64748b',
                fontWeight: timePeriod === period ? '600' : '500',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: timePeriod === period ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                fontSize: '0.85rem'
              }}
            >
              {period === 'all' ? 'All Time' : period === 'today' ? 'Today' : `This ${period}`}
            </button>
          ))}
        </div>
      </div>

      {/* NEW STAT CARDS */}
      <div className="summary-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#64748b", margin: 0, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f172a", margin: "0.5rem 0" }}>₹{summary.total_revenue.toLocaleString()}</p>
        </div>
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#64748b", margin: 0, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Orders</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f172a", margin: "0.5rem 0" }}>{summary.total_orders}</p>
        </div>
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#64748b", margin: 0, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Total Products</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f172a", margin: "0.5rem 0" }}>{summary.total_products}</p>
        </div>
        <div className="glass-card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#64748b", margin: 0, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Active Suppliers</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0" }}>{summary.total_suppliers}</p>
        </div>
      </div>

      <div className="dashboard-grid-top">
        {/* Top Selling Products Bar Chart */}
        <div className="glass-card">
          <h2 className="card-title">🚀 Top Selling Products</h2>
          <div className="chart-container">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                  <XAxis dataKey="product_name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}/>
                  <Bar dataKey="total_sold" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{color: '#94a3b8', textAlign: 'center', marginTop: '2rem'}}>No top products available.</p>
            )}
          </div>
        </div>

        {/* Monthly Sales Line Chart */}
        <div className="glass-card">
          <h2 className="card-title">📈 Monthly Sales Trends</h2>
          <div className="chart-container">
            {monthlySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}}/>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}/>
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{color: '#94a3b8', textAlign: 'center', marginTop: '2rem'}}>No sales data available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-main">
        {/* Alerts & Widgets Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "0", background: "transparent", border: "none", boxShadow: "none" }}>
            <LowStockAlert lowStockProducts={lowStock} />
          </div>
          <div className="glass-card" style={{ padding: "0", background: "transparent", border: "none", boxShadow: "none" }}>
            <RestockRecommendations recommendations={recommendations} onRestockSuccess={fetchDashboardData} />
          </div>
        </div>

        {/* Stock Distribution Pie Chart */}
        <div className="glass-card">
          <h2 className="card-title">📦 Stock Distribution</h2>
          <div className="chart-container" style={{ height: "300px" }}>
            {stockDist.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stockDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}/>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{color: '#94a3b8', textAlign: 'center', marginTop: '2rem'}}>No stock distribution available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
