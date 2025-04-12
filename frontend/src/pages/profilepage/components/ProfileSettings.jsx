"use client"

import { useState } from "react"
import IconButton from "../../../components/button/IconButton"
import { UsersRound } from 'lucide-react';

const ProfileSettings = () => {
  const [profileInfo, setProfileInfo] = useState({
    displayName: "",
    description: "",
    profilePhoto: "https://placehold.co/400x400",
    facebook: "",
    instagram: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle saving profile settings
  }

  const handleImageUpload = (e) => {
    // Handle image upload
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileInfo({ ...profileInfo, profilePhoto: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <h1>Profile Settings</h1>
      <p className="ppage-description">
        The information on this page will be displayed on your profile, which is visible to other users.
      </p>

      <div className="ppage-privacy-notice">
        <span className="ppage-user-icon"><UsersRound size={15}/></span>
        <p>The information on this page will be displayed publicly and will be visible to others</p>
      </div>

      <div className="ppage-profile-url">
        <h3>Your Profile URL:</h3>
        {/* navigate /account/userID */}
      </div>

      <div className="ppage-section-card">
        <div className="ppage-section-header">
          <h2>About Me</h2>
        </div>

        <div className="ppage-section-content">
          <div className="ppage-profile-grid">
            <div className="ppage-profile-info">
              <div className="ppage-form-group">
                <label>Display Name*</label>
                <input
                  type="text"
                  value={profileInfo.displayName}
                  onChange={(e) => setProfileInfo({ ...profileInfo, displayName: e.target.value })}
                  placeholder="Your display name"
                />
              </div>

              <div className="ppage-form-group">
                <label>Description</label>
                <textarea
                  value={profileInfo.description}
                  onChange={(e) => setProfileInfo({ ...profileInfo, description: e.target.value })}
                  placeholder="This is you in a nutshell (unless you are allergic to nuts)"
                  className="ppage-tagline-input"
                />
              </div>
            </div>

            <div className="ppage-profile-photo">
              <label>Add an Image</label>
              <div className="ppage-photo-container">
                <img src={profileInfo.profilePhoto || "/placeholder.svg"} alt="Profile" className="ppage-profile-img" />
                <p>Profile Photo</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="ppage-file-input"
                  id="profile-photo-upload"
                />
                <label htmlFor="profile-photo-upload" className="ppage-upload-btn">
                  Choose Image
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ppage-section-card">
        <div className="ppage-section-header">
          <h2>Social Media Accounts</h2>
        </div>

        <div className="ppage-section-content">
          <div className="ppage-social-grid">
            <div className="ppage-form-group">
              <label>Facebook</label>
              <input
                type="text"
                value={profileInfo.facebook}
                onChange={(e) => setProfileInfo({ ...profileInfo, facebook: e.target.value })}
                placeholder="Your Facebook Link"
              />
            </div>

            <div className="ppage-form-group">
              <label>Instagram</label>
              <input
                type="text"
                value={profileInfo.instagram}
                onChange={(e) => setProfileInfo({ ...profileInfo, instagram: e.target.value })}
                placeholder="Your Instagram Link"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ppage-save-section">
        <IconButton variant="primary" className="ppage-save-btn">
          SAVE CHANGES
        </IconButton>
      </div>
    </>
  )
}

export default ProfileSettings
