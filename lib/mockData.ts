// Demo data for Colombian SMB (Bogotá)

export const COMPANY_NAME = "Distribuidora El Progreso S.A.S.";

// Monthly revenue & expenses for the year
export const monthlyFinancials = [
  { month: "Ene", ingresos: 145000000, gastos: 98000000, utilidad: 47000000 },
  { month: "Feb", ingresos: 132000000, gastos: 91000000, utilidad: 41000000 },
  { month: "Mar", ingresos: 168000000, gastos: 105000000, utilidad: 63000000 },
  { month: "Abr", ingresos: 155000000, gastos: 102000000, utilidad: 53000000 },
  { month: "May", ingresos: 178000000, gastos: 112000000, utilidad: 66000000 },
  { month: "Jun", ingresos: 190000000, gastos: 118000000, utilidad: 72000000 },
  { month: "Jul", ingresos: 185000000, gastos: 115000000, utilidad: 70000000 },
  { month: "Ago", ingresos: 205000000, gastos: 128000000, utilidad: 77000000 },
  { month: "Sep", ingresos: 198000000, gastos: 122000000, utilidad: 76000000 },
  { month: "Oct", ingresos: 220000000, gastos: 135000000, utilidad: 85000000 },
  { month: "Nov", ingresos: 248000000, gastos: 148000000, utilidad: 100000000 },
  { month: "Dic", ingresos: 290000000, gastos: 168000000, utilidad: 122000000 },
];

// Cash flow data
export const cashFlowData = [
  { month: "Ene", entradas: 145000000, salidas: -98000000, neto: 47000000, acumulado: 47000000 },
  { month: "Feb", entradas: 132000000, salidas: -91000000, neto: 41000000, acumulado: 88000000 },
  { month: "Mar", entradas: 168000000, salidas: -105000000, neto: 63000000, acumulado: 151000000 },
  { month: "Abr", entradas: 155000000, salidas: -102000000, neto: 53000000, acumulado: 204000000 },
  { month: "May", entradas: 178000000, salidas: -112000000, neto: 66000000, acumulado: 270000000 },
  { month: "Jun", entradas: 190000000, salidas: -118000000, neto: 72000000, acumulado: 342000000 },
];

// Expense breakdown by category
export const expenseCategories = [
  { name: "Nómina", value: 42, color: "#0071E3", amount: 56000000 },
  { name: "Inventario", value: 28, color: "#5AC8FA", amount: 37000000 },
  { name: "Arriendo", value: 12, color: "#34C759", amount: 16000000 },
  { name: "Marketing", value: 8, color: "#FF9F0A", amount: 10500000 },
  { name: "Servicios", value: 6, color: "#AF52DE", amount: 8000000 },
  { name: "Otros", value: 4, color: "#FF3B30", amount: 5000000 },
];

// KPI Cards - Finance
export const financeKPIs = {
  ingresosMes: 190000000,
  ingresosCambio: 6.7,
  gastosMes: 118000000,
  gastosCambio: 5.2,
  utilidadNeta: 72000000,
  utilidadCambio: 8.4,
  flujoCaja: 342000000,
  flujoCajaChange: 12.1,
  margenBruto: 37.9,
  cuentasPorCobrar: 85000000,
  cuentasPorPagar: 42000000,
  roiMarketing: 3.2,
};

// Budget vs Actual
export const budgetVsActual = [
  { categoria: "Ventas", presupuesto: 180000000, real: 190000000, variacion: 5.6 },
  { categoria: "Nómina", presupuesto: 55000000, real: 56000000, variacion: -1.8 },
  { categoria: "Marketing", presupuesto: 12000000, real: 10500000, variacion: 12.5 },
  { categoria: "Logística", presupuesto: 18000000, real: 19200000, variacion: -6.7 },
  { categoria: "Tecnología", presupuesto: 5000000, real: 4800000, variacion: 4.0 },
  { categoria: "Arriendo", presupuesto: 16000000, real: 16000000, variacion: 0 },
];

