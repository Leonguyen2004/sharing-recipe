import React, { useState } from 'react';
import { Users, FileText, FolderPlus, ChevronLeft, ChevronRight, Home, BarChart2, MessageSquare, FileCheck } from 'lucide-react';
import './Sidebar.css';
import logo from '../../../assets/icons/logo_small.svg';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`adpage-sidebar ${collapsed ? 'adpage-collapsed' : ''}`}>
      <div className="adpage-sidebar-header">
        <h2 className={collapsed ? 'adpage-hidden' : ''}>
            <img src={logo}/>
        </h2>
        <button className="adpage-collapse-btn" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="adpage-sidebar-menu">
        <button
          className={`adpage-sidebar-item ${activeSection === 'dashboard' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('dashboard')}
        >
          <BarChart2 size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Dashboard</span>
        </button>

        <button
          className={`adpage-sidebar-item ${activeSection === 'users' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('users')}
        >
          <Users size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Users Management</span>
        </button>

        <button
          className={`adpage-sidebar-item ${activeSection === 'content' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('content')}
        >
          <FileCheck size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Content Approval</span>
        </button>

        <button
          className={`adpage-sidebar-item ${activeSection === 'recipes' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('recipes')}
        >
          <FileText size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Recipe Management</span>
        </button>

        <button
          className={`adpage-sidebar-item ${activeSection === 'comments' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('comments')}
        >
          <MessageSquare size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Comment Management</span>
        </button>

        <button
          className={`adpage-sidebar-item ${activeSection === 'categories' ? 'adpage-active' : ''}`}
          onClick={() => onSectionChange('categories')}
        >
          <FolderPlus size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Categories Management</span>
        </button>
      </div>

      <div className="adpage-sidebar-footer">
        <a href="/home" className="adpage-sidebar-item adpage-home-link">
          <Home size={20} />
          <span className={collapsed ? 'adpage-hidden' : ''}>Back to Home</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;