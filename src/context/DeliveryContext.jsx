import { createContext, useContext, useState, useEffect } from 'react';
import { mockDeliveries, mockMerchants, mockMotoboys } from '../data/mockData';

const DeliveryContext = createContext(null);

export function DeliveryProvider({ children }) {
    const [deliveries, setDeliveries] = useState([]);
    const [merchants, setMerchants] = useState([]);
    const [motoboys, setMotoboys] = useState([]);

    useEffect(() => {
        // Load from localStorage or use mock data
        const savedDeliveries = localStorage.getItem('flashcatu_deliveries');
        const savedMerchants = localStorage.getItem('flashcatu_merchants');
        const savedMotoboys = localStorage.getItem('flashcatu_motoboys');

        setDeliveries(savedDeliveries ? JSON.parse(savedDeliveries) : mockDeliveries);
        setMerchants(savedMerchants ? JSON.parse(savedMerchants) : mockMerchants);
        setMotoboys(savedMotoboys ? JSON.parse(savedMotoboys) : mockMotoboys);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (deliveries.length > 0) {
            localStorage.setItem('flashcatu_deliveries', JSON.stringify(deliveries));
        }
    }, [deliveries]);

    useEffect(() => {
        if (merchants.length > 0) {
            localStorage.setItem('flashcatu_merchants', JSON.stringify(merchants));
        }
    }, [merchants]);

    useEffect(() => {
        if (motoboys.length > 0) {
            localStorage.setItem('flashcatu_motoboys', JSON.stringify(motoboys));
        }
    }, [motoboys]);

    // Create a new delivery
    const createDelivery = (merchantId, merchantName, pickupAddress, deliveryAddress) => {
        const newDelivery = {
            id: `d${Date.now()}`,
            merchantId,
            merchantName,
            pickupAddress,
            pickupCoords: { lat: -12.3567 + Math.random() * 0.01, lng: -38.3789 + Math.random() * 0.01 },
            deliveryAddress,
            deliveryCoords: { lat: -12.3590 + Math.random() * 0.01, lng: -38.3810 + Math.random() * 0.01 },
            status: 'waiting',
            motoboyId: null,
            motoboyName: null,
            value: 7.00,
            createdAt: new Date().toISOString(),
            acceptedAt: null,
            completedAt: null,
        };
        setDeliveries(prev => [newDelivery, ...prev]);
        return newDelivery;
    };

    // Accept a delivery (motoboy)
    const acceptDelivery = (deliveryId, motoboyId, motoboyName) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === deliveryId && d.status === 'waiting') {
                return {
                    ...d,
                    status: 'in_transit',
                    motoboyId,
                    motoboyName,
                    acceptedAt: new Date().toISOString(),
                };
            }
            return d;
        }));
    };

    // Complete a delivery
    const completeDelivery = (deliveryId) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === deliveryId && d.status === 'in_transit') {
                return {
                    ...d,
                    status: 'completed',
                    completedAt: new Date().toISOString(),
                };
            }
            return d;
        }));

        // Update motoboy earnings
        const delivery = deliveries.find(d => d.id === deliveryId);
        if (delivery?.motoboyId) {
            setMotoboys(prev => prev.map(m => {
                if (m.id === delivery.motoboyId) {
                    return {
                        ...m,
                        totalDeliveries: m.totalDeliveries + 1,
                        totalEarnings: m.totalEarnings + 7,
                    };
                }
                return m;
            }));
        }
    };

    // Cancel a delivery (admin)
    const cancelDelivery = (deliveryId) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === deliveryId) {
                return { ...d, status: 'cancelled' };
            }
            return d;
        }));
    };

    // Reassign delivery to another motoboy (admin)
    const reassignDelivery = (deliveryId, newMotoboyId, newMotoboyName) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === deliveryId) {
                return {
                    ...d,
                    motoboyId: newMotoboyId,
                    motoboyName: newMotoboyName,
                    status: 'in_transit',
                };
            }
            return d;
        }));
    };

    // Toggle merchant subscription
    const toggleMerchantSubscription = (merchantId) => {
        setMerchants(prev => prev.map(m => {
            if (m.id === merchantId) {
                return { ...m, subscriptionPaid: !m.subscriptionPaid };
            }
            return m;
        }));
    };

    // Toggle user active status
    const toggleUserActive = (userId, userType) => {
        if (userType === 'merchant') {
            setMerchants(prev => prev.map(m => {
                if (m.id === userId) {
                    return { ...m, active: !m.active };
                }
                return m;
            }));
        } else if (userType === 'motoboy') {
            setMotoboys(prev => prev.map(m => {
                if (m.id === userId) {
                    return { ...m, active: !m.active };
                }
                return m;
            }));
        }
    };

    // Delete user
    const deleteUser = (userId, userType) => {
        if (userType === 'merchant') {
            setMerchants(prev => prev.filter(m => m.id !== userId));
        } else if (userType === 'motoboy') {
            setMotoboys(prev => prev.filter(m => m.id !== userId));
        }
    };

    // Get deliveries for a specific merchant
    const getMerchantDeliveries = (merchantId) => {
        return deliveries.filter(d => d.merchantId === merchantId);
    };

    // Get deliveries for a specific motoboy
    const getMotoboyDeliveries = (motoboyId) => {
        return deliveries.filter(d => d.motoboyId === motoboyId);
    };

    // Get available deliveries (waiting status)
    const getAvailableDeliveries = () => {
        return deliveries.filter(d => d.status === 'waiting');
    };

    // Get active deliveries (in_transit)
    const getActiveDeliveries = () => {
        return deliveries.filter(d => d.status === 'in_transit');
    };

    // Export deliveries to CSV
    const exportToCSV = () => {
        const headers = ['Data', 'Comércio', 'Motoboy', 'Origem', 'Destino', 'Status', 'Valor'];
        const rows = deliveries.map(d => [
            new Date(d.createdAt).toLocaleDateString('pt-BR'),
            d.merchantName,
            d.motoboyName || '-',
            d.pickupAddress,
            d.deliveryAddress,
            d.status === 'waiting' ? 'Aguardando' :
                d.status === 'in_transit' ? 'Em trânsito' :
                    d.status === 'completed' ? 'Finalizado' : 'Cancelado',
            `R$ ${d.value.toFixed(2)}`,
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `flash-catu-relatorio-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <DeliveryContext.Provider value={{
            deliveries,
            merchants,
            motoboys,
            createDelivery,
            acceptDelivery,
            completeDelivery,
            cancelDelivery,
            reassignDelivery,
            toggleMerchantSubscription,
            toggleUserActive,
            deleteUser,
            getMerchantDeliveries,
            getMotoboyDeliveries,
            getAvailableDeliveries,
            getActiveDeliveries,
            exportToCSV,
        }}>
            {children}
        </DeliveryContext.Provider>
    );
}

export function useDelivery() {
    const context = useContext(DeliveryContext);
    if (!context) {
        throw new Error('useDelivery must be used within a DeliveryProvider');
    }
    return context;
}
