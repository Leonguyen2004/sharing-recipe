"use client"

import { useContext, useEffect, useState, useRef } from "react"
import IconButton from "../../../components/button/IconButton"
import { UsersRound, X, Upload } from 'lucide-react';
import { Auth, useAuth } from "../../../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../../../services/userService";
import { uploadImage, deleteImage } from "../../../services/cloudinaryService";
import { toast } from "react-toastify";

const URL = process.env.REACT_APP_DOMAIN_URL || "http://localhost:3000";

const ProfileSettings = () => {
  const [profileInfo, setProfileInfo] = useState(null)
  const [tempImageFile, setTempImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfileInfo({
          displayName: userProfile.displayName || "",
          description: userProfile.description || "",
          profilePhoto: userProfile.photoURL || "",
          profilePhotoPublicId: userProfile.photoPublicId || "",
          facebook: userProfile.facebook || "",
          instagram: userProfile.instagram || "",
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let photoURL = profileInfo.profilePhoto;
      let photoPublicId = profileInfo.profilePhotoPublicId;

      // Nếu có ảnh mới được chọn, upload lên Cloudinary
      if (tempImageFile) {
        // Xóa ảnh cũ nếu có
        if (profileInfo.profilePhotoPublicId) {
          try {
            await deleteImage(profileInfo.profilePhotoPublicId);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Vẫn tiếp tục upload ảnh mới
          }
        }

        // Upload ảnh mới
        const { url, publicId } = await uploadImage(tempImageFile);
        photoURL = url;
        photoPublicId = publicId;
      }

      await updateUserProfile(currentUser.uid, {
        displayName: profileInfo.displayName,
        description: profileInfo.description,
        photoURL: photoURL,
        photoPublicId: photoPublicId,
        facebook: profileInfo.facebook,
        instagram: profileInfo.instagram,
      });
      
      // Reset tempImageFile sau khi lưu thành công
      setTempImageFile(null);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setIsSaving(false);
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Tạo URL tạm thời để preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileInfo({
        ...profileInfo,
        profilePhoto: reader.result
      });
      setTempImageFile(file);
    };
    reader.readAsDataURL(file);

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleRemoveImage = () => {
    setProfileInfo({
      ...profileInfo,
      profilePhoto: "",
      profilePhotoPublicId: ""
    });
    setTempImageFile(null);
  }

  if (isLoading) {
    return <div>Đang tải...</div>;
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
        <a href={`${URL}/account/${currentUser.uid}`} className="ppage-link-account">
          <span>{URL}/account/{currentUser.uid}</span>
        </a>
      </div>

      <form onSubmit={handleSubmit}>
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
                    required
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
                <div className="ppage-photo-container" onClick={() => !isSaving && fileInputRef.current?.click()}>
                  {profileInfo.profilePhoto ? (
                    <div className="ppage-image-preview-container">
                      <img src={profileInfo.profilePhoto} alt="Profile" className="ppage-profile-img" />
                    </div>
                  ) : (
                    <div 
                      className="ppage-image-upload-placeholder" 
                      
                    >
                      <Upload size={24} />
                      <span>Upload Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="ppage-file-input"
                    disabled={isSaving}
                  />
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
          <IconButton 
            variant="primary" 
            className="ppage-save-btn"
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
          </IconButton>
        </div>
      </form>
    </>
  )
}

export default ProfileSettings
