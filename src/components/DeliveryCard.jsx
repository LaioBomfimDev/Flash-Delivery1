import { MapPin, Navigation, Clock, DollarSign, User, Copy, Star, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDelivery } from '../context/DeliveryContext';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from './StatusBadge';
import './DeliveryCard.css';

export default function DeliveryCard({
    delivery,
    showMerchant = true,
    showMotoboy = true,
    actions = null,
    showTrackingLink = false,
    showFavoriteButton = false,
}) {
    const { user } = useAuth();
    const { addFavorite, removeFavorite, getFavorite, isPriorityValid } = useDelivery();
    const { notify } = useNotification();

    const favorite = user?.role === 'merchant' ? getFavorite(user.id) : null;
    const isFavorite = favorite?.id === delivery.motoboyId;
    const hasPriority = delivery.priorityMotoboyId && isPriorityValid(delivery);

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const copyTrackingLink = () => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/rastreio/${delivery.trackingCode}`;
        navigator.clipboard.writeText(link);
        notify.success('📋 Link Copiado!', 'Envie para o cliente pelo WhatsApp');
    };

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(user.id);
            notify.info('⭐ Favorito Removido', `${delivery.motoboyName} não é mais seu favorito`);
        } else {
            addFavorite(user.id, delivery.motoboyId, delivery.motoboyName);
            notify.success('⭐ Favorito Adicionado!', `${delivery.motoboyName} terá prioridade nas próximas corridas`);
        }
    };

    return (
        <div className={`delivery-card delivery-card--${delivery.status} ${hasPriority ? 'delivery-card--priority' : ''}`}>
            <div className="delivery-card__header">
                <StatusBadge status={delivery.status} showPulse={delivery.status === 'in_transit'} />
                <span className="delivery-card__time">
                    <Clock size={14} />
                    {formatTime(delivery.createdAt)}
                </span>
                {hasPriority && user?.role === 'motoboy' && delivery.priorityMotoboyId === user.id && (
                    <span className="delivery-card__priority-badge">🌟 Prioridade</span>
                )}
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
                        <span className="label">Entregador:</span>
                        <span className="value">{delivery.motoboyName}</span>
                        {isFavorite && <Star size={16} className="delivery-card__star" fill="currentColor" />}
                    </div>
                )}

                <div className="delivery-card__value">
                    <DollarSign size={16} />
                    <span>R$ {delivery.value.toFixed(2)}</span>
                </div>

                {/* Tracking Link */}
                {delivery.trackingCode && (showTrackingLink || delivery.status !== 'completed') && (
                    <div className="delivery-card__tracking">
                        <button className="delivery-card__copy-link" onClick={copyTrackingLink}>
                            <Link2 size={16} />
                            Copiar Link de Rastreio
                        </button>
                        <span className="delivery-card__tracking-code">{delivery.trackingCode}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {(actions || (showFavoriteButton && delivery.status === 'completed' && delivery.motoboyId)) && (
                <div className="delivery-card__actions">
                    {actions}
                    {showFavoriteButton && delivery.status === 'completed' && delivery.motoboyId && (
                        <button
                            className={`btn btn--favorite ${isFavorite ? 'btn--favorite--active' : ''}`}
                            onClick={toggleFavorite}
                        >
                            <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                            {isFavorite ? 'Favorito' : 'Favoritar'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
