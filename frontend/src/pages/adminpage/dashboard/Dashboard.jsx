import React from 'react';
import { UserCheck, UserX, FileText, MessageSquare, Award, BookOpen, Users, Eye } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  // Mock data - would be replaced with real API calls in production
  const stats = {
    recipes: {
      total: 2356,
      pending: 78,
      popular: {
        name: "Italian Pasta",
        rating: 4.9,
        saves: 845
      }
    },
    users: {
      active: 1267,
      banned: 43,
      topContributor: {
        name: "Jamie Oliver",
        recipes: 37
      }
    },
    activity: {
      visits: 12589,
      weeklyPosts: 87,
      monthlyPosts: 342,
      comments: 1245
    }
  };

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
                <h3>Most Popular Recipe</h3>
                <p>{stats.recipes.popular.name}</p>
                <div className="adpage-stat-details">
                  <span>Rating: {stats.recipes.popular.rating}</span>
                  <span>Saves: {stats.recipes.popular.saves}</span>
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
                <h3>Active Users</h3>
                <p>{stats.users.active}</p>
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
                <p>{stats.users.topContributor.name}</p>
                <div className="adpage-stat-details">
                  <span>Recipes: {stats.users.topContributor.recipes}</span>
                </div>
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
              <div className="adpage-stat-icon adpage-icon-visits">
                <Eye size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Page Visits</h3>
                <p>{stats.activity.visits}</p>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-posts">
                <FileText size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>New Recipes</h3>
                <div className="adpage-stat-details">
                  <span>This Week: {stats.activity.weeklyPosts}</span>
                  <span>This Month: {stats.activity.monthlyPosts}</span>
                </div>
              </div>
            </div>
            <div className="adpage-stat-card">
              <div className="adpage-stat-icon adpage-icon-comments">
                <MessageSquare size={24} />
              </div>
              <div className="adpage-stat-info">
                <h3>Comments</h3>
                <p>{stats.activity.comments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;