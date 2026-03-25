import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';

const statusConfig = {
  pending: { icon: <FiClock />, color: '#fbbf24', label: 'Pending' },
  confirmed: { icon: <FiCheck />, color: '#60a5fa', label: 'Confirmed' },
  shipped: { icon: <FiPackage />, color: '#a78bfa', label: 'Shipped' },
  out_for_delivery: { icon: <FiTruck />, color: '#f97316', label: 'Out for Delivery' },
  delivered: { icon: <FiCheck />, color: '#34d399', label: 'Delivered' },
  cancelled: { icon: <FiX />, color: '#ef4444', label: 'Cancelled' }
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my');
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <FiPackage className="empty-icon" />
          <h2>No orders yet</h2>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: status.color }}>
                    {status.icon} {status.label}
                  </span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p className="item-name">{item.name}</p>
                        <p className="item-meta">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">Total: ₹{order.totalAmount?.toLocaleString()}</span>
                  {order.deliveryAgent && (
                    <span className="delivery-info">
                      <FiTruck /> {order.deliveryAgent.name} ({order.deliveryAgent.phone || 'N/A'})
                    </span>
                  )}
                  {order.status === 'pending' && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(order._id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
