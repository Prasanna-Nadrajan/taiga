import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const HeartIcon = ({ productId }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.wishlist) {
      setIsActive(user.wishlist.includes(productId));
    }
  }, [user, productId]);

  const toggleHeart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      // Prompt logic or redirect could go here
      alert("Please login to save items to your wishlist.");
      return;
    }

    setLoading(true);
    try {
      // Optimistic UI update
      setIsActive(!isActive);
      const { data } = await API.put(`/auth/wishlist/${productId}`);
      // Update local user object wishlist quietly if needed
      user.wishlist = data;
    } catch (error) {
      // Revert on failure
      setIsActive(!isActive);
      console.error('Failed to update wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role && user.role !== 'customer') return null;

  return (
    <button 
      onClick={toggleHeart} 
      disabled={loading}
      style={{
        background: 'rgba(255,255,255,0.8)',
        border: '1px solid var(--border)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'var(--transition)',
        color: isActive ? 'var(--danger)' : 'var(--text-muted)'
      }}
      className="heart-btn"
      title={isActive ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <FiHeart fill={isActive ? 'var(--danger)' : 'none'} size={18} />
    </button>
  );
};

export default HeartIcon;
