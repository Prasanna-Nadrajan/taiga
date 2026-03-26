import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiTruck, FiMenu, FiX, FiHeart } from 'react-icons/fi';
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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardLink()} className="navbar-brand">
          <span className="brand-icon">🐯</span>
          <span className="brand-text">TAIGA</span>
        </Link>

        {user?.role === 'customer' && (
          <div className="navbar-search">
            <SearchBar />
          </div>
        )}

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiPackage /> Products
                  </Link>
                  <Link to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiShoppingCart /> Cart
                  </Link>
                  <Link to="/wishlist" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiHeart /> Wishlist
                  </Link>
                  <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiPackage /> My Orders
                  </Link>
                </>
              )}
              {user.role === 'vendor' && (
                <>
                  <Link to="/vendor" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/vendor/products" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiPackage /> Products
                  </Link>
                  <Link to="/vendor/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                    <FiShoppingCart /> Orders
                  </Link>
                </>
              )}
              {user.role === 'delivery_agent' && (
                <Link to="/delivery" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <FiTruck /> My Deliveries
                </Link>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Storefront
                  </Link>
                </>
              )}
              <div className="nav-user">
                <div className="user-info">
                  <FiUser />
                  <span>{user.name}</span>
                  <span className="role-tag">{getRoleName()}</span>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link btn-register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
