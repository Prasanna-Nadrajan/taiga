import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FiCheck, FiTruck, FiUser } from 'react-icons/fi';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/vendor');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data } = await API.get('/orders/delivery-agents');
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents');
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/confirm`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    }
  };

  const assignAgent = async (orderId) => {
    if (!selectedAgent) return alert('Select a delivery agent');
    try {
      await API.put(`/orders/${orderId}/assign`, { deliveryAgentId: selectedAgent });
      setAssigningOrder(null);
      setSelectedAgent('');
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="vendor-orders-page">
      <h1 className="page-title">Order Management</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Orders for your products will appear here</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="order-customer">
                <FiUser /> {order.customer?.name} ({order.customer?.email})
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
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button className="btn btn-primary btn-sm" onClick={() => confirmOrder(order._id)}>
                      <FiCheck /> Confirm
                    </button>
                  )}
                  {order.status === 'confirmed' && (
                    <>
                      {assigningOrder === order._id ? (
                        <div className="assign-form">
                          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                            <option value="">Select Agent</option>
                            {agents.map((a) => (
                              <option key={a._id} value={a._id}>{a.name} ({a.phone || a.email})</option>
                            ))}
                          </select>
                          <button className="btn btn-primary btn-sm" onClick={() => assignAgent(order._id)}>
                            Assign
                          </button>
                          <button className="btn btn-sm" onClick={() => setAssigningOrder(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={() => setAssigningOrder(order._id)}>
                          <FiTruck /> Assign Delivery
                        </button>
                      )}
                    </>
                  )}
                  {order.deliveryAgent && (
                    <span className="delivery-info">
                      <FiTruck /> {order.deliveryAgent.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
