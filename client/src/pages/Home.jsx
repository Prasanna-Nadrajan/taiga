import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { FiFilter } from 'react-icons/fi';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', minRating: 0 });
  const [sortBy, setSortBy] = useState('');

  const search = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, filters, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories');
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

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">TAIGA</span></h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
      </div>

      <div className="home-container" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        
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
