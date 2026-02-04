import { useState } from 'react';
import { Zap, Send, X, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import { useNotification } from '../../context/NotificationContext';
import Header from '../../components/Header';
import LightningButton from '../../components/LightningButton';
import DeliveryCard from '../../components/DeliveryCard';
import StatusBadge from '../../components/StatusBadge';
import LiveMap from '../../components/LiveMap';
import WhatsAppButton from '../../components/WhatsAppButton';
import './MerchantHome.css';

export default function MerchantHome() {
    const { user } = useAuth();
    const { getMerchantDeliveries, createDelivery, merchants, deliveries } = useDelivery();
    const { notify } = useNotification();
    const [showModal, setShowModal] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const merchantData = merchants.find(m => m.id === user?.id);
    const canRequest = merchantData?.subscriptionPaid !== false;
    const myDeliveries = getMerchantDeliveries(user?.id);
    const activeDeliveries = myDeliveries.filter(d => d.status !== 'completed' && d.status !== 'cancelled');

    const handleRequestDelivery = async () => {
        if (!address.trim()) return;

        setLoading(true);

        // Extract address from Google Maps link if present
        let cleanAddress = address;
        if (address.includes('google.com/maps') || address.includes('goo.gl')) {
            cleanAddress = `Link Maps: ${address}`;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        createDelivery(
            user.id,
            user.name,
            merchantData?.address || 'Endereço do comerciante',
            cleanAddress
        );

        setAddress('');
        setLoading(false);
        setShowModal(false);

        // Show notification that delivery was requested
        notify.deliveryRequested();
    };

    return (
        <>
            <Header />
            <main className="merchant-home page">
                <div className="merchant-home__hero">
                    {canRequest ? (
                        <>
                            <h1 className="merchant-home__title">
                                Olá, <span className="text-gold">{user?.name}</span>
                            </h1>
                            <p className="merchant-home__subtitle">
                                Solicite uma entrega rápida clicando no botão abaixo
                            </p>

                            <div className="merchant-home__cta">
                                <LightningButton onClick={() => setShowModal(true)} size="large">
                                    Chamar Flash
                                </LightningButton>
                            </div>
                        </>
                    ) : (
                        <div className="merchant-home__blocked">
                            <div className="merchant-home__blocked-icon">
                                <Zap size={48} />
                            </div>
                            <h2>Assinatura Inativa</h2>
                            <p>Entre em contato com o administrador para renovar sua assinatura semanal de R$ 15,00</p>
                        </div>
                    )}
                </div>

                {/* Live Map */}
                <section className="merchant-home__section">
                    <LiveMap deliveries={deliveries} height="350px" />
                </section>

                {/* Active Deliveries */}
                <section className="merchant-home__section">
                    <h2 className="merchant-home__section-title">
                        Suas Entregas
                        {activeDeliveries.length > 0 && (
                            <span className="merchant-home__badge">{activeDeliveries.length}</span>
                        )}
                    </h2>

                    {activeDeliveries.length === 0 ? (
                        <div className="merchant-home__empty">
                            <Zap size={32} />
                            <p>Nenhuma entrega ativa no momento</p>
                        </div>
                    ) : (
                        <div className="merchant-home__deliveries">
                            {activeDeliveries.map(delivery => (
                                <DeliveryCard
                                    key={delivery.id}
                                    delivery={delivery}
                                    showMerchant={false}
                                    showTrackingLink={true}
                                    showFavoriteButton={delivery.status === 'completed'}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent History */}
                <section className="merchant-home__section">
                    <h2 className="merchant-home__section-title">Entregas Recentes</h2>
                    <div className="merchant-home__history">
                        {myDeliveries.filter(d => d.status === 'completed').slice(0, 5).map(delivery => (
                            <div key={delivery.id} className="merchant-home__history-item">
                                <div className="merchant-home__history-info">
                                    <span className="merchant-home__history-address">{delivery.deliveryAddress}</span>
                                    <span className="merchant-home__history-time">
                                        {new Date(delivery.completedAt).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                                <StatusBadge status={delivery.status} />
                            </div>
                        ))}
                        {myDeliveries.filter(d => d.status === 'completed').length === 0 && (
                            <p className="text-muted text-center">Nenhuma entrega finalizada ainda</p>
                        )}
                    </div>
                </section>
            </main>

            {/* Request Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <h3>
                                <Zap size={24} />
                                Nova Entrega
                            </h3>
                            <button className="modal__close" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal__body">
                            <div className="modal__wait-notice">
                                <Clock size={20} />
                                <span>Em até <strong>10 minutos</strong> um entregador chegará ao seu estabelecimento</span>
                            </div>

                            <div className="form-group">
                                <label>Endereço de Entrega</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Cole o endereço ou link do Google Maps aqui..."
                                    rows={4}
                                />
                                <span className="form-hint">
                                    Aceita texto simples ou links do Google Maps/WhatsApp
                                </span>
                            </div>
                        </div>

                        <div className="modal__footer">
                            <button className="btn btn--secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn--primary"
                                onClick={handleRequestDelivery}
                                disabled={!address.trim() || loading}
                            >
                                <Send size={18} />
                                {loading ? 'Enviando...' : 'Solicitar Entrega'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <WhatsAppButton message="Olá! Sou comerciante parceiro do Flash Catu e preciso de ajuda." />
        </>
    );
}
