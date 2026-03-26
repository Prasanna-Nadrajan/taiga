import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiArrowLeft, FiStar } from 'react-icons/fi';
import ReviewSection from '../components/ReviewSection';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('taiga_cart') || '[]');
    const existing = cart.find((item) => item.product === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
        stock: product.stock
      });
    }
    localStorage.setItem('taiga_cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>
      <div className="product-detail-container">
        <div className="product-detail-image">
          <img src={product.image || 'https://via.placeholder.com/500x500?text=No+Image'} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category?.name}</span>
          <h1>{product.name}</h1>
          <div className="product-rating-large">
            <FiStar className="star-icon" />
            <span>{product.rating || 0}</span>
            <span className="review-count">({product.numReviews || 0} reviews)</span>
          </div>
          <div className="product-price-large">₹{product.price?.toLocaleString()}</div>
          <p className="product-description">{product.description}</p>
          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>
          <div className="product-vendor">
            Sold by: <strong>{product.vendor?.name}</strong>
          </div>
          {user?.role === 'customer' && product.stock > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={addToCart}>
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
      <ReviewSection productId={product._id} />
    </div>
  );
};

export default ProductDetail;
