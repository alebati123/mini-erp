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
   * @param {Object} payload JSON devuelto por la IA
   */
  const updateInventoryAndBalance = (payload) => {
    setData(prevData => {
      const { operacion, negocio, producto, cantidad, precio_venta, precio_compra, marca, material, color, nuevo_nombre, categoria, nuevo_stock } = payload;
      const unitKey = negocio.toLowerCase().includes('abshine') ? 'abshine' : 'ab3d';
      
      const newBalances = { ...prevData.balances };
      const newInventory = [ ...prevData[unitKey].inventory ];
      
      // Búsqueda Inteligente (Fuzzy Matching por Ratio)
      const targetTokens = producto.toLowerCase().split(/[\s*x-]/).filter(t => t.length > 1 || !isNaN(t));
      
      let bestMatchIndex = -1;
      let highestRatio = 0;

      newInventory.forEach((item, index) => {
        const itemTokens = item.producto.toLowerCase().split(/[\s*x-]/).filter(t => t.length > 0);
        let score = 0;
        
        targetTokens.forEach(targetToken => {
           const baseTarget = isNaN(targetToken) ? targetToken.replace(/es$/g, '').replace(/s$/g, '') : targetToken;
           let matched = false;
           
           itemTokens.forEach(itemToken => {
              const baseItem = isNaN(itemToken) ? itemToken.replace(/es$/g, '').replace(/s$/g, '') : itemToken;
              if (baseItem.includes(baseTarget) || baseTarget.includes(baseItem)) {
                 matched = true;
              }
           });
           
           if (matched) score++;
        });

        // Calculamos la similitud en base a la longitud máxima de palabras para no emparejar algo muy específico con algo muy genérico
        let ratio = score / Math.max(targetTokens.length, itemTokens.length);

        // Validar que la marca no contradiga a la existente
        if (marca) {
            const marcaTarget = marca.toLowerCase().trim();
            const marcaItem = (item.marca || '').toLowerCase().trim();
            if (marcaItem && marcaItem !== 'n/a' && !marcaItem.includes(marcaTarget) && !marcaTarget.includes(marcaItem)) ratio = 0;
        }
        // Validar que el color no contradiga al existente
        if (color) {
            const colorTarget = color.toLowerCase().trim();
            const colorItem = (item.color || '').toLowerCase().trim();
            if (colorItem && colorItem !== 'n/a' && !colorItem.includes(colorTarget) && !colorTarget.includes(colorItem)) ratio = 0;
        }
        // Validar que el material no contradiga al existente
        if (material) {
            const materialTarget = material.toLowerCase().trim();
            const materialItem = (item.material || '').toLowerCase().trim();
            if (materialItem && materialItem !== 'n/a' && !materialItem.includes(materialTarget) && !materialTarget.includes(materialItem)) ratio = 0;
        }

        if (ratio > highestRatio) {
           highestRatio = ratio;
           bestMatchIndex = index;
        }
      });
      
      // Umbral estricto: requiere al menos un 45% de similitud de palabras
      const itemIndex = highestRatio > 0.45 ? bestMatchIndex : -1;
      
      let amountChange = 0;
      
      if (itemIndex !== -1) {
        const currentItem = { ...newInventory[itemIndex] };
        
        if (operacion === 'eliminacion') {
            newInventory.splice(itemIndex, 1);
        } else if (operacion === 'edicion') {
            if (precio_venta) currentItem.precioVenta = precio_venta;
            if (precio_compra) currentItem.precioCompra = precio_compra;
            if (marca) currentItem.marca = marca;
            if (material) currentItem.material = material;
            if (color) currentItem.color = color;
            if (categoria) currentItem.tipo = categoria;
            if (nuevo_stock !== undefined && nuevo_stock !== null) currentItem.stock = nuevo_stock;
            if (nuevo_nombre) currentItem.producto = nuevo_nombre;
            newInventory[itemIndex] = currentItem;
        } else if (operacion === 'venta') {
          currentItem.stock -= (cantidad || 1);
          const unitPrice = precio_venta || currentItem.precioVenta;
          amountChange = unitPrice * (cantidad || 1);
          newBalances.ingresos += amountChange;
          newBalances.balanceTotal += amountChange;
          newInventory[itemIndex] = currentItem;
        } else if (operacion === 'compra') {
          currentItem.stock += (cantidad || 1);
          const unitPrice = precio_compra || currentItem.precioCompra || (currentItem.precioVenta * 0.5);
          amountChange = unitPrice * (cantidad || 1);
          newBalances.egresos += amountChange;
          newBalances.balanceTotal -= amountChange;
          newInventory[itemIndex] = currentItem;
        }
      } else {
        if (operacion === 'edicion' || operacion === 'eliminacion') {
            // No creamos producto nuevo si solo se quería editar/eliminar algo inexistente
            return prevData;
        }
        const pVenta = precio_venta || 0;
        const pCompra = precio_compra || (pVenta > 0 ? pVenta * 0.5 : 0);
        
        const newItem = {
          id: `${unitKey.toUpperCase()}-NEW-${Date.now().toString().slice(-4)}`,
          producto,
          stock: operacion === 'compra' ? (cantidad || 1) : -(cantidad || 1),
          precioVenta: pVenta,
          precioCompra: pCompra,
          marca: marca || 'N/A', tipo: categoria || 'Nuevo', volumen: 'N/A', material: material || 'N/A', color: color || 'N/A'
        };
        newInventory.push(newItem);
        
        if(operacion === 'venta' && pVenta) {
          newBalances.ingresos += (pVenta * (cantidad || 1));
          newBalances.balanceTotal += (pVenta * (cantidad || 1));
        } else if(operacion === 'compra' && pCompra) {
           newBalances.egresos += (pCompra * (cantidad || 1));
           newBalances.balanceTotal -= (pCompra * (cantidad || 1));
        }
      }

      return {
        ...prevData,
        balances: newBalances,
        [unitKey]: {
          ...prevData[unitKey],
          inventory: newInventory
        }
      };
    });

    let mensajeToast = "";
    if (payload.operacion === 'edicion') {
        mensajeToast = `✏️ Producto "${payload.producto}" actualizado en ${payload.negocio}`;
    } else if (payload.operacion === 'eliminacion') {
        mensajeToast = `🗑️ Producto "${payload.producto}" eliminado de ${payload.negocio}`;
    } else {
        const amountText = payload.precio_venta || payload.precio_compra ? ` registrado` : '';
        mensajeToast = `✅ ${payload.operacion === 'venta' ? 'Venta' : 'Compra'}: ${payload.operacion === 'compra' ? '+' : '-'}${payload.cantidad || 1} ${payload.producto} en ${payload.negocio}${amountText}`;
    }
    addNotification(mensajeToast);
  };

  const deleteProductUI = (negocio, id) => {
    setData(prevData => {
      const unitKey = negocio === 'abshine' ? 'abshine' : 'ab3d';
      const newInventory = prevData[unitKey].inventory.filter(item => item.id !== id);
      return {
        ...prevData,
        [unitKey]: {
          ...prevData[unitKey],
          inventory: newInventory
        }
      };
    });
    addNotification('🗑️ Producto eliminado manualmente.', 'danger');
  };

  const editProductUI = (negocio, updatedItem) => {
    setData(prevData => {
      const unitKey = negocio === 'abshine' ? 'abshine' : 'ab3d';
      const newInventory = prevData[unitKey].inventory.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
      return {
        ...prevData,
        [unitKey]: {
          ...prevData[unitKey],
          inventory: newInventory
        }
      };
    });
    addNotification('✅ Producto editado manualmente.', 'success');
  };

  return (
    <AppContext.Provider value={{ data, updateInventoryAndBalance, deleteProductUI, editProductUI, notifications, addNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
