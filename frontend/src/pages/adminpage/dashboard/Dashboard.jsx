import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, FileText, MessageSquare, Award, BookOpen, Users, Eye } from 'lucide-react';
import './Dashboard.css';
import { getAdminDashboardStats } from '../../../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    recipes: {
      total: 0,
      pending: 0,
      mostSaved: null,
      weekly: 0,
      monthly: 0
    },
    users: {
      total: 0,
      banned: 0,
      topContributor: 'No data'
    },
    reviews: {
      total: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError('Failed to fetch dashboard stats');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="adpage-loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="adpage-error">{error}</div>;
  }

  return (
    <div className="adpage-dashboard">
      <div className="adpage-section-header">
        <h1>Dashboard</h1>
      </div>

      <div className="adpage-stats-container">
        <div className="adpage-stats-section">
          <h2 className="adpage-stats-title">
            <FileText size={20} />
            Recipe Statistics
          </h2>
          <div className="adpage-stats-cards">
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-recipes">
                <BookOpen size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Total Recipes</h3>
                <p>{stats.recipes.total}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-pending">
                <FileText size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Pending Approval</h3>
                <p>{stats.recipes.pending}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-popular">
                <Award size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Most Saved Recipe</h3>
                <p>{stats.recipes.mostSaved?.title || 'No data'}</p>
                <div className="adpage-stat-details">
                  <span>Saves: {stats.recipes.mostSaved?.saveCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="adpage-stats-section">
          <h2 className="adpage-stats-title">
            <Users size={20} />
            User Statistics
          </h2>
          <div className="adpage-stats-cards">
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-active">
                <UserCheck size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Total Users</h3>
                <p>{stats.users.total}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-banned">
                <UserX size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Banned Users</h3>
                <p>{stats.users.banned}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-contributor">
                <Award size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Top Contributor</h3>
                <p>{stats.users.topContributor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="adpage-stats-section">
          <h2 className="adpage-stats-title">
            <Eye size={20} />
            Activity Reports
          </h2>
          <div className="adpage-stats-cards">
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-comments">
                <MessageSquare size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Total Reviews</h3>
                <p>{stats.reviews.total}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-posts">
                <FileText size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>New Recipes</h3>
                <div className="adpage-stat-details">
                  <span>This Week: {stats.recipes.weekly}</span>
                  <span>This Month: {stats.recipes.monthly}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;