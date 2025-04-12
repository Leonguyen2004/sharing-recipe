import React, { useState } from 'react';
import { Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import SearchBar from '../searchbar/Searchbar';
import './ContentApproval.css';

const ContentApproval = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Homemade Pizza Recipe',
      author: 'Jane Smith',
      date: '2023-04-01',
      category: 'Italian',
      excerpt: 'Learn how to make the perfect homemade pizza with this easy recipe...'
    },
    {
      id: 2,
      title: 'Thai Green Curry',
      author: 'Michael Brown',
      date: '2023-04-02',
      category: 'Thai',
      excerpt: 'A fragrant and authentic Thai green curry recipe thats easy to follow...'
    },
    {
      id: 3,
      title: 'Classic French Croissants',
      author: 'Robert Johnson',
      date: '2023-04-03',
      category: 'French',
      excerpt: 'Master the art of making flaky, buttery croissants with this detailed guide...'
    },
    {
      id: 4,
      title: 'Summer Berry Smoothie',
      author: 'Emily Davis',
      date: '2023-04-04',
      category: 'Beverages',
      excerpt: 'A refreshing smoothie packed with summer berries and nutrients...'
    },
    {
      id: 5,
      title: 'Japanese Ramen Noodles',
      author: 'David Wilson',
      date: '2023-04-05',
      category: 'Japanese',
      excerpt: 'Authentic Japanese ramen recipe with homemade broth and toppings...'
    }
  ]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const sortedAndFilteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  const handleApprove = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleReject = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  return (
    <div className="adpage-content-approval">
      <div className="adpage-section-header">
        <h1>Content Approval</h1>
      </div>
      
      <div className="adpage-content-controls">
        <SearchBar placeholder="Search posts..." onSearch={handleSearch} />
        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${sortOrder === 'newest' ? 'adpage-active' : ''}`}
            onClick={() => handleSortChange('newest')}
          >
            <ArrowDown size={16} /> Newest
          </button>
          <button 
            className={`adpage-sort-btn ${sortOrder === 'oldest' ? 'adpage-active' : ''}`}
            onClick={() => handleSortChange('oldest')}
          >
            <ArrowUp size={16} /> Oldest
          </button>
        </div>
      </div>

      <div className="adpage-posts-list">
        {sortedAndFilteredPosts.length === 0 && (
          <div className="adpage-no-posts">No posts found</div>
        )}
        
        {sortedAndFilteredPosts.map(post => (
          <div className="adpage-post-item" key={post.id}>
            <div className="adpage-post-info">
              <h3 className="adpage-post-title">{post.title}</h3>
              <div className="adpage-post-meta">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span className="adpage-category-tag">{post.category}</span>
              </div>
              <p className="adpage-post-excerpt">{post.excerpt}</p>
            </div>
            <div className="adpage-post-actions">
              <button 
                className="adpage-action-btn adpage-approve-btn" 
                onClick={() => handleApprove(post.id)}
                title="Approve"
              >
                <Check size={20} />
              </button>
              <button 
                className="adpage-action-btn adpage-reject-btn" 
                onClick={() => handleReject(post.id)}
                title="Reject"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentApproval;