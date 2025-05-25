// Portal.jsx
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optional: Bạn có thể tạo một div cụ thể để portal vào thay vì document.body
    // const modalRoot = document.getElementById('modal-root');
    // if (!modalRoot) {
    //   const newModalRoot = document.createElement('div');
    //   newModalRoot.setAttribute('id', 'modal-root');
    //   document.body.appendChild(newModalRoot);
    // }
    return () => setMounted(false); // Dọn dẹp khi component unmount
  }, []);

  // Đợi component được mount vào client-side trước khi render portal
  // để tránh lỗi với SSR (Server-Side Rendering)
  if (!mounted) {
    return null;
  }

  // Nếu bạn tạo 'modal-root', thay document.body bằng document.getElementById('modal-root')
  return ReactDOM.createPortal(
    children,
    document.body
  );
};

export default Portal;