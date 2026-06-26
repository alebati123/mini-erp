import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Pencil, Check, X } from 'lucide-react';

const Inventory = () => {
  const { data, deleteProductUI, editProductUI } = useAppContext();
  const [activeTab, setActiveTab] = useState('abshine'); // 'abshine' o 'ab3d'
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveEdit = () => {
    const updatedItem = {
      ...editFormData,
      stock: parseInt(editFormData.stock) || 0,
      precioCompra: parseFloat(editFormData.precioCompra) || 0,
      precioVenta: parseFloat(editFormData.precioVenta) || 0,
    };
    editProductUI(activeTab, updatedItem);
    setEditingId(null);
  };

  const handleFormChange = (field, value) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const inventoryData = activeTab === 'abshine' ? data.abshine.inventory : data.ab3d.inventory;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  return (
    <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Inventario</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              {activeTab === 'abshine' && <th>Marca</th>}
              {activeTab === 'ab3d' && <th>Material</th>}
              {activeTab === 'ab3d' && <th>Color</th>}
              <th>Categoría</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item.id}>
                {editingId === item.id ? (
                  <>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                    <td><input type="text" value={editFormData.producto} onChange={(e) => handleFormChange('producto', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '150px' }} /></td>
                    {activeTab === 'abshine' && <td><input type="text" value={editFormData.marca} onChange={(e) => handleFormChange('marca', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '80px' }} /></td>}
                    {activeTab === 'ab3d' && <td><input type="text" value={editFormData.material} onChange={(e) => handleFormChange('material', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '80px' }} /></td>}
                    {activeTab === 'ab3d' && <td><input type="text" value={editFormData.color} onChange={(e) => handleFormChange('color', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '80px' }} /></td>}
                    <td><input type="text" value={editFormData.tipo} onChange={(e) => handleFormChange('tipo', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '100px' }} /></td>
                    <td><input type="number" value={editFormData.precioCompra} onChange={(e) => handleFormChange('precioCompra', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '80px' }} /></td>
                    <td><input type="number" value={editFormData.precioVenta} onChange={(e) => handleFormChange('precioVenta', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '80px' }} /></td>
                    <td><input type="number" value={editFormData.stock} onChange={(e) => handleFormChange('stock', e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', width: '100%', minWidth: '60px' }} /></td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button onClick={handleSaveEdit} style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(0, 230, 118, 0.3)' }} title="Guardar"><Check size={18} color="var(--success)" /></button>
                        <button onClick={handleCancelEdit} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }} title="Cancelar"><X size={18} color="white" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{item.producto}</td>
                    {activeTab === 'abshine' && <td>{item.marca}</td>}
                    {activeTab === 'ab3d' && <td>{item.material}</td>}
                    {activeTab === 'ab3d' && <td>{item.color}</td>}
                    <td>{item.tipo}</td>
                    <td>{formatCurrency(item.precioCompra)}</td>
                    <td>{formatCurrency(item.precioVenta)}</td>
                    <td>
                      <span className={`stock-badge ${item.stock > 15 ? 'high' : 'low'}`}>
                        {item.stock} u.
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button onClick={() => handleEditClick(item)} style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }} title="Editar producto"><Pencil size={18} color="white" /></button>
                        <button onClick={() => deleteProductUI(activeTab, item.id)} style={{ background: 'rgba(255, 23, 68, 0.1)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255, 23, 68, 0.3)' }} title="Eliminar producto"><Trash2 size={18} color="var(--danger)" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
