"use client"

import { useState } from "react"
import IconButton from "../../../components/button/IconButton"

const PersonalInfo = ({user}) => {
  const [personalInfo, setPersonalInfo] = useState({
    email: user.email,
    password: "",
    confirmPassword: "",
    currentPassword: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle saving personal info
  }

  return (
    <>
      <h1>Personal Info</h1>
      <p className="ppage-description">
        These details will be used for all the Meredith profiles associated with your email address. By filling out this
        information, you will receive a more personalized experience across all Meredith websites.
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
            <input type="email" value={personalInfo.email} disabled />
            <p className="ppage-email-note">
              *If you'd like to update your email address, please contact <a href="#">Customer Service</a>.
            </p>
          </div>

          <div className="ppage-form-group">
            <label>Current Password</label>
            <input
                type="password"
                value={personalInfo.currentPassword}
                onChange={(e) => setPersonalInfo({ ...personalInfo, currentPassword: e.target.value })}
                placeholder="Enter current password"
            />
          </div>

          <div className="ppage-form-row">
            <div className="ppage-form-group">
              <label>New Password</label>
              <input
                type="password"
                value={personalInfo.password}
                onChange={(e) => setPersonalInfo({ ...personalInfo, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="ppage-form-group">
              <label>Confirm Password</label>
              <input
                type="text"
                value={personalInfo.confirmPassword}
                onChange={(e) => setPersonalInfo({ ...personalInfo, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="ppage-save-section">
        <IconButton variant="primary" className="ppage-save-btn">
          SAVE CHANGES
        </IconButton>
      </div>
    </>
  )
}

export default PersonalInfo
