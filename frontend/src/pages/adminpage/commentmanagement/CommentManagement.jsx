import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from '../searchbar/Searchbar';
import Modal from '../modal/Modal';
import './CommentManagement.css';
import { formatTimestampToDateTime } from '../../../services/timeService';
import { getAllReviews } from '../../../services/reviewService';
import { CircleUser } from 'lucide-react';
import { deleteReview } from '../../../services/reviewService';

const CommentManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState({
    sortBy: 'desc',
    sortOrder: 'createdAt'
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastDocumentId, setLastDocumentId] = useState(null);

  const fetchReviews = async (isLoadMore = false) => {
    try {
      setLoading(true);
      const params = {
        sortOrder: sort.sortBy,
        sortBy: sort.sortOrder,
        limit: 10,
        lastDocumentId: isLoadMore ? lastDocumentId : null
      };

      const response = await getAllReviews(params);
      console.log(response);
      
      if (isLoadMore) {
        setReviews(prev => [...prev, ...response.reviews]);
      } else {
        setReviews(response.data);
      }
      
      setHasMore(response.hasNext);
      setLastDocumentId(response.lastDocId);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sort]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (sortOrder) => {
    setSort({
      sortBy: sortOrder,
      sortOrder: 'createdAt'
    });
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteComment = async () => {
    try {
      await deleteReview(commentToDelete);
      setReviews(reviews.filter(review => review.id !== commentToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting review:', error);
      // Có thể thêm thông báo lỗi ở đây nếu cần
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchReviews(true);
    }
  };

  const filteredReviews = reviews?.filter(review => {
    if (!review || !review.author || !review.recipe) return false;
    
    const matchesQuery = 
      review.author.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.recipe.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesQuery;
  }) || [];
  console.log(reviews);
  

  return (
    <div className="adpage-comment-management">
      <div className="adpage-section-header">
        <h1>Comment Management</h1>
      </div>
      
      <div className="adpage-comment-controls">
        {/* <SearchBar placeholder="Search by user or recipe name..." onSearch={handleSearch} /> */}
        
        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${sort.sortBy === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('desc')}
          >
            <ChevronUp size={16} />
            Newest First
          </button>
          <button 
            className={`adpage-sort-btn ${sort.sortBy === 'asc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('asc')}
          >
            <ChevronDown size={16} />
            Oldest First
          </button>
        </div>
      </div>

      <div className="adpage-comments-list">
        {filteredReviews.length > 0 ? (
          <>
            {filteredReviews.map(review => (
              <div key={review.id} className="adpage-comment-item">
                <div className="adpage-comment-content">
                  <div className="adpage-recipe-name">{review.recipe.title}</div>
                  <div className="adpage-user-info">
                    {
                      review.author.photoURL ? (
                        <img 
                          src={review.author.photoURL} 
                          alt={review.author.displayName} 
                          className="adpage-user-avatar" 
                        />
                      ) : (
                        <CircleUser size={40} className="adpage-user-avatar" />
                      )
                    }
                    <span className="adpage-user-name">{review.author.displayName}</span>
                    <span className="adpage-comment-date">
                      {formatTimestampToDateTime(review.createdAt)}
                    </span>
                  </div>
                  <div className="adpage-comment-text">{review.comment}</div>
                </div>
                <div className="adpage-comment-actions">
                  <button 
                    className="adpage-action-btn adpage-delete-btn" 
                    onClick={() => openDeleteModal(review.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="adpage-load-more">
                <button 
                  className="adpage-load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="adpage-no-comments">No comments found</div>
        )}
      </div>

      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal}
        title="Delete Comment"
      >
        <div className="adpage-delete-modal-content">
          <p>Are you sure you want to delete this comment?</p>
          <div className="adpage-modal-actions">
            <button className="adpage-btn adpage-cancel-btn" onClick={closeDeleteModal}>
              Cancel
            </button>
            <button className="adpage-btn adpage-delete-btn-modal" onClick={handleDeleteComment}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommentManagement;