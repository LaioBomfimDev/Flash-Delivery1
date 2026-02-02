import './StatusBadge.css';

const statusConfig = {
    waiting: { label: 'Aguardando', className: 'waiting' },
    in_transit: { label: 'Em trânsito', className: 'transit' },
    completed: { label: 'Finalizado', className: 'completed' },
    cancelled: { label: 'Cancelado', className: 'cancelled' },
};

export default function StatusBadge({ status, showPulse = false }) {
    const config = statusConfig[status] || statusConfig.waiting;

    return (
        <span className={`status-badge status-badge--${config.className} ${showPulse ? 'status-badge--pulse' : ''}`}>
            <span className="status-badge__dot"></span>
            {config.label}
        </span>
    );
}
