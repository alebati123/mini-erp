import React from 'react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import AIChat from './components/AIChat';
import ToastContainer from './components/ToastContainer';
import { AppProvider } from './context/AppContext';
import './index.css'; // Aseguramos que los estilos globales estén importados

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <div className="main-content">
          <Dashboard />
          <Inventory />
        </div>
        <div className="sidebar">
          <AIChat />
        </div>
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;
