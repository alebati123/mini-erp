import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, Pencil, Check, X } from 'lucide-react';

const Inventory = () => {
  const { data, deleteProductUI, editProductUI, addProductUI } = useAppContext();
  const [activeTab, setActiveTab] = useState('abshine'); // 'abshine' o 'ab3d'
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({ producto: '', tipo: '', precioCompra: 0, precioVenta: 0, stock: 0, marca: 'N/A', material: 'N/A', color: 'N/A' });

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

  const handleAddNewProduct = () => {
    if (!newProductForm.producto) {
        alert("El nombre del producto es obligatorio");
        return;
    }
    const finalProduct = {
        ...newProductForm,
        stock: parseInt(newProductForm.stock) || 0,
        precioCompra: parseFloat(newProductForm.precioCompra) || 0,
        precioVenta: parseFloat(newProductForm.precioVenta) || 0,
    };
    addProductUI(activeTab, finalProduct);
    setIsModalOpen(false);
    setNewProductForm({ producto: '', tipo: '', precioCompra: 0, precioVenta: 0, stock: 0, marca: 'N/A', material: 'N/A', color: 'N/A' });
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
          <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', borderRadius: '8px', marginLeft: '1rem' }} onClick={() => setIsModalOpen(true)}>+ Nuevo Producto</button>
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Añadir a {activeTab === 'abshine' ? 'Abshine' : 'ab3D'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Producto</label>
                <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.producto} onChange={(e) => setNewProductForm({...newProductForm, producto: e.target.value})} placeholder="Nombre del producto" />
              </div>
              
              {activeTab === 'abshine' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Marca</label>
                  <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.marca} onChange={(e) => setNewProductForm({...newProductForm, marca: e.target.value})} />
                </div>
              )}

              {activeTab === 'ab3d' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Material</label>
                    <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.material} onChange={(e) => setNewProductForm({...newProductForm, material: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Color</label>
                    <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.color} onChange={(e) => setNewProductForm({...newProductForm, color: e.target.value})} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Categoría</label>
                    <input type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.tipo} onChange={(e) => setNewProductForm({...newProductForm, tipo: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Stock Inicial</label>
                    <input type="number" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.stock} onChange={(e) => setNewProductForm({...newProductForm, stock: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Precio Compra</label>
                    <input type="number" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.precioCompra} onChange={(e) => setNewProductForm({...newProductForm, precioCompra: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Precio Venta</label>
                    <input type="number" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'white' }} value={newProductForm.precioVenta} onChange={(e) => setNewProductForm({...newProductForm, precioVenta: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1rem' }} onClick={handleAddNewProduct}>Guardar Producto</button>
                <button style={{ flex: 1, padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
