import { createContext, useContext, useState, useEffect } from 'react';
import { getAllCategories } from '../services/categoryService';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}; 

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("fetch cate data");
      
      try {
        const categoriesData = await getAllCategories();
        const simplifiedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          type: category.type,
          imageUrl: category.imageUrl,
        }));
        setCategories(simplifiedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Có thể thêm xử lý lỗi ở đây nếu cần
      } finally {
        setLoading(false); // Đảm bảo luôn tắt trạng thái loading
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};