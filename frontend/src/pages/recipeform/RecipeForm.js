import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DirectionsSection from './section/DirectionsSection';
import IngredientsSection from './section/IngredientsSection';
import DetailSection from './section/DetailSection';
import IntroSection from './section/IntroSection';
import NoteSection from './section/NoteSection';
import TimeSection from './section/TimeSection';
import './RecipeForm.css';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { getRecipeById, addRecipe, updateRecipe, getAllCategories } from '../../services/recipeService';
import { uploadImage } from '../../services/cloudinaryService';

const RecipeForm = () => {
  const { currentUser, loading } = useProtectedRoute('/home');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

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

  const [notes, setNotes] = useState([]);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [servings, setServings] = useState('');
  const [categories, setCategories] = useState([]);
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [prepTimeUnit, setPrepTimeUnit] = useState('mins');
  const [cookTimeUnit, setCookTimeUnit] = useState('mins');
  const [totalTime, setTotalTime] = useState(0);
  const [additionalTimers, setAdditionalTimers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);



  // Calculate total time when prep or cook time changes
  useEffect(() => {
    const prepMinutes = prepTimeUnit === 'hours' ? prepTime * 60 : prepTime;
    const cookMinutes = cookTimeUnit === 'hours' ? cookTime * 60 : cookTime;
    
    let additionalMinutes = 0;
    additionalTimers.forEach(timer => {
      additionalMinutes += timer.unit === 'hours' ? timer.time * 60 : timer.time;
    });
    
    setTotalTime(prepMinutes + cookMinutes + additionalMinutes);
  }, [prepTime, cookTime, prepTimeUnit, cookTimeUnit, additionalTimers]);

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
            setPhotoPreview(recipeData.photoUrl || null);
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
            
            setPrepTime(recipeData.prepTime || 0);
            setCookTime(recipeData.cookTime || 0);
            setPrepTimeUnit(recipeData.prepTimeUnit || 'mins');
            setCookTimeUnit(recipeData.cookTimeUnit || 'mins');
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
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US');
    
    try {
      let photoUrl = photoPreview;
      
      // Upload new image if there is one
      if (photo && !photoPreview.startsWith('http')) {
        photoUrl = await uploadImage(photo);
      }
      
      // Extract category IDs from category objects
      const categoryIds = categories.map(category => category.id);
      
      // Create recipe object with all form data
      const recipeData = {
        title: recipeTitle,
        description: description,
        photoUrl: photoUrl,
        ingredients: ingredients,
        directions: directions,
        servings: servings,
        categories: categoryIds,
        prepTime: prepTime,
        prepTimeUnit: prepTimeUnit,
        cookTime: cookTime,
        cookTimeUnit: cookTimeUnit,
        totalTime: totalTime,
        additionalTimers: additionalTimers,
        notes: notes,
        updatedAt: formattedDate,
        userId: currentUser.uid
      };

      if (!isEditMode) {
        recipeData.createdAt = formattedDate;
      }
      
      if (isEditMode) {
        await updateRecipe(id, recipeData);
      } else {
        await addRecipe(recipeData);
      }
      navigate('/recipe-management');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error saving recipe. Please try again.');
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
        />
        
        <div className="form-divider"></div>
        
        <TimeSection
          prepTime={prepTime}
          setPrepTime={setPrepTime}
          cookTime={cookTime}
          setCookTime={setCookTime}
          prepTimeUnit={prepTimeUnit}
          setPrepTimeUnit={setPrepTimeUnit}
          cookTimeUnit={cookTimeUnit}
          setCookTimeUnit={setCookTimeUnit}
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
          <button type="submit" className="submit-button">
            {isEditMode ? 'Update Recipe' : 'Submit Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;