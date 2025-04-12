import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';
import UserManagement from './usermanagement/UserManagement';
import ContentApproval from './contentapproval/ContentApproval';
import CategoryManagement from './categorymanagement/CategoryManagement';
import Dashboard from './dashboard/Dashboard';
import CommentManagement from './commentmanagement/CommentManagement';
import RecipeManagement from './recipemanagement/RecipeManagement';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy section active từ URL (ví dụ: /admin/users -> 'users')
  const activeSection = location.pathname.split('/').pop() || 'users';

  const handleSectionChange = (section) => {
    navigate(`/admin/${section}`); // Thay đổi URL khi chuyển section
  };

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