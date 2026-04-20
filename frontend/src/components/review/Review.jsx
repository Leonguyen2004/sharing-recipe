import { CircleUser } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { formatTimestampToDateTime } from "../../services/timeService";
import { getUserProfile } from '../../services/userService';
import StarRating from '../starrating/StarRating';
import './Review.css';
import { useNavigate } from 'react-router-dom';

const Review = ({ myReview }) => {
    const [authorData, setAuthorData] = useState({});
    const [loading, setLoading] = useState(false);
    const { userRole } = useAuth();
    console.log(userRole);
    const navigate = useNavigate();

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
            <div className="rvcom-review-user" onClick={() => navigate(`/account/${authorData.id}`)}>
                {authorData.photoURL? (
                    <img src={authorData.photoURL} alt="User" className="rvcom-user-avatar"/>
                ) : (
                    <CircleUser size={50} />
                )}
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