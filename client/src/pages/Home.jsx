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
      <div className="hero-carousel" style={{ backgroundImage: `url(${slide.image})` }}>
        <div className="hero-gradient-overlay"></div>
        <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
          <FiChevronLeft className="hero-arrow-icon" />
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
          <FiChevronRight className="hero-arrow-icon" />
        </button>
      </div>

      <div className="home-content-container">
        {/* Amazon-style Card Layout Grid */}
        <div className="gw-card-layout">
          {/* Card 1: Deals of the Day */}
          {dealsProducts.length > 0 && (
            <div className="gw-card">
              <div className="gw-card-header">Deals of the Day</div>
              <div className="gw-card-body grid-layout">
                {dealsProducts.slice(0, 4).map(p => (
                   <Link to={`/product/${p._id}`} key={p._id} className="gw-product-item">
                     <img src={p.image} alt={p.name} />
                     <span className="gw-product-title">{p.name}</span>
                   </Link>
                ))}
              </div>
              <div className="gw-card-footer"><Link to="/">See all deals</Link></div>
            </div>
          )}

          {/* Card 2: Top Rated */}
          {topRatedProducts.length > 0 && (
            <div className="gw-card">
              <div className="gw-card-header">Top Rated Products</div>
              <div className="gw-card-body grid-layout">
                {topRatedProducts.slice(0, 4).map(p => (
                   <Link to={`/product/${p._id}`} key={p._id} className="gw-product-item">
                     <img src={p.image} alt={p.name} />
                     <span className="gw-product-title">{p.name}</span>
                   </Link>
                ))}
              </div>
              <div className="gw-card-footer"><Link to="/">Shop top rated</Link></div>
            </div>
          )}

          {/* Card 3: New Arrivals (single item) */}
          {recentProducts.length > 0 && (
            <div className="gw-card">
              <div className="gw-card-header">New Arrivals</div>
              <div className="gw-card-body single-layout">
                <Link to={`/product/${recentProducts[0]._id}`}>
                  <img src={recentProducts[0].image} alt={recentProducts[0].name} className="gw-single-img" />
                </Link>
              </div>
              <div className="gw-card-footer"><Link to="/">Explore new arrivals</Link></div>
            </div>
          )}

          {/* Card 4: Categories */}
          {categories.length > 0 && (
            <div className="gw-card">
              <div className="gw-card-header">Shop by Category</div>
              <div className="gw-card-body grid-layout">
                {categories.slice(0, 4).map(c => (
                   <div key={c._id} className="gw-product-item" onClick={() => handleCategoryTag(c._id)} style={{cursor: 'pointer'}}>
                     <div className="category-placeholder">{CATEGORY_ICONS[c.name] || '📦'}</div>
                     <span className="gw-product-title">{c.name}</span>
                   </div>
                ))}
              </div>
              <div className="gw-card-footer"><Link to="/">See all categories</Link></div>
            </div>
          )}
        </div>

        {/* ========== MAIN PRODUCT GRID ========== */}
        <div id="products-section" className="main-products-section" style={{ padding: '0 20px 20px' }}>
          <div className="section-header" style={{ marginBottom: '16px', background: '#fff', padding: '12px', border: '1px solid #ddd' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>🛍️ All Products</h2>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="home-sidebar" style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
               <FilterSidebar categories={categories} onFilterChange={setFilters} />
            </div>

            <div className="home-main" style={{ flex: 1 }}>
              <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', background: '#fff', padding: '10px', border: '1px solid #ddd' }}>
                <div className="search-results-info" style={{marginBottom: 0}}>
                  {search && <span>Showing results for: <strong>"{search}"</strong></span>}
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Avg. Customer Review</option>
                </select>
              </div>

              {loading ? (
                <div className="loading-screen">
                  <div className="spinner"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state" style={{background: '#fff', padding: '40px', textAlign: 'center'}}>
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
      </div>
    </div>
  );
};

export default Home;
