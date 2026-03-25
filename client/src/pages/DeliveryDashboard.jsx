import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiTruck, FiMapPin, FiPhone, FiUser, FiPackage } from 'react-icons/fi';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/delivery/assigned');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/delivery/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case 'shipped':
        return { label: 'Mark Out for Delivery', next: 'out_for_delivery', color: '#f97316' };
      case 'out_for_delivery':
        return { label: 'Mark Delivered', next: 'delivered', color: '#34d399' };
      default:
        return null;
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const completedOrders = orders.filter(o => o.status === 'delivered');

  return (
    <div className="delivery-page">
      <div className="dashboard-header">
        <h1>Delivery Dashboard 🚚</h1>
        <p>Welcome, {user?.name}. You have {activeOrders.length} active deliveries.</p>
      </div>
      <div className="stats-grid compact">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
            <FiTruck />
          </div>
          <div className="stat-info">
            <h3>{activeOrders.length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34d399, #6ee7b7)' }}>
            <FiPackage />
          </div>
          <div className="stat-info">
            <h3>{completedOrders.length}</h3>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      {activeOrders.length > 0 && (
        <div className="section">
          <h2>Active Deliveries</h2>
          <div className="orders-list">
            {activeOrders.map((order) => {
              const action = getNextAction(order.status);
              return (
                <div key={order._id} className="order-card delivery-card">
                  <div className="order-header">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="delivery-details">
                    <div className="detail-row">
                      <FiUser /> <strong>{order.customer?.name}</strong>
                    </div>
                    {order.customer?.phone && (
                      <div className="detail-row">
                        <FiPhone /> {order.customer.phone}
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div className="detail-row">
                        <FiMapPin />
                        {[order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zipCode]
                          .filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="order-items compact-items">
                    {order.items.map((item, i) => (
                      <span key={i} className="item-pill">{item.name} ×{item.quantity}</span>
                    ))}
                  </div>
                  {action && (
                    <button
                      className="btn btn-primary btn-full"
                      style={{ background: action.color }}
                      onClick={() => updateStatus(order._id, action.next)}
                    >
                      <FiTruck /> {action.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {completedOrders.length > 0 && (
        <div className="section">
          <h2>Completed Deliveries</h2>
          <div className="orders-list">
            {completedOrders.map((order) => (
              <div key={order._id} className="order-card delivery-card completed">
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="status-badge status-delivered">Delivered ✓</span>
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

      {orders.length === 0 && (
        <div className="empty-state">
          <FiTruck className="empty-icon" />
          <h2>No deliveries assigned</h2>
          <p>New delivery assignments will appear here</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;
