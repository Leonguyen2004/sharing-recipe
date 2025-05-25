import { Ban, BookOpen, CheckCircle, Clock, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserBanStatus } from '../../../services/userService';
import Modal from '../modal/Modal';
import SearchBar from '../searchbar/Searchbar';
import './UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showBanUsers, setShowBanUsers] = useState(false);

  const fetchMoreUsers = async () => {
    try {
      const params = {
        searchTerm,
        limit: "2",
        sortBy: "createdAt",
        sortOrder: "desc",
        banned: showBanUsers
      }
      if (pagination.hasNext) {
        params.lastDocumentId = pagination.lastDocumentId
      }
      if (selectedFilters.sortBy) {
        params.sortBy = selectedFilters.sortBy
      }
      if (selectedFilters.sortOrder) {
        params.sortOrder = selectedFilters.sortOrder
      }
      const response = await getAllUsers(params);
      setUsers(prev => [...prev, ...response.data]);
      setPagination(response.pagination)
    } catch(error) {
      console.log("error fetch search data", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch all recipes
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("fectch data");
      
      try {
        const params = {
          searchTerm,
          limit: "2",
          sortBy: "createdAt",
          sortOrder: "desc",
          banned: showBanUsers
        }
        if (selectedFilters.sortBy) {
          params.sortBy = selectedFilters.sortBy
        }
        if (selectedFilters.sortOrder) {
          params.sortOrder = selectedFilters.sortOrder
        }
        const response = await getAllUsers(params);
        setUsers(response.data);
        setPagination(response.pagination)
      } catch(error) {
        console.log("error fetch search data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [selectedFilters, debouncedSearchTerm, showBanUsers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Chờ 500ms sau khi người dùng ngừng gõ

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (sortBy, sortOrder) => {
    setSelectedFilters({
      sortBy,
      sortOrder
    })
  };

  const handleBanClick = (user) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleUpdateBanStatus = async () => {
    try {
      setLoading(true)
      const response = await updateUserBanStatus(selectedUser.id, !selectedUser.banned);
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, banned: !user.banned } : user
      ));
      setShowBanModal(false);
    } catch (error) {
      console.error('Error updating user ban status:', error);
    } finally {
      setLoading(false)
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/account/${userId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-management">
      <div className="section-header">
        <h1>Users Management</h1>
      </div>
      
      <div className="adpage-search-controls">
        <SearchBar placeholder="Search users..." onSearch={handleSearch} />

        <div className="adpage-sort-controls">
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'createdAt' && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('createdAt', 'desc')}
          >
            <Clock size={16} />
            Newest
          </button>
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'createdAt' && selectedFilters.sortOrder === 'asc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('createdAt', 'asc')}
          >
            <Clock size={16} />
            Oldest
          </button>
          <button 
            className={`adpage-sort-btn ${selectedFilters.sortBy === 'recipeCount' && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => handleSort('recipeCount', 'desc')}
          >
            <BookOpen size={16} />
            Most Recipes
          </button>
          <button 
            className={`adpage-sort-btn ${showBanUsers === true && selectedFilters.sortOrder === 'desc' ? 'adpage-active' : ''}`} 
            onClick={() => setShowBanUsers(!showBanUsers)}
          >
            <BookOpen size={16} />
            Banned Users
          </button>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Recipe</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={user.banned ? 'banned-user' : ''}>
                <td>{user.id}</td>
                <td>{user.displayName || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.recipeCount || 0}</td>
                <td>
                  <span className={`status-badge ${user.banned ? 'banned' : 'active'}`}>
                    {user.banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn" 
                      title="View Profile"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className={`action-btn ${user.banned ? 'unban-btn' : 'ban-btn'}`}
                      onClick={() => handleBanClick(user)}
                      title={user.banned ? 'Unban User' : 'Ban User'}
                    >
                      {user.banned ? <CheckCircle size={18} /> : <Ban size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.hasNext && (
        <div className='adpage-loadmore-container'>
          <button className='adpage-loadmore-button' onClick={fetchMoreUsers}>
            Load More
          </button>
        </div>
      )}

      <Modal 
        isOpen={showBanModal} 
        onClose={() => setShowBanModal(false)} 
        title={selectedUser?.banned ? "Unban User" : "Ban User"}
      >
        <div className="ban-modal-content">
          <p>
            {selectedUser?.banned 
              ? `Are you sure you want to unban ${selectedUser?.displayName || 'this user'}?` 
              : `Are you sure you want to ban ${selectedUser?.displayName || 'this user'}?`}
          </p>
          <div className="modal-actions">
            <button className="btn cancel-btn" onClick={() => setShowBanModal(false)}>
              Cancel
            </button>
            <button 
              className={`btn ${selectedUser?.banned ? 'confirm-btn' : 'ban-btn'}`} 
              onClick={handleUpdateBanStatus}
            >
              {selectedUser?.banned ? 'Unban' : 'Ban'} User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;