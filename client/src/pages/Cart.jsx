import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FiTrash2, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('taiga_cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, delta) => {
    const updated = cart.map((item) => {
      if (item.product === productId) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('taiga_cart', JSON.stringify(updated));
  };

  const removeItem = (productId) => {
    const updated = cart.filter((item) => item.product !== productId);
    setCart(updated);
    localStorage.setItem('taiga_cart', JSON.stringify(updated));
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill in your shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(({ product, quantity }) => ({ product, quantity })),
        shippingAddress: address,
        paymentMethod: 'COD'
      };
      await API.post('/orders', orderData);
      localStorage.removeItem('taiga_cart');
      setCart([]);
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <FiShoppingBag className="empty-icon" />
        <h2>Your cart is empty</h2>
        <p>Browse products and add them to your cart</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price?.toLocaleString()}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.product, -1)}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product, 1)}><FiPlus /></button>
                </div>
                <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</p>
                <button className="btn-icon btn-danger" onClick={() => removeItem(item.product)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>₹{getTotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{getTotal().toLocaleString()}</span>
          </div>

          <div className="shipping-form">
            <h3>Shipping Address</h3>
            <input
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
            <div className="form-row">
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
            <input
              placeholder="ZIP Code"
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            />
          </div>

          <button
            className="btn btn-primary btn-full"
            onClick={placeOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : <><FiShoppingBag /> Place Order (COD)</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
