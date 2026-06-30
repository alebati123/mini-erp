import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

const AppContext = createContext();

const defaultData = {
  balances: { ingresos: 0, egresos: 0, balanceTotal: 0 },
  abshine: { inventory: [] },
  ab3d: { inventory: [] }
};

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(defaultData);
  const [notifications, setNotifications] = useState([]);

  // Función para agregar notificaciones tipo Toast
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // 1. Escuchar balances globales
    const unsubscribeBalances = onSnapshot(doc(db, "global", "balances"), (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...prev, balances: docSnap.data() }));
      } else {
        // Inicializar si no existe en la nube
        setDoc(doc(db, "global", "balances"), { ingresos: 0, egresos: 0, balanceTotal: 0 });
      }
    });

    // 2. Escuchar colección entera de inventario
    const unsubscribeInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const abshineItems = items.filter(i => i.negocio === 'abshine');
      const ab3dItems = items.filter(i => i.negocio === 'ab3d');
      
      setData(prev => ({
        ...prev,
        abshine: { inventory: abshineItems },
        ab3d: { inventory: ab3dItems }
      }));
    });

    return () => {
      unsubscribeBalances();
      unsubscribeInventory();
    };
  }, []);

  const updateBalances = async (amountChange, isIngreso) => {
    // Fetch fresh balance para no desincronizar
    const balanceRef = doc(db, "global", "balances");
    const balSnap = await getDoc(balanceRef);
    if(balSnap.exists()) {
        const d = balSnap.data();
        if(isIngreso) {
            await updateDoc(balanceRef, { ingresos: d.ingresos + amountChange, balanceTotal: d.balanceTotal + amountChange });
        } else {
            await updateDoc(balanceRef, { egresos: d.egresos + amountChange, balanceTotal: d.balanceTotal - amountChange });
        }
    }
  };

  const updateInventoryAndBalance = async (payload) => {
    const { operacion, negocio, producto, cantidad, precio_venta, precio_compra, marca, material, color, nuevo_nombre, categoria, nuevo_stock, estado } = payload;
    const unitKey = negocio.toLowerCase().includes('abshine') ? 'abshine' : 'ab3d';
    const inventory = data[unitKey].inventory;
    
    // Fuzzy Matching
    const targetTokens = producto.toLowerCase().split(/[\s*x-]/).filter(t => t.length > 1 || !isNaN(t));
    let bestMatchIndex = -1;
    let highestRatio = 0;

    inventory.forEach((item, index) => {
      const itemTokens = item.producto.toLowerCase().split(/[\s*x-]/).filter(t => t.length > 0);
      let score = 0;
      targetTokens.forEach(targetToken => {
         const baseTarget = isNaN(targetToken) ? targetToken.replace(/es$/g, '').replace(/s$/g, '') : targetToken;
         let matched = false;
         itemTokens.forEach(itemToken => {
            const baseItem = isNaN(itemToken) ? itemToken.replace(/es$/g, '').replace(/s$/g, '') : itemToken;
            if (baseItem.includes(baseTarget) || baseTarget.includes(baseItem)) matched = true;
         });
         if (matched) score++;
      });

      let ratio = score / Math.max(targetTokens.length, itemTokens.length);

      if (marca) {
          const marcaTarget = marca.toLowerCase().trim();
          const marcaItem = (item.marca || '').toLowerCase().trim();
          if (marcaItem && marcaItem !== 'n/a' && !marcaItem.includes(marcaTarget) && !marcaTarget.includes(marcaItem)) ratio = 0;
      }
      if (color) {
          const colorTarget = color.toLowerCase().trim();
          const colorItem = (item.color || '').toLowerCase().trim();
          if (colorItem && colorItem !== 'n/a' && !colorItem.includes(colorTarget) && !colorTarget.includes(colorItem)) ratio = 0;
      }
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
    
    const itemIndex = highestRatio > 0.45 ? bestMatchIndex : -1;
    
    if (itemIndex !== -1) {
      const currentItem = { ...inventory[itemIndex] };
      const itemRef = doc(db, 'inventory', currentItem.id);
      
      if (operacion === 'eliminacion') {
          await deleteDoc(itemRef);
      } else if (operacion === 'edicion') {
          const updates = {};
          if (precio_venta) updates.precioVenta = precio_venta;
          if (precio_compra) updates.precioCompra = precio_compra;
          if (marca) updates.marca = marca;
          if (material) updates.material = material;
          if (categoria) updates.tipo = categoria;
          if (estado) updates.estado = estado;
          if (nuevo_stock !== undefined && nuevo_stock !== null) updates.stock = nuevo_stock;
          if (nuevo_nombre) updates.producto = nuevo_nombre;
          await updateDoc(itemRef, updates);
      } else if (operacion === 'venta') {
        const amountChange = (precio_venta || currentItem.precioVenta) * (cantidad || 1);
        await updateDoc(itemRef, { stock: currentItem.stock - (cantidad || 1) });
        await updateBalances(amountChange, true);
      } else if (operacion === 'compra') {
        const unitPrice = precio_compra || currentItem.precioCompra || (currentItem.precioVenta * 0.5);
        const amountChange = unitPrice * (cantidad || 1);
        await updateDoc(itemRef, { stock: currentItem.stock + (cantidad || 1) });
        await updateBalances(amountChange, false);
      } else if (operacion === 'carga') {
        await updateDoc(itemRef, { stock: currentItem.stock + (cantidad || 1) });
      }
    } else {
      if (operacion === 'edicion' || operacion === 'eliminacion') return; // No hacer nada si no existe
      
      const pVenta = precio_venta || 0;
      const pCompra = precio_compra || (pVenta > 0 ? pVenta * 0.5 : 0);
      
      const newItem = {
        negocio: unitKey,
        producto,
        stock: (operacion === 'compra' || operacion === 'carga') ? (cantidad || 1) : -(cantidad || 1),
        precioVenta: pVenta,
        precioCompra: pCompra,
        marca: marca || 'N/A', 
        tipo: categoria || 'Nuevo', 
        volumen: 'N/A', 
        material: material || 'N/A', 
        color: color || 'N/A',
        estado: estado || 'N/A'
      };
      
      await addDoc(collection(db, 'inventory'), newItem);
      
      if(operacion === 'venta' && pVenta) {
        await updateBalances((pVenta * (cantidad || 1)), true);
      } else if(operacion === 'compra' && pCompra) {
         await updateBalances((pCompra * (cantidad || 1)), false);
      }
    }

    let mensajeToast = "";
    if (payload.operacion === 'edicion') {
        mensajeToast = `✏️ Producto "${payload.producto}" actualizado en ${payload.negocio}`;
    } else if (payload.operacion === 'eliminacion') {
        mensajeToast = `🗑️ Producto "${payload.producto}" eliminado de ${payload.negocio}`;
    } else if (payload.operacion === 'carga') {
        mensajeToast = `📦 Stock inicial agregado: +${payload.cantidad || 1} ${payload.producto} en ${payload.negocio}`;
    } else {
        const amountText = payload.precio_venta || payload.precio_compra ? ` registrado` : '';
        mensajeToast = `✅ ${payload.operacion === 'venta' ? 'Venta' : 'Compra'}: ${payload.operacion === 'compra' ? '+' : '-'}${payload.cantidad || 1} ${payload.producto} en ${payload.negocio}${amountText}`;
    }
    addNotification(mensajeToast);
  };

  const deleteProductUI = async (negocio, id) => {
    try {
        await deleteDoc(doc(db, 'inventory', id));
        addNotification('🗑️ Producto eliminado manualmente.', 'danger');
    } catch(err) {
        addNotification('❌ Error al eliminar producto', 'danger');
    }
  };

  const editProductUI = async (negocio, updatedItem) => {
    try {
        const { id, negocio: neg, ...updates } = updatedItem;
        await updateDoc(doc(db, 'inventory', id), updates);
        addNotification('✅ Producto editado manualmente.', 'success');
    } catch(err) {
        addNotification('❌ Error al editar producto', 'danger');
    }
  };

  const addProductUI = async (negocio, newItem) => {
    try {
        await addDoc(collection(db, 'inventory'), { ...newItem, negocio });
        addNotification('✅ Producto añadido manualmente.', 'success');
    } catch(err) {
        addNotification('❌ Error al añadir producto', 'danger');
    }
  };

  return (
    <AppContext.Provider value={{ data, updateInventoryAndBalance, deleteProductUI, editProductUI, addProductUI, notifications, addNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
