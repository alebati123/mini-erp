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
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Dashboard />
          <Inventory />
        </div>
        <div style={{ flex: 1, position: 'sticky', top: '2rem', height: 'calc(100vh - 4rem)' }}>
          <AIChat />
        </div>
        <ToastContainer />
      </div>
    </AppProvider>
  );
}

export default App;
