import { ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import IconButton from '../button/IconButton';
import StarRating from '../starrating/StarRating';
import './Review.css';
import { getUserProfile } from '../../services/userService';
import { auth } from '../../firebase/config';
import { formatTimestampToDateTime } from "../../services/timeService";

const Review = ({ myReview }) => {
    const [authorData, setAuthorData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAuthorOfReview = async () => {
            try {
                setLoading(true);
                const userData = await getUserProfile(myReview.authorId);  
                setAuthorData(userData);
            } catch (error) {
                console.error("Error fetching author data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorOfReview();
    }, []);

    if (loading) return <div>Loading....</div>

    return (
        <div key={myReview.id} className="rvcom-review-item">
            <div className="rvcom-review-user">
                <img 
                    src={authorData.photoURL} 
                    alt="avatar"
                    className="rvcom-user-avatar" 
                />
                <h3 className="rvcom-user-name">{authorData.displayName}</h3>
            </div>
            
            <div className="rvcom-review-content">
                <div className="rvcom-review-header">
                    <StarRating rating={myReview.rating} count={0} showCount={false} size="small" />
                    <span className="rvcom-review-date">{formatTimestampToDateTime(myReview.createdAt)}</span>
                </div>
                
                <div className='rvcom-review-image-text'>
                    {myReview.imageUrl && (
                        <img src={myReview.imageUrl} className='rvcom-review-img'/>
                    )}
                    <p className="rvcom-review-text">{myReview.comment}</p>
                </div>
                
            </div>
        </div>
    );
};

export default Review;