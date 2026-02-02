import { MapPin, Navigation, Clock, DollarSign, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './DeliveryCard.css';

export default function DeliveryCard({
    delivery,
    showMerchant = true,
    showMotoboy = true,
    actions = null
}) {
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openInMaps = () => {
        const { lat, lng } = delivery.deliveryCoords;
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    };

    return (
        <div className={`delivery-card delivery-card--${delivery.status}`}>
            <div className="delivery-card__header">
                <StatusBadge status={delivery.status} showPulse={delivery.status === 'in_transit'} />
                <span className="delivery-card__time">
                    <Clock size={14} />
                    {formatTime(delivery.createdAt)}
                </span>
            </div>

            <div className="delivery-card__content">
                {showMerchant && (
                    <div className="delivery-card__merchant">
                        <User size={16} />
                        <span>{delivery.merchantName}</span>
                    </div>
                )}

                <div className="delivery-card__addresses">
                    <div className="delivery-card__address">
                        <MapPin size={16} className="icon-pickup" />
                        <div>
                            <span className="label">Retirada</span>
                            <span className="value">{delivery.pickupAddress}</span>
                        </div>
                    </div>

                    <div className="delivery-card__address">
                        <Navigation size={16} className="icon-delivery" />
                        <div>
                            <span className="label">Entrega</span>
                            <span className="value">{delivery.deliveryAddress}</span>
                        </div>
                    </div>
                </div>

                {showMotoboy && delivery.motoboyName && (
                    <div className="delivery-card__motoboy">
                        <span className="label">Motoboy:</span>
                        <span className="value">{delivery.motoboyName}</span>
                    </div>
                )}

                <div className="delivery-card__value">
                    <DollarSign size={16} />
                    <span>R$ {delivery.value.toFixed(2)}</span>
                </div>
            </div>

            {actions && (
                <div className="delivery-card__actions">
                    {actions}
                </div>
            )}
        </div>
    );
}
