import { X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import './Toast.css';

export default function Toast() {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <div className="toast-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`toast toast--${notification.type}`}
                >
                    <div className="toast__content">
                        <span className="toast__title">{notification.title}</span>
                        <span className="toast__message">{notification.message}</span>
                    </div>
                    <button
                        className="toast__close"
                        onClick={() => removeNotification(notification.id)}
                    >
                        <X size={18} />
                    </button>
                    <div className="toast__progress" style={{ animationDuration: `${notification.duration}ms` }} />
                </div>
            ))}
        </div>
    );
}
