// Mock Users Data
export const mockMerchants = [
  { id: 'm1', name: 'Pizzaria Flash', email: 'pizzaria@flash.com', phone: '75999001001', address: 'Rua das Flores, 100 - Centro', active: true, subscriptionPaid: true },
  { id: 'm2', name: 'Hamburgueria Turbo', email: 'turbo@burger.com', phone: '75999001002', address: 'Av. Principal, 200', active: true, subscriptionPaid: true },
  { id: 'm3', name: 'Açaí Speed', email: 'speed@acai.com', phone: '75999001003', address: 'Praça Central, 50', active: true, subscriptionPaid: false },
  { id: 'm4', name: 'Farmácia Veloz', email: 'veloz@farmacia.com', phone: '75999001004', address: 'Rua do Comércio, 75', active: true, subscriptionPaid: true },
  { id: 'm5', name: 'Padaria Relâmpago', email: 'relampago@padaria.com', phone: '75999001005', address: 'Av. Brasil, 300', active: false, subscriptionPaid: false },
  { id: 'm6', name: 'Restaurante Jato', email: 'jato@restaurante.com', phone: '75999001006', address: 'Rua Nova, 150', active: true, subscriptionPaid: true },
  { id: 'm7', name: 'Mercadinho Express', email: 'express@mercadinho.com', phone: '75999001007', address: 'Rua do Sol, 80', active: true, subscriptionPaid: true },
  { id: 'm8', name: 'Lanchonete Foguete', email: 'foguete@lanchonete.com', phone: '75999001008', address: 'Av. das Palmeiras, 250', active: true, subscriptionPaid: true },
];

export const mockMotoboys = [
  { id: 'b1', name: 'Carlos Silva', email: 'carlos@motoboy.com', phone: '75988001001', cpf: '123.456.789-00', plate: 'ABC-1234', vehiclePhoto: null, active: true, totalDeliveries: 127, totalEarnings: 889 },
  { id: 'b2', name: 'João Santos', email: 'joao@motoboy.com', phone: '75988001002', cpf: '234.567.890-11', plate: 'DEF-5678', vehiclePhoto: null, active: true, totalDeliveries: 98, totalEarnings: 686 },
  { id: 'b3', name: 'Pedro Oliveira', email: 'pedro@motoboy.com', phone: '75988001003', cpf: '345.678.901-22', plate: 'GHI-9012', vehiclePhoto: null, active: true, totalDeliveries: 156, totalEarnings: 1092 },
  { id: 'b4', name: 'Lucas Souza', email: 'lucas@motoboy.com', phone: '75988001004', cpf: '456.789.012-33', plate: 'JKL-3456', vehiclePhoto: null, active: false, totalDeliveries: 45, totalEarnings: 315 },
  { id: 'b5', name: 'Marcos Lima', email: 'marcos@motoboy.com', phone: '75988001005', cpf: '567.890.123-44', plate: 'MNO-7890', vehiclePhoto: null, active: true, totalDeliveries: 210, totalEarnings: 1470 },
];

export const mockAdmins = [
  { id: 'a1', name: 'Admin Flash', email: 'admin@flashcatu.com', phone: '75999000000' },
];

// Sample delivery addresses in Catu, BA
export const sampleAddresses = [
  { address: 'Rua Barão do Rio Branco, 100 - Centro, Catu', lat: -12.3567, lng: -38.3789 },
  { address: 'Av. ACM, 250 - Catu', lat: -12.3590, lng: -38.3810 },
  { address: 'Praça da Matriz, 50 - Centro, Catu', lat: -12.3545, lng: -38.3765 },
  { address: 'Rua do Comércio, 180 - Catu', lat: -12.3612, lng: -38.3832 },
  { address: 'Av. Getúlio Vargas, 300 - Catu', lat: -12.3580, lng: -38.3750 },
];

// Initial deliveries for demo
export const mockDeliveries = [
  {
    id: 'd1',
    merchantId: 'm1',
    merchantName: 'Pizzaria Flash',
    pickupAddress: 'Rua das Flores, 100 - Centro',
    pickupCoords: { lat: -12.3567, lng: -38.3789 },
    deliveryAddress: 'Av. ACM, 250 - Catu',
    deliveryCoords: { lat: -12.3590, lng: -38.3810 },
    status: 'waiting', // waiting, in_transit, completed, cancelled
    motoboyId: null,
    motoboyName: null,
    value: 7.00,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    acceptedAt: null,
    completedAt: null,
  },
  {
    id: 'd2',
    merchantId: 'm2',
    merchantName: 'Hamburgueria Turbo',
    pickupAddress: 'Av. Principal, 200',
    pickupCoords: { lat: -12.3545, lng: -38.3765 },
    deliveryAddress: 'Rua do Comércio, 180 - Catu',
    deliveryCoords: { lat: -12.3612, lng: -38.3832 },
    status: 'in_transit',
    motoboyId: 'b1',
    motoboyName: 'Carlos Silva',
    value: 7.00,
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    completedAt: null,
  },
  {
    id: 'd3',
    merchantId: 'm1',
    merchantName: 'Pizzaria Flash',
    pickupAddress: 'Rua das Flores, 100 - Centro',
    pickupCoords: { lat: -12.3567, lng: -38.3789 },
    deliveryAddress: 'Praça da Matriz, 50 - Centro, Catu',
    deliveryCoords: { lat: -12.3545, lng: -38.3765 },
    status: 'completed',
    motoboyId: 'b2',
    motoboyName: 'João Santos',
    value: 7.00,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 55 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'd4',
    merchantId: 'm2',
    merchantName: 'Hamburgueria Turbo',
    pickupAddress: 'Av. Principal, 200',
    pickupCoords: { lat: -12.3545, lng: -38.3765 },
    deliveryAddress: 'Rua Barão do Rio Branco, 100 - Centro',
    deliveryCoords: { lat: -12.3567, lng: -38.3789 },
    status: 'completed',
    motoboyId: 'b1',
    motoboyName: 'Carlos Silva',
    value: 8.50,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
];

// Demo user credentials
export const demoUsers = {
  merchant: { id: 'm1', role: 'merchant', name: 'Pizzaria Flash', email: 'demo@comerciante.com' },
  motoboy: { id: 'b1', role: 'motoboy', name: 'Carlos Silva', email: 'demo@motoboy.com' },
  admin: { id: 'a1', role: 'admin', name: 'Admin Flash', email: 'admin@flashcatu.com' },
};
