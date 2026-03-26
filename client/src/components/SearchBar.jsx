import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { FiSearch, FiLoader } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const { data } = await API.get(`/products?search=${query.trim()}&limit=5`);
          setResults(data.products || []);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productId) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowDropdown(false);
      navigate(`/?search=${query.trim()}`);
    }
  };

  return (
    <div className="search-bar-container" ref={dropdownRef}>
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
          className="search-input predictive"
        />
        {loading && <FiLoader className="search-spinner" />}
      </div>
      
      {showDropdown && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((item) => (
            <div
              key={item._id}
              className="search-dropdown-item"
              onClick={() => handleSelect(item._id)}
            >
              <img src={item.image} alt={item.name} className="search-item-img" />
              <div className="search-item-info">
                <span className="search-item-name">{item.name}</span>
                <span className="search-item-price">₹{item.price?.toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div 
            className="search-dropdown-footer"
            onClick={() => {
              setShowDropdown(false);
              navigate(`/?search=${query.trim()}`);
            }}
          >
            See all results for "{query}"
          </div>
        </div>
      )}
      {showDropdown && query.trim().length > 1 && !loading && results.length === 0 && (
        <div className="search-dropdown">
          <div className="search-no-results">No products found.</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
