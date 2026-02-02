import { MapPin, Navigation } from 'lucide-react';
import './LiveMap.css';

export default function LiveMap({ deliveries = [], height = '400px', showAllMarkers = true }) {
    // Get active deliveries (waiting or in_transit)
    const activeDeliveries = deliveries.filter(d =>
        d.status === 'waiting' || d.status === 'in_transit'
    );

    // Calculate center of all deliveries
    const getCenter = () => {
        if (activeDeliveries.length === 0) {
            return { lat: -12.3567, lng: -38.3789 }; // Default: Catu, BA
        }
        const lats = activeDeliveries.flatMap(d => [d.pickupCoords?.lat, d.deliveryCoords?.lat]).filter(Boolean);
        const lngs = activeDeliveries.flatMap(d => [d.pickupCoords?.lng, d.deliveryCoords?.lng]).filter(Boolean);
        return {
            lat: lats.reduce((a, b) => a + b, 0) / lats.length,
            lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
        };
    };

    const center = getCenter();

    // Create Google Maps embed URL
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${center.lat},${center.lng}&zoom=14&maptype=roadmap`;

    return (
        <div className="live-map" style={{ height }}>
            <div className="live-map__header">
                <h3 className="live-map__title">
                    <Navigation size={20} />
                    Mapa ao Vivo
                </h3>
                <span className="live-map__count">
                    {activeDeliveries.length} entrega{activeDeliveries.length !== 1 ? 's' : ''} ativa{activeDeliveries.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="live-map__container">
                <iframe
                    className="live-map__iframe"
                    src={mapUrl}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de Entregas"
                />

                {/* Overlay with delivery markers info */}
                <div className="live-map__overlay">
                    {activeDeliveries.slice(0, 5).map((delivery, index) => (
                        <div
                            key={delivery.id}
                            className={`live-map__marker-info live-map__marker-info--${delivery.status}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="live-map__marker-icon">
                                {delivery.status === 'waiting' ? (
                                    <MapPin size={16} />
                                ) : (
                                    <Navigation size={16} />
                                )}
                            </div>
                            <div className="live-map__marker-details">
                                <span className="live-map__marker-merchant">{delivery.merchantName}</span>
                                <span className="live-map__marker-status">
                                    {delivery.status === 'waiting' ? 'Aguardando' : `Em trânsito - ${delivery.motoboyName}`}
                                </span>
                            </div>
                        </div>
                    ))}
                    {activeDeliveries.length > 5 && (
                        <div className="live-map__more">
                            +{activeDeliveries.length - 5} outras entregas
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
