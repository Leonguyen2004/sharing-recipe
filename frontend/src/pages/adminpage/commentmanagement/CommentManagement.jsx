import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import SearchBar from '../searchbar/Searchbar';
import Modal from '../modal/Modal';
import './CommentManagement.css';

const CommentManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Mock data
  const initialComments = [
    {
      id: 1,
      recipeId: 101,
      recipeName: 'Homemade Pizza',
      user: {
        id: 201,
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      text: 'This recipe is amazing! I made it for my family and they loved it. Will definitely make it again.',
      date: new Date('2023-04-05')
    },
    {
      id: 2,
      recipeId: 102,
      recipeName: 'Chocolate Cake',
      user: {
        id: 202,
        name: 'Jane Smith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      text: 'The cake turned out to be too sweet for my taste, but everyone else enjoyed it.',
      date: new Date('2023-04-01')
    },
    {
      id: 3,
      recipeId: 103,
      recipeName: 'Chicken Curry',
      user: {
        id: 203,
        name: 'Michael Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
      },
      text: 'Great recipe but I recommend adding more spices if you like it hot!',
      date: new Date('2023-04-10')
    },
    {
      id: 4,
      recipeId: 101,
      recipeName: 'Homemade Pizza',
      user: {
        id: 204,
        name: 'Emily Davis',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
      },
      text: 'Perfect crust recipe. I added some garlic to the dough and it was delicious.',
      date: new Date('2023-03-28')
    },
    {
      id: 5,
      recipeId: 104,
      recipeName: 'Vegetable Stir Fry',
      user: {
        id: 205,
        name: 'Robert Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
      },
      text: 'Quick and healthy! I added some tofu for extra protein.',
      date: new Date('2023-04-08')
    }
  ];

  const [comments, setComments] = useState(initialComments);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
  };

  const openDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteComment = () => {
    setComments(comments.filter(comment => comment.id !== commentToDelete.id));
    closeDeleteModal();
  };

  const filteredComments = comments.filter(comment => {
    const matchesQuery = 
      comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesQuery;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.date - a.date;
    } else if (sortBy === 'oldest') {
      return a.date - b.date;
    }
    return 0;
  });

  return (
    <div className="adpage-comment-management">
      <div className="adpage-section-header">
        <h1>Comment Management</h1>
      </div>
      
      <div className="adpage-comment-controls">
        <SearchBar placeholder="Search by user or recipe name..." onSearch={handleSearch} />
        
        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${sortBy === 'newest' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('newest')}
          >
            <ChevronUp size={16} />
            Newest First
          </button>
          <button 
            className={`adpage-sort-btn ${sortBy === 'oldest' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('oldest')}
          >
            <ChevronDown size={16} />
            Oldest First
          </button>
        </div>
      </div>

      <div className="adpage-comments-list">
        {sortedComments.length > 0 ? (
          sortedComments.map(comment => (
            <div key={comment.id} className="adpage-comment-item">
              <div className="adpage-comment-content">
                <div className="adpage-recipe-name">{comment.recipeName}</div>
                <div className="adpage-user-info">
                  <img src={comment.user.avatar} alt={comment.user.name} className="adpage-user-avatar" />
                  <span className="adpage-user-name">{comment.user.name}</span>
                  <span className="adpage-comment-date">
                    {comment.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="adpage-comment-text">{comment.text}</div>
              </div>
              <div className="adpage-comment-actions">
                <button 
                  className="adpage-action-btn adpage-delete-btn" 
                  onClick={() => openDeleteModal(comment)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
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