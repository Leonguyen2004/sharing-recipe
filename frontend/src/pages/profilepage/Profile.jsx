"use client"

import { useState } from "react"
import "./Profile.css"
import PersonalInfo from "./components/PersonalInfo"
import ProfileSettings from "./components/ProfileSettings"
import SavedRecipes from "./components/SavedRecipes"
import PersonalRecipes from "./components/PersonalRecipes"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal-info")
  const [userEmail, setUserEmail] = useState("darkgodwind@gmail.com")

  const renderContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfo />
      case "profile-settings":
        return <ProfileSettings />
      case "saved-recipes":
        return <SavedRecipes />
      case "personal-recipes":
        return <PersonalRecipes />
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="ppage-container">
      <div className="ppage-layout">
        <div className="ppage-sidebar">
          <div className="ppage-user-info">
            <div className="ppage-avatar">
              <img src="https://placehold.co/400x400" alt="User avatar" />
            </div>
            <div className="ppage-user-details">
              <h2>Hi, {userEmail}</h2>
            </div>
          </div>
          <nav className="ppage-nav">
            <ul>
              <li
                className={`ppage-nav-item ${activeTab === "personal-info" ? "active" : ""}`}
                onClick={() => setActiveTab("personal-info")}
              >
                <span>Personal Info</span>
              </li>
              <li
                className={`ppage-nav-item ${activeTab === "profile-settings" ? "active" : ""}`}
                onClick={() => setActiveTab("profile-settings")}
              >
                <span>Profile Settings</span>
              </li>
              <li
                className={`ppage-nav-item ${activeTab === "saved-recipes" ? "active" : ""}`}
                onClick={() => setActiveTab("saved-recipes")}
              >
                <span>Saved Recipes & Collections</span>
              </li>
              <li
                className={`ppage-nav-item ${activeTab === "personal-recipes" ? "active" : ""}`}
                onClick={() => setActiveTab("personal-recipes")}
              >
                <span>Personal Recipes</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="ppage-content">{renderContent()}</div>
      </div>
    </div>
  )
}

export default Profile