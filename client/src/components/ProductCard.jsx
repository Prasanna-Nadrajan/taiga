import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import HeartIcon from './HeartIcon';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
        <HeartIcon productId={product._id} />
      </div>
      <Link to={`/product/${product._id}`} className="product-image-link">
        <img
          src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>
        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating || 0}</span>
          <span className="review-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-price">₹{product.price?.toLocaleString()}</div>
        <div className="product-meta">
          {product.stock > 0 ? (
            <span className="in-stock">In Stock</span>
          ) : (
            <span className="out-of-stock">Out of Stock</span>
          )}
        </div>
        {onAddToCart && product.stock > 0 && (
          <button
            className="btn btn-primary btn-add-cart"
            onClick={() => onAddToCart(product)}
          >
            <FiShoppingCart /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
