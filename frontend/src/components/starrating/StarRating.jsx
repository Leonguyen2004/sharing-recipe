import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ 
  rating, 
  count, 
  size, 
  showCount = true,
  onRatingChange = null 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!onRatingChange;

  const sizeMap = { small: 15, medium: 20, large: 30 };
  let sizeIcon = sizeMap[size];
  
  const handleMouseEnter = (index) => {
    if (isInteractive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const handleClick = (index) => {
    if (isInteractive) {
      onRatingChange(index);
    }
  };

  const renderStars = (sizeIcon) => {
    const stars = [];
    const activeRating = hoverRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      // Determine if this star should be filled based on the active rating
      const isFilled = i <= activeRating;
      
      stars.push(
        <div 
          key={i}
          className={`srcom-star-wrapper ${isInteractive ? 'interactive' : ''}`}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
        >
          <Star 
            className={`srcom-star ${isFilled ? 'filled-star' : 'empty-star'}`}
            fill={isFilled ? 'currentColor' : 'none'}
            strokeWidth={1.5}
            size={sizeIcon}
          />
        </div>
      );
    }
    
    return stars;
  };
  
  return (
    <div className={`srcom-star-rating ${size}`}>
      <div className="srcom-stars">{renderStars(sizeIcon)}</div>
      {showCount && (
        <div className="srcom-rating-text">
          <span className="srcom-rating-value" >{rating.toFixed(1)}</span>
          {count && <span className="srcom-rating-count">({count})</span>}
        </div>
      )}
    </div>
  );
};

export default StarRating;