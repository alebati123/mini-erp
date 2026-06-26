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
      { id: 'ABS-001', producto: 'Shampoo Neutro', marca: 'K78', tipo: 'Limpieza', volumen: '5L', stock: 15, precioVenta: 8000, precioCompra: 4000 },
      { id: 'ABS-002', producto: 'Cera Rápida', marca: 'Toxic Shine', tipo: 'Protección', volumen: '500ml', stock: 25, precioVenta: 6500, precioCompra: 3000 },
      { id: 'ABS-003', producto: 'Microfibra Premium', marca: 'N/A', tipo: 'Accesorio', volumen: 'N/A', stock: 50, precioVenta: 3000, precioCompra: 1500 },
      { id: 'ABS-004', producto: 'Acondicionador de Cubiertas', marca: 'K78', tipo: 'Estética', volumen: '1L', stock: 10, precioVenta: 4500, precioCompra: 2000 }
    ]
  },
  ab3d: {
    inventory: [
      { id: '3D-001', producto: 'Soporte Celular Auto', material: 'PETG', color: 'Negro', tipo: 'Accesorio', stock: 30, precioVenta: 2500, precioCompra: 1000 },
      { id: '3D-002', producto: 'Maceta Groot', material: 'PLA', color: 'Madera', tipo: 'Decoración', stock: 12, precioVenta: 4000, precioCompra: 1500 },
      { id: '3D-003', producto: 'Llavero Personalizado', material: 'PLA', color: 'Multicolor', tipo: 'Merchandising', stock: 100, precioVenta: 800, precioCompra: 200 },
      { id: '3D-004', producto: 'Rollo PLA', material: 'PLA', color: 'Blanco', tipo: 'Insumo', stock: 5, precioVenta: 15000, precioCompra: 10000 }
    ]
  }
};
