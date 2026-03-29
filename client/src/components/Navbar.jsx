import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiTruck, FiMenu, FiX, FiHeart, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'vendor': return '/vendor';
      case 'delivery_agent': return '/delivery';
      default: return '/';
    }
  };

  const getRoleName = () => {
    if (!user) return '';
    switch (user.role) {
      case 'customer': return 'Customer';
      case 'vendor': return 'Vendor';
      case 'delivery_agent': return 'Delivery Agent';
      case 'admin': return 'Administrator';
      default: return '';
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <Link to={getDashboardLink()} className="navbar-brand">
          <span className="brand-text">TAIGA</span><span className="brand-domain">.in</span>
        </Link>

        {(!user || user?.role === 'customer') && (
          <div className="nav-locator nav-hover">
            <FiMapPin className="locator-icon" />
            <div className="locator-text">
              <span className="nav-label-small">Delivering to Home</span>
              <span className="nav-label-main">Update location</span>
            </div>
          </div>
        )}

        {(!user || user?.role === 'customer') && (
          <div className="navbar-search">
            <SearchBar />
          </div>
        )}

        <div className="nav-right">
          {user ? (
            <>
              <div className="nav-user nav-hover">
                <div className="user-info">
                  <span className="nav-label-small">Hello, {user.name.split(' ')[0]}</span>
                  <span className="nav-label-main">Accounts & Lists ({getRoleName()})</span>
                </div>
                <div className="dropdown-content">
                  <button className="btn-logout" onClick={handleLogout}>Logout</button>
                </div>
              </div>

              {(!user || user.role === 'customer') && (
                <Link to="/orders" className="nav-orders nav-hover">
                  <span className="nav-label-small">Returns</span>
                  <span className="nav-label-main">& Orders</span>
                </Link>
              )}

              {(!user || user.role === 'customer') && (
                <Link to="/cart" className="nav-cart nav-hover">
                  <div className="cart-icon-wrapper">
                    <span className="cart-count">0</span>
                    <FiShoppingCart className="cart-icon-img" />
                  </div>
                  <span className="nav-label-main cart-label">Cart</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-user nav-hover" style={{ textDecoration: 'none' }}>
                <div className="user-info">
                  <span className="nav-label-small">Hello, sign in</span>
                  <span className="nav-label-main">Accounts & Lists</span>
                </div>
              </Link>

              <Link to="/login" className="nav-orders nav-hover" style={{ textDecoration: 'none' }}>
                <span className="nav-label-small">Returns</span>
                <span className="nav-label-main">& Orders</span>
              </Link>

              <Link to="/cart" className="nav-cart nav-hover" style={{ textDecoration: 'none' }}>
                <div className="cart-icon-wrapper">
                  <span className="cart-count">0</span>
                  <FiShoppingCart className="cart-icon-img" />
                </div>
                <span className="nav-label-main cart-label">Cart</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="navbar-bottom">
        <button className="menu-toggle nav-hover" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu className="menu-icon" /> All
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {(!user || user?.role === 'customer') ? (
            <>
              <Link to="/" className="bottom-link">Fresh</Link>
              <Link to="/" className="bottom-link">Sell</Link>
              <Link to="/" className="bottom-link">Best Sellers</Link>
              <Link to="/" className="bottom-link">Today's Deals</Link>
              <Link to="/" className="bottom-link">Mobiles</Link>
            </>
          ) : user?.role === 'vendor' ? (
            <>
              <Link to="/vendor" className="bottom-link">Dashboard</Link>
              <Link to="/vendor/products" className="bottom-link">Products</Link>
              <Link to="/vendor/orders" className="bottom-link">Orders</Link>
            </>
          ) : user?.role === 'delivery_agent' ? (
            <>
              <Link to="/delivery" className="bottom-link">My Deliveries</Link>
            </>
          ) : user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="bottom-link">Dashboard</Link>
              <Link to="/" className="bottom-link">Storefront</Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
