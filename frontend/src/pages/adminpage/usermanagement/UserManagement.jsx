import { Ban, CheckCircle, Eye } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
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
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={user.banned ? 'banned-user' : ''}>
                <td>{user.id}</td>
                <td>{user.displayName || 'N/A'}</td>
                <td>{user.email}</td>
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