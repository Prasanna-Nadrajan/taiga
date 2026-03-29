import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HERO_SLIDES = [
  {
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 50% off on premium gadgets & accessories',
    cta: 'Shop Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80',
    category: 'Electronics',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover the latest collection — fresh styles every week',
    cta: 'Explore Now',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80',
    category: '',
  },
  {
    title: 'Watches Collection',
    subtitle: 'Premium timepieces at unbeatable prices',
    cta: 'Shop Watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1600&q=80',
    category: 'Watches',
  },
  {
    title: 'Daily Essentials',
    subtitle: 'Stock up on utilities you need — great value guaranteed',
    cta: 'Browse Utilities',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1600&q=80',
    category: 'Utilities',
  },
];

const CATEGORY_ICONS = {
  Electronics: '💻',
  Watches: '⌚',
  Utilities: '🔧',
  Fashion: '👗',
  Books: '📚',
  Sports: '⚽',
  Home: '🏠',
  Beauty: '💄',
  Toys: '🧸',
  Food: '🍔',
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', minRating: 0 });
  const [sortBy, setSortBy] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTag, setActiveTag] = useState('');
  const slideInterval = useRef(null);

  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filters, sortBy]);

  // Auto-slide hero carousel
  useEffect(() => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideInterval.current);
  }, []);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  const prevSlide = () => goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((currentSlide + 1) % HERO_SLIDES.length);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchAllProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setAllProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch all products');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (sortBy) params.append('sort', sortBy);
      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('taiga_cart') || '[]');
    const existing = cart.find((item) => item.product === product._id);
    if (existing) {
      existing.quantity += 1;
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

  const handleCategoryTag = (catId) => {
    if (activeTag === catId) {
      setActiveTag('');
      setFilters({ ...filters, category: '' });
    } else {
      setActiveTag(catId);
      setFilters({ ...filters, category: catId });
    }
  };

  // Derived data for special sections
  const dealsProducts = [...allProducts]
    .filter((p) => p.stock > 0)
    .sort((a, b) => a.price - b.price)
    .slice(0, 8);

  const topRatedProducts = [...allProducts]
    .filter((p) => p.rating > 0)
    .sort((a, b) => b.rating - a.rating || b.numReviews - a.numReviews)
    .slice(0, 8);

  const recentProducts = [...allProducts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="home-page">
      {/* ========== HERO CAROUSEL ========== */}
      <div className="hero-carousel" style={{ background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(${slide.image}) center/cover no-repeat` }}>
        <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
          <FiChevronLeft />
        </button>
        <div className="hero-carousel-content">

          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-subtitle">{slide.subtitle}</p>
          <button
            className="btn btn-primary btn-lg hero-cta"
            onClick={() => {
              if (slide.category) {
                const cat = categories.find((c) => c.name === slide.category);
                if (cat) handleCategoryTag(cat._id);
              }
              document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {slide.cta}
          </button>
        </div>
        <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
          <FiChevronRight />
        </button>
        <div className="hero-dots">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ========== CATEGORY TAGS BAR ========== */}
      {categories.length > 0 && (
        <div className="category-tags-bar">
          <div className="category-tags-inner">
            <button
              className={`category-tag ${activeTag === '' ? 'active' : ''}`}
              onClick={() => { setActiveTag(''); setFilters({ ...filters, category: '' }); }}
            >
              🏷️ All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-tag ${activeTag === cat._id ? 'active' : ''}`}
                onClick={() => handleCategoryTag(cat._id)}
              >
                {CATEGORY_ICONS[cat.name] || '📦'} {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========== FEATURE HIGHLIGHTS STRIP ========== */}
      <div className="feature-strip">
        <div className="feature-item">
          <FiTruck className="feature-icon" />
          <div>
            <strong>Free Shipping</strong>
            <span>On orders above ₹999</span>
          </div>
        </div>
        <div className="feature-item">
          <FiRefreshCw className="feature-icon" />
          <div>
            <strong>Easy Returns</strong>
            <span>30-day return policy</span>
          </div>
        </div>
        <div className="feature-item">
          <FiShield className="feature-icon" />
          <div>
            <strong>Secure Payment</strong>
            <span>100% secure checkout</span>
          </div>
        </div>
        <div className="feature-item">
          <FiHeadphones className="feature-icon" />
          <div>
            <strong>24/7 Support</strong>
            <span>Dedicated help center</span>
          </div>
        </div>
      </div>

      {/* ========== DEALS OF THE DAY ========== */}
      {dealsProducts.length > 0 && (
        <div className="home-section">
          <div className="section-header">
            <h2>🔥 Deals of the Day</h2>
            <span className="section-subtitle">Top picks at the best prices</span>
          </div>
          <div className="product-scroll-row">
            {dealsProducts.map((product) => (
              <div className="scroll-card" key={product._id}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== TOP RATED ========== */}
      {topRatedProducts.length > 0 && (
        <div className="home-section">
          <div className="section-header">
            <h2>⭐ Top Rated</h2>
            <span className="section-subtitle">Loved by our customers</span>
          </div>
          <div className="product-scroll-row">
            {topRatedProducts.map((product) => (
              <div className="scroll-card" key={product._id}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== NEW ARRIVALS ========== */}
      {recentProducts.length > 0 && (
        <div className="home-section">
          <div className="section-header">
            <h2>✨ New Arrivals</h2>
            <span className="section-subtitle">Just dropped — don't miss out</span>
          </div>
          <div className="product-scroll-row">
            {recentProducts.map((product) => (
              <div className="scroll-card" key={product._id}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== MAIN PRODUCT GRID ========== */}
      <div id="products-section" className="home-container" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {/* SIDEBAR FOR DESKTOP */}
        <div className="home-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
           <FilterSidebar categories={categories} onFilterChange={setFilters} />
        </div>

        <div className="home-main" style={{ flex: 1 }}>
          <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div className="search-results-info">
              {search && <span>Showing results for: <strong>"{search}"</strong></span>}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="">Sort by: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="section-header" style={{ marginBottom: '16px' }}>
            <h2>🛍️ All Products</h2>
          </div>

          {loading ? (
            <div className="loading-screen">
              <div className="spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