// Inventory data
export const inventoryItems = [
  { id: "INV-001", producto: "Laptop HP 15", categoria: "Tecnología", stock: 45, minimo: 10, precio: 2800000, valor: 126000000, estado: "normal" },
  { id: "INV-002", producto: "Monitor Dell 24\"", categoria: "Tecnología", stock: 8, minimo: 10, precio: 890000, valor: 7120000, estado: "bajo" },
  { id: "INV-003", producto: "Silla Ergonómica Pro", categoria: "Mobiliario", stock: 32, minimo: 5, precio: 650000, valor: 20800000, estado: "normal" },
  { id: "INV-004", producto: "Impresora Canon MX", categoria: "Tecnología", stock: 3, minimo: 5, precio: 450000, valor: 1350000, estado: "critico" },
  { id: "INV-005", producto: "Escritorio Ejecutivo", categoria: "Mobiliario", stock: 15, minimo: 8, precio: 1200000, valor: 18000000, estado: "normal" },
  { id: "INV-006", producto: "Tablet Samsung 10\"", categoria: "Tecnología", stock: 28, minimo: 10, precio: 1100000, valor: 30800000, estado: "normal" },
  { id: "INV-007", producto: "Teclado Mecánico", categoria: "Accesorios", stock: 6, minimo: 15, precio: 180000, valor: 1080000, estado: "bajo" },
  { id: "INV-008", producto: "Mouse Inalámbrico", categoria: "Accesorios", stock: 67, minimo: 20, precio: 85000, valor: 5695000, estado: "normal" },
];

// Orders data
export const ordersData = [
  { id: "ORD-2024-0891", cliente: "Tech Solutions SAS", fecha: "2024-06-18", valor: 8500000, estado: "entregado", items: 12 },
  { id: "ORD-2024-0892", cliente: "Comercial Andina", fecha: "2024-06-19", valor: 3200000, estado: "en_transito", items: 5 },
  { id: "ORD-2024-0893", cliente: "Inversiones Bogotá", fecha: "2024-06-20", valor: 15600000, estado: "procesando", items: 23 },
  { id: "ORD-2024-0894", cliente: "Distribuidores del Norte", fecha: "2024-06-20", valor: 2800000, estado: "pendiente", items: 4 },
  { id: "ORD-2024-0895", cliente: "Grupo Empresarial K&A", fecha: "2024-06-21", valor: 9100000, estado: "entregado", items: 18 },
  { id: "ORD-2024-0896", cliente: "Ferretería El Tornillo", fecha: "2024-06-21", valor: 1450000, estado: "en_transito", items: 8 },
  { id: "ORD-2024-0897", cliente: "Papelería Moderna", fecha: "2024-06-22", valor: 680000, estado: "pendiente", items: 3 },
];

// Suppliers data
export const suppliersData = [
  { id: "SUP-001", nombre: "TechImport Colombia", categoria: "Tecnología", calificacion: 4.8, tiempoEntrega: 5, pedidosPendientes: 2, valorPendiente: 45000000 },
  { id: "SUP-002", nombre: "Muebles Industriales SA", categoria: "Mobiliario", calificacion: 4.2, tiempoEntrega: 12, pedidosPendientes: 1, valorPendiente: 18000000 },
  { id: "SUP-003", nombre: "Accesorios Office Pro", categoria: "Accesorios", calificacion: 4.6, tiempoEntrega: 3, pedidosPendientes: 3, valorPendiente: 8500000 },
  { id: "SUP-004", nombre: "Logística Express BOG", categoria: "Transporte", calificacion: 3.9, tiempoEntrega: 1, pedidosPendientes: 0, valorPendiente: 0 },
];

// Operations KPIs
export const operationsKPIs = {
  pedidosMes: 89,
  pedidosCambio: 12.3,
  tasaCumplimiento: 94.4,
  tasaCumplimientoCambio: 2.1,
  valorInventario: 210845000,
  inventarioCambio: -3.2,
  tiempoEntregaPromedio: 3.2,
  tiempoEntregaCambio: -8.5,
  proveedoresActivos: 12,
  productosBajoStock: 3,
};

// Order fulfillment by month
export const orderFulfillment = [
  { month: "Ene", pedidos: 62, entregados: 58, tasa: 93.5 },
  { month: "Feb", pedidos: 58, entregados: 54, tasa: 93.1 },
  { month: "Mar", pedidos: 74, entregados: 70, tasa: 94.6 },
  { month: "Abr", pedidos: 69, entregados: 65, tasa: 94.2 },
  { month: "May", pedidos: 79, entregados: 75, tasa: 94.9 },
  { month: "Jun", pedidos: 89, entregados: 84, tasa: 94.4 },
];

// Revenue by channel
export const revenueByChannel = [
  { name: "Ventas directas", value: 52, color: "#0071E3" },
  { name: "Distribuidores", value: 28, color: "#5AC8FA" },
  { name: "E-commerce", value: 15, color: "#34C759" },
  { name: "Exportaciones", value: 5, color: "#FF9F0A" },
];

// Financial projections
export const projections = [
  { month: "Jul", real: null, proyeccion: 198000000 },
  { month: "Ago", real: null, proyeccion: 215000000 },
  { month: "Sep", real: null, proyeccion: 208000000 },
  { month: "Oct", real: null, proyeccion: 235000000 },
  { month: "Nov", real: null, proyeccion: 268000000 },
  { month: "Dic", real: null, proyeccion: 310000000 },
];
