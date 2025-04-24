import { useAuth } from "../context/AuthContext";

// Hàm hook để lấy token từ AuthContext
export const useToken = () => {
  const { token } = useAuth();
  return token;
};

// Hàm để lấy token từ localStorage hoặc sessionStorage
export const getToken = () => {
  // Thử lấy từ localStorage trước
  let token = localStorage.getItem("authToken");
  
  // Nếu không có trong localStorage, thử lấy từ sessionStorage
  if (!token) {
    token = sessionStorage.getItem("authToken");
  }
  
  return token;
};

// Hàm để lưu token
export const setToken = (token, rememberMe = false) => {
  removeToken();
  if (rememberMe) {
    localStorage.setItem("authToken", token);
  } else {
    sessionStorage.setItem("authToken", token);
  }
};

// Hàm để xóa token
export const removeToken = () => {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
};