"use client"

import { useState, useRef, useEffect } from "react"
import { Edit, Trash2, Plus, Upload, X } from "lucide-react"
import SearchBar from "../searchbar/Searchbar"
import Modal from "../modal/Modal"
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../../services/categoryService';
import { uploadImage, deleteImage } from '../../../services/cloudinaryService';
import './CategoryManagement.css';

// Define high-level category types
const categoryTypes = ["meals", "cuisines", "ingredients", "diet", "cookingMethod", "occasions"]

export default function CategoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryType, setNewCategoryType] = useState(categoryTypes[0])
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  const [publicId, setPublicId] = useState("")
  const [isAdding, setIsAdding] = useState(false);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories by search term and selected type
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || category.type === selectedType
    return matchesSearch && matchesType
  })

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleTypeFilter = (type) => {
    setSelectedType(type)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview("")
    setImageFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setNewCategoryName("")
    setNewCategoryType(categoryTypes[0])
    setImagePreview("")
    setImageFile(null)
    setPublicId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddCategory = async () => {
    if (isAdding) return; // Nếu đang thêm thì bỏ qua
    setIsAdding(true);
  
    try {
      if (!imageFile) {
        alert('Vui lòng chọn ảnh cho danh mục.');
        return;
      }
  
      let imageUrl = "";
      let imagePublicId = "";
  
      const { url, publicId } = await uploadImage(imageFile);
      imageUrl = url;
      imagePublicId = publicId;
  
      const newCategory = {
        name: newCategoryName,
        type: newCategoryType,
        imageUrl,
        imagePublicId,
      };
  
      await addCategory(newCategory);
  
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try lại.');
    } finally {
      setIsAdding(false);
    }
  };  

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category)
    setNewCategoryName(category.name)
    setNewCategoryType(category.type)
    setImagePreview(category.imageUrl)
    setPublicId(category.imagePublicId)
    setShowEditModal(true)
  }

  const handleEditCategory = async () => {
    if (isAdding) return; // Nếu đang thêm thì bỏ qua
    setIsAdding(true);
    try {
      let imageUrl = imagePreview;
      let imagePublicId = publicId;
  
      // Upload new image if there is one
      if (imageFile && !imagePreview.startsWith('http')) {
        const { url, publicId: newPublicId } = await uploadImage(imageFile); // ✅ lấy đúng url
        imageUrl = url;
        imagePublicId = newPublicId;
        // Delete old image if publicId exists
        if (publicId !== "") {
          try {
            await deleteImage(publicId);
            console.log('Old image deleted:', publicId);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError.message);
            // Vẫn tiếp tục thực hiện xoá danh mục
          }
        }       
      }
      
      const updatedCategory = {
        name: newCategoryName,
        type: newCategoryType,
        imageUrl: imageUrl,
        imagePublicId: imagePublicId,
      };

      await updateCategory(selectedCategory.id, updatedCategory);

      setCategories(categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, ...updatedCategory }
          : category
      ));      
      
      // Update category logic here
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenDeleteModal = (category) => {
    setSelectedCategory(category)
    setPublicId(category.imagePublicId);
    setShowDeleteModal(true)
  }

  const handleDeleteCategory = async () => {
    if (isAdding) return; // Nếu đang xoá thì bỏ qua
    setIsAdding(true);
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory.id);
        setCategories(categories.filter(category => category.id !== selectedCategory.id));

        if (publicId !== "") {
          try {
            await deleteImage(publicId);
            console.log('Old image deleted:', publicId);
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError.message);
            // Vẫn tiếp tục thực hiện xoá danh mục
          }
        }      

        setShowDeleteModal(false);
        resetForm();
      } catch (error) {
        console.error('Error deleting category:', error);
        // Here you might want to show an error message to the user
      } finally {
        setIsAdding(false);
      }
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  // Capitalize first letter of each word
  const formatCategoryType = (type) => {
    return type
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="adpage-category-management">
      <div className="adpage-section-header">
        <h1>Categories Management</h1>
      </div>

      <div className="adpage-header-actions">
        <SearchBar placeholder="Search categories..." onSearch={handleSearch} />
        <button className="adpage-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="adpage-category-types-filter">
        <button
          className={`adpage-type-filter-btn ${selectedType === "all" ? "active" : ""}`}
          onClick={() => handleTypeFilter("all")}
        >
          All
        </button>
        {categoryTypes.map((type) => (
          <button
            key={type}
            className={`adpage-type-filter-btn ${selectedType === type ? "active" : ""}`}
            onClick={() => handleTypeFilter(type)}
          >
            {formatCategoryType(type)}
          </button>
        ))}
      </div>

      <div className="adpage-categories-grid">
        {filteredCategories.map((category) => (
          <div key={category.id} className="adpage-category-card">
            <div className="adpage-category-image-container">
              <img src={category.imageUrl || "/placeholder.svg"} alt={category.name} className="adpage-category-image" />
              <div className="adpage-category-type-badge">{formatCategoryType(category.type)}</div>
            </div>
            <div className="adpage-category-details">
              <div className="adpage-category-info">
                <h3 className="adpage-category-name">{category.name}</h3>
              </div>
              <div className="adpage-action-buttons">
                <button
                  className="adpage-action-btn adpage-edit-btn"
                  onClick={() => handleOpenEditModal(category)}
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  className="adpage-action-btn adpage-delete-btn"
                  onClick={() => handleOpenDeleteModal(category)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && <div className="adpage-no-categories">No categories found</div>}
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Category">
        <div className="adpage-category-modal-content">
          <div className="adpage-form-group">
            <label htmlFor="category-name">Category Name</label>
            <input
              type="text"
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>

          <div className="adpage-form-group">
            <label htmlFor="category-type">Category Type</label>
            <select
              id="category-type"
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
              className="adpage-select"
            >
              {categoryTypes.map((type) => (
                <option key={type} value={type}>
                  {formatCategoryType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="adpage-form-group">
            <label>Category Image (16:9)</label>
            <div className="adpage-image-upload-container">
              {imagePreview ? (
                <div className="adpage-image-preview-container">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="adpage-image-preview" />
                  <button className="adpage-remove-image-btn" onClick={handleRemoveImage} title="Remove image">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="adpage-image-upload-placeholder" onClick={() => fileInputRef.current.click()}>
                  <Upload size={24} />
                  <span>Upload Image (16:9)</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="adpage-file-input"
              />
            </div>
          </div>

          <div className="adpage-modal-actions">
            <button className="adpage-btn adpage-cancel-btn" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button
              className="adpage-btn adpage-add-btn"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isAdding}
            >
              {isAdding ? 'Adding' : 'Add'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Category">
        <div className="adpage-category-modal-content">
          <div className="adpage-form-group">
            <label htmlFor="edit-category-name">Category Name</label>
            <input
              type="text"
              id="edit-category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>

          <div className="adpage-form-group">
            <label htmlFor="edit-category-type">Category Type</label>
            <select
              id="edit-category-type"
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value)}
              className="adpage-select"
            >
              {categoryTypes.map((type) => (
                <option key={type} value={type}>
                  {formatCategoryType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="adpage-form-group">
            <label>Category Image (16:9)</label>
            <div className="adpage-image-upload-container">
              {imagePreview ? (
                <div className="adpage-image-preview-container">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="adpage-image-preview" />
                  <button className="adpage-remove-image-btn" onClick={handleRemoveImage} title="Remove image">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="adpage-image-upload-placeholder" onClick={() => fileInputRef.current.click()}>
                  <Upload size={24} />
                  <span>Upload Image (16:9)</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="adpage-file-input"
              />
            </div>
          </div>

          <div className="adpage-modal-actions">
            <button className="adpage-btn adpage-cancel-btn" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button
              className="adpage-btn adpage-add-btn"
              onClick={handleEditCategory}
              disabled={!newCategoryName.trim() || isAdding}
            >
              {isAdding ? "Saving" : "Save" }
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Category Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Category">
        <div className="adpage-category-modal-content">
          <p>Are you sure you want to delete category "{selectedCategory?.name}"? This action cannot be undone.</p>
          <div className="adpage-modal-actions">
            <button className="adpage-btn adpage-cancel-btn" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="adpage-btn adpage-delete-btn" onClick={handleDeleteCategory} disabled={isAdding}>
              {isAdding ? "Deleting" : "Delete" }
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
