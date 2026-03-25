import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products/vendor/me'),
          API.get('/orders/vendor')
        ]);
        const revenue = ordersRes.data
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.totalAmount, 0);
        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          revenue
        });
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name} 👋</h1>
        <p>Here's what's happening with your store today</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <FiPackage />
          </div>
          <div className="stat-info">
            <h3>{stats.products}</h3>
            <p>Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <FiShoppingCart />
          </div>
          <div className="stat-info">
            <h3>{stats.orders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <h3>₹{stats.revenue.toLocaleString()}</h3>
            <p>Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <h3>{stats.orders > 0 ? Math.round(stats.revenue / stats.orders) : 0}</h3>
            <p>Avg. Order Value</p>
          </div>
        </div>
      </div>
      <div className="dashboard-actions">
        <Link to="/vendor/products" className="btn btn-primary"><FiPackage /> Manage Products</Link>
        <Link to="/vendor/orders" className="btn btn-outline"><FiShoppingCart /> View Orders</Link>
      </div>
      {recentOrders.length > 0 && (
        <div className="recent-section">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order._id} className="order-card compact">
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className={`status-badge status-${order.status}`}>{order.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="order-footer">
                  <span>{order.customer?.name}</span>
                  <span>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
