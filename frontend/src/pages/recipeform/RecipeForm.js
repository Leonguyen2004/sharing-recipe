import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { deleteImage, uploadImage } from '../../services/cloudinaryService';
import { addRecipe, getRecipeById, updateRecipe } from '../../services/recipeService';
import { getAllCategories } from '../../services/categoryService';
import './RecipeForm.css';
import DetailSection from './section/DetailSection';
import DirectionsSection from './section/DirectionsSection';
import IngredientsSection from './section/IngredientsSection';
import IntroSection from './section/IntroSection';
import NoteSection from './section/NoteSection';
import TimeSection from './section/TimeSection';

const RecipeForm = () => {
  const { currentUser, loading } = useProtectedRoute('/home');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // State recipe submit 
  const [recipeTitle, setRecipeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [publicId, setPublicId] = useState("");
  const [ingredients, setIngredients] = useState([
    { id: '1', text: '', isHeader: false },
    { id: '2', text: '', isHeader: false },
    { id: '3', text: '', isHeader: false }
  ]);
  const [directions, setDirections] = useState([
    { id: '1', text: '', isHeader: false },
    { id: '2', text: '', isHeader: false },
    { id: '3', text: '', isHeader: false }
  ]);
  const [categories, setCategories] = useState([]);
  const [servings, setServings] = useState('');
  const [notes, setNotes] = useState([]);
  const [prepTime, setPrepTime] = useState({
    time: 0,
    unit: "mins"
  });
  const [cookTime, setCookTime] = useState({
    time: 0,
    unit: "mins"
  });
  const [totalTime, setTotalTime] = useState(0); //default mins
  const [additionalTimers, setAdditionalTimers] = useState([]);

  // State render
  const [allCategories, setAllCategories] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total time when prep or cook time changes
  useEffect(() => {
    const prepMinutes = prepTime.unit === 'hours' ? prepTime.time * 60 : prepTime.time;
    const cookMinutes = cookTime.unit === 'hours' ? cookTime.time * 60 : cookTime.time;
    
    let additionalMinutes = 0;
    additionalTimers.forEach(timer => {
      additionalMinutes += timer.unit === 'hours' ? timer.time * 60 : timer.time;
    });
    
    setTotalTime(prepMinutes + cookMinutes + additionalMinutes);
  }, [prepTime, cookTime, additionalTimers]);

  // Get all category
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setAllCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchAllCategories();
  }, [])

  // Load recipe data if in edit mode
  useEffect(() => {
    const loadRecipe = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const recipeData = await getRecipeById(id);
          if (recipeData) {
            setRecipeTitle(recipeData.title || '');
            setDescription(recipeData.description || '');
            setPhotoPreview(recipeData.imageUrl || "");
            setPublicId(recipeData.imagePublicId || "");
            setIngredients(recipeData.ingredients || [
              { id: '1', text: '', isHeader: false },
              { id: '2', text: '', isHeader: false },
              { id: '3', text: '', isHeader: false }
            ]);
            setDirections(recipeData.directions || [
              { id: '1', text: '', isHeader: false },
              { id: '2', text: '', isHeader: false },
              { id: '3', text: '', isHeader: false }
            ]);
            setNotes(recipeData.notes || []);
            setServings(recipeData.servings || '');
            
            // Xử lý categories từ ID thành đối tượng category đầy đủ
            if (recipeData.categories && recipeData.categories.length > 0) {
              const categoryObjects = recipeData.categories.map(catId => {
                const category = allCategories.find(c => c.id === catId);
                return category || { id: catId, name: 'Unknown Category' };
              });
              setCategories(categoryObjects);
            } else {
              setCategories([]);
            }
            
            setPrepTime(recipeData.prepTime || {
              time: 0,
              unit: "mins"
            });
            setCookTime(recipeData.cookTime || {
              time: 0,
              unit: "mins"
            });
            setAdditionalTimers(recipeData.additionalTimers || []);
          }
        } catch (error) {
          console.error('Error loading recipe:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadRecipe();
  }, [id, isEditMode, allCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageUrl = "";
      let imagePublicId = "";
      
      // Upload new image if there is one
      if (photo && !photoPreview.startsWith('http')) {
        const { url, publicId: newPublicId } = await uploadImage(photo);
        imageUrl = url;
        imagePublicId = newPublicId;

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
      
      // Extract category IDs from category objects
      const categoryIds = categories.map(category => category.id);
      
      // Create recipe object with all form data
      const recipeData = {
        title: recipeTitle,
        description: description,
        imageUrl: imageUrl,
        imagePublicId: imagePublicId,
        ingredients: ingredients,
        directions: directions,
        servings: servings,
        categories: categoryIds,
        prepTime: prepTime,
        cookTime: cookTime,
        totalTime: totalTime,
        additionalTimers: additionalTimers,
        notes: notes,
      };
      
      if (isEditMode) {
        await updateRecipe(id, recipeData);
        navigate('/admin/recipes');
      } else {
        await addRecipe(recipeData);
        navigate("/home");
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      if (isEditMode) {
        navigate('/admin/recipes');
      } else {
        navigate('/home');
      }
    }
  };

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-form-container">
      <form onSubmit={handleSubmit}>
        <IntroSection
          recipeTitle={recipeTitle}
          setRecipeTitle={setRecipeTitle}
          description={description}
          setDescription={setDescription}
          photo={photo}
          setPhoto={setPhoto}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
        />
        
        <div className="form-divider"></div>
        
        <IngredientsSection
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        
        <div className="form-divider"></div>
        
        <DirectionsSection
          directions={directions}
          setDirections={setDirections}
        />
        
        <div className="form-divider"></div>
        
        <DetailSection
          servings={servings}
          setServings={setServings}
          categories={categories}
          setCategories={setCategories}
          allCategories={allCategories}
        />
        
        <div className="form-divider"></div>
        
        <TimeSection
          prepTime={prepTime}
          setPrepTime={setPrepTime}
          cookTime={cookTime}
          setCookTime={setCookTime}
          totalTime={totalTime}
          additionalTimers={additionalTimers}
          setAdditionalTimers={setAdditionalTimers}
        />
        
        <div className="form-divider"></div>
        
        <NoteSection
          notes={notes}
          setNotes={setNotes}
        />
        
        <div className="form-divider"></div>
        
        <div className="form-disclaimer">
          Allrecipes is all about cooks like you. If you found this recipe in a magazine, cookbook, or on a
          website, we can't publish it.
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            CANCEL
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isEditMode ? 'Update Recipe' : 'Submit Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;