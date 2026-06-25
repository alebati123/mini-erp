export const initialDatabase = {
  balances: {
    ingresos: 250000,
    egresos: 120000,
    balanceTotal: 130000,
    history: [
      { month: 'Ene', ingresos: 40000, egresos: 20000 },
      { month: 'Feb', ingresos: 50000, egresos: 25000 },
      { month: 'Mar', ingresos: 45000, egresos: 30000 },
      { month: 'Abr', ingresos: 60000, egresos: 20000 },
      { month: 'May', ingresos: 55000, egresos: 25000 },
    ]
  },
  abshine: {
    inventory: [
      { id: 'ABS-001', producto: 'Shampoo Neutro', marca: 'K78', tipo: 'Limpieza', volumen: '5L', stock: 15, precio: 8000 },
      { id: 'ABS-002', producto: 'Cera Rápida', marca: 'Toxic Shine', tipo: 'Protección', volumen: '500ml', stock: 25, precio: 6500 },
      { id: 'ABS-003', producto: 'Microfibra Premium', marca: 'N/A', tipo: 'Accesorio', volumen: 'N/A', stock: 50, precio: 3000 },
      { id: 'ABS-004', producto: 'Acondicionador de Cubiertas', marca: 'K78', tipo: 'Estética', volumen: '1L', stock: 10, precio: 4500 }
    ]
  },
  ab3d: {
    inventory: [
      { id: '3D-001', producto: 'Soporte Celular Auto', material: 'PETG', color: 'Negro', tipo: 'Accesorio', stock: 30, precio: 2500 },
      { id: '3D-002', producto: 'Maceta Groot', material: 'PLA', color: 'Madera', tipo: 'Decoración', stock: 12, precio: 4000 },
      { id: '3D-003', producto: 'Llavero Personalizado', material: 'PLA', color: 'Multicolor', tipo: 'Merchandising', stock: 100, precio: 800 },
      { id: '3D-004', producto: 'Rollo PLA', material: 'PLA', color: 'Blanco', tipo: 'Insumo', stock: 5, precio: 15000 }
    ]
  }
};
