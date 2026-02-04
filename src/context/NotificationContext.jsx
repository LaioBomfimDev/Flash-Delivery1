import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            type: notification.type || 'info', // success, warning, error, info
            title: notification.title,
            message: notification.message,
            duration: notification.duration || 5000,
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove after duration
        setTimeout(() => {
            removeNotification(id);
        }, newNotification.duration);

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Shortcut methods
    const notify = {
        success: (title, message) => addNotification({ type: 'success', title, message }),
        warning: (title, message) => addNotification({ type: 'warning', title, message }),
        error: (title, message) => addNotification({ type: 'error', title, message }),
        info: (title, message) => addNotification({ type: 'info', title, message }),

        // Specific delivery notifications
        deliveryRequested: () => addNotification({
            type: 'info',
            title: '⏳ Solicitação Enviada',
            message: 'Em até 10 minutos um entregador chegará!',
            duration: 8000
        }),
        deliveryAccepted: (motoboyName) => addNotification({
            type: 'success',
            title: '⚡ Corrida Aceita!',
            message: `${motoboyName} está a caminho do seu estabelecimento`,
            duration: 6000
        }),
        deliveryInTransit: () => addNotification({
            type: 'info',
            title: '🏍️ Em Trânsito',
            message: 'O entregador saiu para a entrega',
            duration: 5000
        }),
        deliveryCompleted: () => addNotification({
            type: 'success',
            title: '✅ Entrega Concluída!',
            message: 'A entrega foi realizada com sucesso',
            duration: 5000
        }),
        deliveryCancelled: () => addNotification({
            type: 'error',
            title: '❌ Corrida Cancelada',
            message: 'Esta corrida foi cancelada',
            duration: 5000
        }),
        newDeliveryAvailable: () => addNotification({
            type: 'warning',
            title: '🔔 Nova Corrida!',
            message: 'Uma nova corrida está disponível',
            duration: 8000
        }),
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, notify }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
}
