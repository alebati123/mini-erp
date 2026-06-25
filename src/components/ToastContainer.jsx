import React from 'react';
import { useAppContext } from '../context/AppContext';

const ToastContainer = () => {
  const { notifications } = useAppContext();

  return (
    <div className="toast-container">
      {notifications.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
