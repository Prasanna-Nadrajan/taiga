import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await API.get('/auth/wishlist');
        setWishlist(data);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchWishlist();
  }, [user]);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('taiga_cart') || '[]');
    const existing = cart.find((item) => item.product === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + 1, product.stock);
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
        stock: product.stock
      });
    }
    localStorage.setItem('taiga_cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="wishlist-page container" style={{ padding: '20px' }}>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Your wishlist is currently empty.</p>
          <a href="/" className="btn btn-outline" style={{ marginTop: '15px' }}>Browse Products</a>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {wishlist.map(product => (
            <div key={product._id} style={{ position: 'relative' }}>
               <ProductCard product={product} onAddToCart={addToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
