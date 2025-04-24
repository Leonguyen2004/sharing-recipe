import React from 'react';
import StarRating from '../starrating/StarRating';
import './ReviewStats.css';
  
const ReviewStats = ({ stats, distribution }) => {

    return (
        <div className="rvcom-reviews-stats">
            <div className="rvcom-stats-summary">
                <StarRating rating={stats.average} count={0} showCount={false} />
                <p className="rvcom-stats-text">
                    {stats.average} out of 5
                    <br />
                    {stats.total} Ratings
                </p>
            </div>
            
            <div className="rvcom-stats-breakdown">
                {distribution.map(item => (
                    <div key={item.stars} className="rvcom-stats-row">
                        <span className="rvcom-stars-label">{item.stars} star</span>
                        <div className="rvcom-stats-bar-container">
                            <div 
                                className="rvcom-stats-bar" 
                                style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <span className="rvcom-stats-count">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewStats;