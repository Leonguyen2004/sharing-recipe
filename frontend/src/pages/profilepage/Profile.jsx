import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Profile.css';
import IconButton from '../../components/button/IconButton';

const Profile = () => {
  const location = useLocation();
  const [personalInfo, setPersonalInfo] = useState({
    email: 'darkgodwind@gmail.com',
    firstName: '',
    lastName: '',
    birthDate: {
      month: '',
      day: '',
      year: ''
    },
    zipCode: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý lưu thông tin cá nhân
  };

  return (
    <div className="ppage-container">
      <div className="ppage-layout">
        <div className="ppage-sidebar">
          <div className="ppage-user-info">
            <div className="ppage-avatar">
              <img src="https://placehold.co/400x400" alt="User avatar" />
            </div>
            <div className="ppage-user-details">
              <h2>Hi, {personalInfo.email}</h2>
            </div>
          </div>
          <nav className="ppage-nav">
            <ul>
              <li className={`ppage-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                <Link to="/profile">
                  <span>Personal Info</span>
                </Link>
              </li>
              <li className={`ppage-nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
                <Link to="/favorites">
                  <span>Saved Recipes & Collections</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="ppage-content">
          <h1>Personal Info</h1>
          <p className="ppage-description">
            These details will be used for all the Meredith profiles associated with your email address. 
            By filling out this information, you will receive a more personalized experience across all Meredith websites.
          </p>

          <div className="ppage-privacy-notice">
            <span className="ppage-lock-icon">🔒</span>
            <p>Only you can see the information on this page. It will not be displayed for other users to see.</p>
          </div>

          <div className="ppage-basic-info">
            <div className="ppage-section-header">
              <h2>My Basic Info</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ppage-form-group">
                <label>Email Address*</label>
                <input 
                  type="email" 
                  value={personalInfo.email} 
                  disabled 
                />
                <p className="ppage-email-note">*If you'd like to update your email address, please contact <a href="#">Customer Service</a>.</p>
              </div>

              <div className="ppage-form-row">
                <div className="ppage-form-group">
                  <label>First Name</label>
                  <input 
                    type="text"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  />
                </div>
                <div className="ppage-form-group">
                  <label>Last Name</label>
                  <input 
                    type="text"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="ppage-form-row">
                <div className="ppage-form-group">
                  <label>Birth Date</label>
                  <div className="ppage-date-inputs">
                    <input 
                      type="text" 
                      placeholder="MM"
                      maxLength="2"
                      value={personalInfo.birthDate.month}
                      onChange={(e) => setPersonalInfo({
                        ...personalInfo, 
                        birthDate: {...personalInfo.birthDate, month: e.target.value}
                      })}
                    />
                    <span>/</span>
                    <input 
                      type="text" 
                      placeholder="DD"
                      maxLength="2"
                      value={personalInfo.birthDate.day}
                      onChange={(e) => setPersonalInfo({
                        ...personalInfo, 
                        birthDate: {...personalInfo.birthDate, day: e.target.value}
                      })}
                    />
                    <span>/</span>
                    <input 
                      type="text" 
                      placeholder="YYYY"
                      maxLength="4"
                      value={personalInfo.birthDate.year}
                      onChange={(e) => setPersonalInfo({
                        ...personalInfo, 
                        birthDate: {...personalInfo.birthDate, year: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="ppage-form-group">
                  <label>ZIP Code</label>
                  <input 
                    type="text"
                    placeholder="ZIP Code"
                    value={personalInfo.zipCode}
                    onChange={(e) => setPersonalInfo({...personalInfo, zipCode: e.target.value})}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="ppage-save-section">
            <IconButton variant='primary' className="ppage-save-btn">SAVE CHANGES</IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 