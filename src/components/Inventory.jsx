import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Inventory = () => {
  const { data } = useAppContext();
  const [activeTab, setActiveTab] = useState('abshine'); // 'abshine' o 'ab3d'

  const inventoryData = activeTab === 'abshine' ? data.abshine.inventory : data.ab3d.inventory;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Inventario</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn-tab ${activeTab === 'abshine' ? 'active abshine' : ''}`}
            onClick={() => setActiveTab('abshine')}
          >
            <span className={activeTab === 'abshine' ? 'text-gradient-abshine' : ''} style={{ fontWeight: 'bold' }}>
              Abshine
            </span>
          </button>
          <button 
            className={`btn-tab ${activeTab === 'ab3d' ? 'active ab3d' : ''}`}
            onClick={() => setActiveTab('ab3d')}
          >
            <span className={activeTab === 'ab3d' ? 'text-gradient-ab3d' : ''} style={{ fontWeight: 'bold' }}>
              ab3D.impresiones
            </span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              {activeTab === 'abshine' && <th>Marca</th>}
              {activeTab === 'ab3d' && <th>Material</th>}
              {activeTab === 'ab3d' && <th>Color</th>}
              <th>Tipo</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.id}>
                <td style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                <td style={{ fontWeight: 500 }}>{item.producto}</td>
                {activeTab === 'abshine' && <td>{item.marca}</td>}
                {activeTab === 'ab3d' && <td>{item.material}</td>}
                {activeTab === 'ab3d' && <td>{item.color}</td>}
                <td>{item.tipo}</td>
                <td>{formatCurrency(item.precio)}</td>
                <td>
                  <span className={`stock-badge ${item.stock > 15 ? 'high' : 'low'}`}>
                    {item.stock} u.
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
