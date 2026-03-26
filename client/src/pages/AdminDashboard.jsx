import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiPackage, FiShoppingCart, FiImage, FiSettings } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Note: In a real app we would have dedicated admin routes.
        // Reusing existing open/vendor routes for demonstration.
        const [prodRes, ordRes] = await Promise.all([
          API.get('/products?limit=100'),
          API.get('/orders/me').catch(() => ({ data: [] })) // Placeholder: should be all orders
        ]);
        setProducts(prodRes.data.products || []);
        setOrders(ordRes.data || []);
      } catch (error) {
        console.error('Error fetching admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard container" style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('inventory')}
        >
          <FiPackage /> Inventory tracking
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('orders')}
        >
          <FiShoppingCart /> Order Status
        </button>
        <button 
          className={`btn ${activeTab === 'cms' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('cms')}
        >
          <FiImage /> Marketing Banners
        </button>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : (
        <div className="admin-content" style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius)' }}>
          {activeTab === 'inventory' && (
            <div>
              <h3>Inventory Tracking</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Category</th>
                    <th style={{ padding: '10px' }}>Price</th>
                    <th style={{ padding: '10px' }}>Stock</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.image} alt={p.name} width="40" height="40" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                          {p.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>{p.category?.name || 'N/A'}</td>
                      <td style={{ padding: '10px' }}>₹{p.price}</td>
                      <td style={{ padding: '10px', color: p.stock < 10 ? 'var(--danger)' : 'var(--success)' }}>
                        {p.stock} units
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button className="btn btn-sm btn-outline"><FiSettings /> Manage</button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="5" style={{ padding: '15px', textAlign: 'center' }}>No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3>Order Status Management</h3>
              <p>Overview of recent orders across all vendors.</p>
              {orders.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No recent orders found.
                </div>
              ) : (
                 <ul style={{ listStyle: 'none', padding: 0 }}>
                    {orders.map(o => (
                      <li key={o._id} style={{ padding: '15px', borderBottom: '1px solid var(--border)' }}>
                        Order #{o._id} - {o.totalPrice} ({o.status})
                      </li>
                    ))}
                 </ul>
              )}
            </div>
          )}

          {activeTab === 'cms' && (
            <div>
              <h3>Marketing Banners CMS</h3>
              <p>Upload and manage homepage banner promotions.</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                <div style={{ flex: 1, border: '1px dashed var(--border)', padding: '30px', textAlign: 'center', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                  <FiImage size={32} style={{ color: 'var(--text-muted)' }} />
                  <p>Click to upload new banner</p>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius)' }}>
                  <h4>Active Banners</h4>
                  <p className="text-muted" style={{ fontSize: '14px', marginTop: '10px' }}>No active banners currently.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
