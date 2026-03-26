import { useState, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';

const FilterSidebar = ({ categories, onFilterChange }) => {
  const [selectedCats, setSelectedCats] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    onFilterChange({
      category: selectedCats.join(','),
      minPrice,
      maxPrice,
      minRating
    });
  }, [selectedCats, minPrice, maxPrice, minRating]);

  const toggleCategory = (catId) => {
    setSelectedCats(prev => 
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="filter-sidebar" style={{ width: '250px', background: 'var(--bg-card)', padding: '20px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <FiFilter /> Filters
      </h3>

      <div className="filter-group" style={{ marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '10px' }}>Categories</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {categories.map(cat => (
            <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input 
                type="checkbox" 
                checked={selectedCats.includes(cat._id)} 
                onChange={() => toggleCategory(cat._id)}
                style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group" style={{ marginBottom: '25px' }}>
        <h4 style={{ marginBottom: '10px' }}>Price Range</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            min="0"
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }}
            min="0"
          />
        </div>
      </div>

      <div className="filter-group" style={{ marginBottom: '15px' }}>
        <h4 style={{ marginBottom: '10px' }}>Minimum Rating</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
              <input 
                type="radio" 
                name="rating"
                checked={minRating === rating} 
                onChange={() => setMinRating(rating)}
                style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
              />
              {rating} Stars & Up
            </label>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
             <input type="radio" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} style={{ accentColor: 'var(--accent)' }} /> 
             Any Rating
          </label>
        </div>
      </div>

      <button 
        className="btn btn-outline btn-sm btn-full" 
        onClick={() => {
          setSelectedCats([]);
          setMinPrice('');
          setMaxPrice('');
          setMinRating(0);
        }}
        style={{ marginTop: '10px' }}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
