import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import UserManagement from './usermanagement/UserManagement';
import ContentApproval from './contentapproval/ContentApproval';
import CategoryManagement from './categorymanagement/CategoryManagement';
import Dashboard from './dashboard/Dashboard';
import CommentManagement from './commentmanagement/CommentManagement';
import RecipeManagement from './recipemanagement/RecipeManagement';
import './AdminPage.css';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from "../../services/userService"

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Lấy section active từ URL (ví dụ: /admin/users -> 'users')
  const activeSection = location.pathname.split('/').pop() || 'users';

  const handleSectionChange = (section) => {
    navigate(`/admin/${section}`); // Thay đổi URL khi chuyển section
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        const userProfile = await getUserProfile(currentUser.uid);
        setUserData(userProfile);
      } catch(error) {
        console.error('Error fetch user profile:', error);
        throw error;
      } finally {
        setLoading(false)
      }
    }
    fetchUserProfile();
  }, [])

  if (loading) return <div>Loading....</div>
  else if (userData?.role !== "admin") return <div>You are not admin...</div>

  return (
    <div className="adpage-admin-dashboard">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="adpage-dashboard-content">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentApproval />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="comments" element={<CommentManagement />} />
          <Route path="recipes" element={<RecipeManagement />} />
          <Route path="*" element={<Dashboard />} /> {/* Mặc định */}
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;