import { useState } from 'react';
import { Navigation, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import DeliveryCard from '../../components/DeliveryCard';
import LiveMap from '../../components/LiveMap';
import WhatsAppButton from '../../components/WhatsAppButton';
import './MotoboyHome.css';

export default function MotoboyHome() {
    const { user } = useAuth();
    const { getAvailableDeliveries, getMotoboyDeliveries, acceptDelivery, completeDelivery, deliveries } = useDelivery();
    const [accepting, setAccepting] = useState(null);

    const availableDeliveries = getAvailableDeliveries();
    const myActiveDeliveries = getMotoboyDeliveries(user?.id).filter(d => d.status === 'in_transit');

    const handleAccept = async (deliveryId) => {
        setAccepting(deliveryId);
        await new Promise(resolve => setTimeout(resolve, 500));
        acceptDelivery(deliveryId, user.id, user.name);
        setAccepting(null);
    };

    const handleComplete = async (deliveryId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        completeDelivery(deliveryId);
    };

    const openInMaps = (coords) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    };

    return (
        <>
            <Header />
            <main className="motoboy-home page">
                {/* Stats */}
                <div className="motoboy-home__stats">
                    <div className="stat-card">
                        <span className="stat-card__value text-gold">{availableDeliveries.length}</span>
                        <span className="stat-card__label">Disponíveis</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-card__value text-red">{myActiveDeliveries.length}</span>
                        <span className="stat-card__label">Em andamento</span>
                    </div>
                </div>

                {/* My Active Deliveries */}
                {myActiveDeliveries.length > 0 && (
                    <section className="motoboy-home__section motoboy-home__section--active">
                        <h2 className="motoboy-home__section-title">
                            <Navigation size={20} />
                            Suas Entregas Ativas
                        </h2>
                        <div className="motoboy-home__deliveries">
                            {myActiveDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery.id}
                                    delivery={delivery}
                                    showMotoboy={false}
                                    actions={
                                        <>
                                            <button
                                                className="btn btn--gold"
                                                onClick={() => openInMaps(delivery.deliveryCoords)}
                                            >
                                                <Navigation size={18} />
                                                Abrir Maps
                                            </button>
                                            <button
                                                className="btn btn--success"
                                                onClick={() => handleComplete(delivery.id)}
                                            >
                                                <CheckCircle2 size={18} />
                                                Concluído
                                            </button>
                                        </>
                                    }
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Live Map */}
                <section className="motoboy-home__section">
                    <LiveMap deliveries={deliveries} height="300px" />
                </section>

                {/* Available Deliveries */}
                <section className="motoboy-home__section">
                    <h2 className="motoboy-home__section-title">
                        <Zap size={20} className="text-gold" />
                        Corridas Disponíveis
                    </h2>

                    {availableDeliveries.length === 0 ? (
                        <div className="motoboy-home__empty">
                            <Zap size={32} />
                            <p>Nenhuma corrida disponível no momento</p>
                            <span>Novas corridas aparecerão aqui automaticamente</span>
                        </div>
                    ) : (
                        <div className="motoboy-home__deliveries">
                            {availableDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery.id}
                                    delivery={delivery}
                                    showMotoboy={false}
                                    actions={
                                        <button
                                            className="btn btn--primary btn--full"
                                            onClick={() => handleAccept(delivery.id)}
                                            disabled={accepting === delivery.id}
                                        >
                                            <Zap size={18} />
                                            {accepting === delivery.id ? 'Aceitando...' : 'Aceitar Corrida'}
                                        </button>
                                    }
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <WhatsAppButton message="Olá! Sou motoboy do Flash Catu e preciso de ajuda." />
        </>
    );
}
