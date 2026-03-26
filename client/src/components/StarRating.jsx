import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, setRating, interactive = false }) => {
  return (
    <div className="star-rating" style={{ display: 'flex', gap: '4px', color: 'var(--accent)' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          style={{
            cursor: interactive ? 'pointer' : 'default',
            fill: star <= rating ? 'var(--accent)' : 'none',
            fontSize: interactive ? '24px' : '16px'
          }}
          onClick={() => interactive && setRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
