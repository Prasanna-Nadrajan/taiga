import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${productId}`);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const { data } = await API.post(`/reviews/${productId}`, { rating, comment });
      setReviews([data, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const hasReviewed = user && reviews.some(r => r.user?._id === user._id);

  return (
    <div className="review-section" style={{ marginTop: '40px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
      <h2>Customer Reviews</h2>
      
      {user?.role === 'customer' && !hasReviewed ? (
        <form onSubmit={submitReview} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '30px' }}>
          <h4>Write a Review</h4>
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{ margin: '15px 0' }}>
             <StarRating rating={rating} setRating={setRating} interactive={true} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike?"
            required
            style={{ width: '100%', padding: '10px', height: '100px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '15px', fontFamily: 'inherit' }}
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : user && hasReviewed ? (
        <div style={{ marginBottom: '30px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
          You have already reviewed this product.
        </div>
      ) : null}

      {!user && (
        <div style={{ marginBottom: '30px', padding: '15px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
          Please <a href="/login" style={{textDecoration:'underline'}}>login</a> to write a review.
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map(review => (
            <div key={review._id} className="review-card" style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                 <img src={review.user?.avatar || 'https://via.placeholder.com/40'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                 <div>
                   <div style={{ fontWeight: '600' }}>{review.user?.name || 'Anonymous User'}</div>
                   <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
                 </div>
              </div>
              <StarRating rating={review.rating} />
              <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
