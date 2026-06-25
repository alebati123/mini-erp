import React, { createContext, useState, useContext } from 'react';
import { initialDatabase } from '../data/mockDatabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(initialDatabase);
  const [notifications, setNotifications] = useState([]);

  // Función para agregar notificaciones tipo Toast
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000); // 4 segundos de duración
  };

  /**
   * Actualiza el inventario simulado y los balances basados en el JSON de la IA.
   * @param {string} operation "compra" o "venta"
   * @param {string} negocio "Abshine" o "ab3D.impresiones"
   * @param {string} producto Nombre del producto aproximado
   * @param {number} cantidad Cantidad de unidades
   * @param {number} precio Precio opcional de la operación (total o unitario, aquí asumimos unitario si se envía)
   */
  const updateInventoryAndBalance = (operation, negocio, producto, cantidad, precio) => {
    setData(prevData => {
      const newData = { ...prevData };
      const unitKey = negocio.toLowerCase().includes('abshine') ? 'abshine' : 'ab3d';
      
      // Buscar el producto en el inventario por coincidencia parcial de texto
      const itemIndex = newData[unitKey].inventory.findIndex(item => 
        item.producto.toLowerCase().includes(producto.toLowerCase()) || 
        producto.toLowerCase().includes(item.producto.toLowerCase())
      );
      
      let amountChange = 0;
      
      if (itemIndex !== -1) {
        // Producto encontrado
        const currentItem = newData[unitKey].inventory[itemIndex];
        const unitPrice = precio || currentItem.precio;
        
        if (operation === 'venta') {
          newData[unitKey].inventory[itemIndex].stock -= cantidad;
          amountChange = unitPrice * cantidad;
          newData.balances.ingresos += amountChange;
          newData.balances.balanceTotal += amountChange;
        } else if (operation === 'compra') {
          newData[unitKey].inventory[itemIndex].stock += cantidad;
          amountChange = unitPrice * cantidad;
          newData.balances.egresos += amountChange;
          newData.balances.balanceTotal -= amountChange;
        }
      } else {
        // Producto no encontrado, creamos uno temporal simulado (solo para el mock)
        const newItem = {
          id: `${unitKey.toUpperCase()}-NEW-${Date.now().toString().slice(-4)}`,
          producto,
          stock: operation === 'compra' ? cantidad : -cantidad,
          precio: precio || 0,
          marca: 'N/A', tipo: 'Nuevo', volumen: 'N/A', material: 'N/A', color: 'N/A'
        };
        newData[unitKey].inventory.push(newItem);
        
        if(operation === 'venta' && precio) {
          newData.balances.ingresos += (precio * cantidad);
          newData.balances.balanceTotal += (precio * cantidad);
        } else if(operation === 'compra' && precio) {
           newData.balances.egresos += (precio * cantidad);
           newData.balances.balanceTotal -= (precio * cantidad);
        }
      }

      return newData;
    });

    const amountText = precio ? ` por $${precio * cantidad} total` : '';
    addNotification(`✅ ${operation === 'venta' ? 'Venta registrada' : 'Compra registrada'}: ${operation === 'compra' ? '+' : '-'}${cantidad} ${producto} en ${negocio}${amountText}`);
  };

  return (
    <AppContext.Provider value={{ data, updateInventoryAndBalance, notifications, addNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
