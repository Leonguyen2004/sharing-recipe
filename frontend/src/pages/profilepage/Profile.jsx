"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { getUserProfile } from "../../services/userService"
import "./Profile.css"
import PersonalInfo from "./components/PersonalInfo"
import PersonalRecipes from "./components/PersonalRecipes"
import ProfileSettings from "./components/ProfileSettings"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal-info")
  const [userData, setUserData] = useState([]);
  const { currentUser } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfo user={currentUser}/>
      case "profile-settings":
        return <ProfileSettings user={currentUser}/>
      case "personal-recipes":
        return <PersonalRecipes user={currentUser}/>
      default:
        return <PersonalInfo user={currentUser}/>
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setUserData(userProfile);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserProfile();
  }, [])

  return (
    <div className="ppage-container">
      <div className="ppage-layout">
        <div className="ppage-sidebar">
          <div className="ppage-user-info">
            <div className="ppage-avatar">
              <img src={userData.photoURL} alt="User avatar" />
            </div>
            <div className="ppage-user-details">
              <h2>Hi, {userData.email}</h2>
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