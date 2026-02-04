import { useParams } from 'react-router-dom';
import { Zap, MapPin, User, Clock, CheckCircle, Package, XCircle } from 'lucide-react';
import { useDelivery } from '../context/DeliveryContext';
import './TrackingPage.css';

const statusConfig = {
    waiting: {
        icon: Clock,
        label: 'Aguardando Entregador',
        color: 'var(--status-waiting)',
        description: 'Procurando um entregador para sua encomenda...',
    },
    in_transit: {
        icon: Package,
        label: 'Em Trânsito',
        color: 'var(--status-transit)',
        description: 'Seu pedido está a caminho!',
    },
    completed: {
        icon: CheckCircle,
        label: 'Entregue',
        color: 'var(--status-completed)',
        description: 'Pedido entregue com sucesso!',
    },
    cancelled: {
        icon: XCircle,
        label: 'Cancelado',
        color: 'var(--status-cancelled)',
        description: 'Esta entrega foi cancelada.',
    },
};

export default function TrackingPage() {
    const { trackingCode } = useParams();
    const { getDeliveryByTrackingCode, merchants } = useDelivery();

    const delivery = getDeliveryByTrackingCode(trackingCode?.toUpperCase());
    const merchant = delivery ? merchants.find(m => m.id === delivery.merchantId) : null;
    const status = delivery ? statusConfig[delivery.status] : null;
    const StatusIcon = status?.icon || Clock;

    if (!delivery) {
        return (
            <div className="tracking-page">
                <div className="tracking-page__container">
                    <div className="tracking-page__not-found">
                        <Zap size={64} />
                        <h1>Código não encontrado</h1>
                        <p>Verifique o código de rastreio e tente novamente.</p>
                        <span className="tracking-page__code">{trackingCode}</span>
                    </div>
                    <div className="tracking-page__footer">
                        <span>Powered by</span>
                        <div className="tracking-page__flash-logo">
                            <Zap size={20} />
                            <span>Flash Catu</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tracking-page">
            <div className="tracking-page__container">
                {/* Merchant Header */}
                <div className="tracking-page__header">
                    <div className="tracking-page__merchant-logo">
                        {merchant?.name?.charAt(0) || 'L'}
                    </div>
                    <h1 className="tracking-page__merchant-name">{merchant?.name || delivery.merchantName}</h1>
                </div>

                {/* Status Card */}
                <div className="tracking-page__status-card" style={{ '--status-color': status?.color }}>
                    <div className="tracking-page__status-icon">
                        <StatusIcon size={40} />
                    </div>
                    <h2 className="tracking-page__status-label">{status?.label}</h2>
                    <p className="tracking-page__status-desc">{status?.description}</p>
                </div>

                {/* Delivery Details */}
                <div className="tracking-page__details">
                    {delivery.motoboyName && (
                        <div className="tracking-page__detail">
                            <User size={20} />
                            <div>
                                <span className="tracking-page__detail-label">Entregador</span>
                                <span className="tracking-page__detail-value">{delivery.motoboyName}</span>
                            </div>
                        </div>
                    )}

                    <div className="tracking-page__detail">
                        <MapPin size={20} />
                        <div>
                            <span className="tracking-page__detail-label">Destino</span>
                            <span className="tracking-page__detail-value">{delivery.deliveryAddress}</span>
                        </div>
                    </div>

                    <div className="tracking-page__detail">
                        <Clock size={20} />
                        <div>
                            <span className="tracking-page__detail-label">Atualizado em</span>
                            <span className="tracking-page__detail-value">
                                {new Date(delivery.acceptedAt || delivery.createdAt).toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tracking Code */}
                <div className="tracking-page__code-box">
                    <span className="tracking-page__code-label">Código de Rastreio</span>
                    <span className="tracking-page__code">{delivery.trackingCode}</span>
                </div>

                {/* Powered by Flash */}
                <div className="tracking-page__footer">
                    <span>Powered by</span>
                    <div className="tracking-page__flash-logo">
                        <Zap size={20} />
                        <span>Flash Catu</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
