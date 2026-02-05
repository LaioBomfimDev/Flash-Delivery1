import { DollarSign, TrendingUp, Calendar, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import './MotoboyHistory.css';

export default function MotoboyHistory() {
    const { user } = useAuth();
    const { getMotoboyDeliveries, motoboys } = useDelivery();

    const motoboyData = motoboys.find(m => m.id === user?.id) || { totalEarnings: 0, totalDeliveries: 0 };
    const myDeliveries = getMotoboyDeliveries(user?.id) || [];
    const completedDeliveries = myDeliveries.filter(d => d.status === 'completed');

    const todayEarnings = completedDeliveries
        .filter(d => new Date(d.completedAt).toDateString() === new Date().toDateString())
        .reduce((sum, d) => sum + d.value, 0);

    return (
        <>
            <Header />
            <main className="motoboy-history page">
                {/* Earnings Overview */}
                <section className="motoboy-history__overview">
                    <div className="earnings-card earnings-card--main">
                        <div className="earnings-card__icon">
                            <DollarSign size={32} />
                        </div>
                        <div className="earnings-card__content">
                            <span className="earnings-card__label">Total de Ganhos</span>
                            <span className="earnings-card__value">R$ {(motoboyData?.totalEarnings || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="earnings-cards-row">
                        <div className="earnings-card">
                            <div className="earnings-card__icon earnings-card__icon--today">
                                <TrendingUp size={24} />
                            </div>
                            <div className="earnings-card__content">
                                <span className="earnings-card__label">Hoje</span>
                                <span className="earnings-card__value earnings-card__value--small">
                                    R$ {todayEarnings.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="earnings-card">
                            <div className="earnings-card__icon earnings-card__icon--deliveries">
                                <Zap size={24} />
                            </div>
                            <div className="earnings-card__content">
                                <span className="earnings-card__label">Entregas</span>
                                <span className="earnings-card__value earnings-card__value--small">
                                    {motoboyData?.totalDeliveries || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delivery History */}
                <section className="motoboy-history__section">
                    <h2 className="motoboy-history__section-title">
                        <Calendar size={20} />
                        Histórico de Entregas
                    </h2>

                    {completedDeliveries.length === 0 ? (
                        <div className="motoboy-history__empty">
                            <Zap size={32} />
                            <p>Nenhuma entrega finalizada ainda</p>
                        </div>
                    ) : (
                        <div className="motoboy-history__table-wrapper">
                            <table className="motoboy-history__table">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Comércio</th>
                                        <th>Destino</th>
                                        <th>Status</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedDeliveries.map(delivery => (
                                        <tr key={delivery.id}>
                                            <td>
                                                <div className="motoboy-history__date">
                                                    <span>{new Date(delivery.completedAt).toLocaleDateString('pt-BR')}</span>
                                                    <span className="text-muted">
                                                        {new Date(delivery.completedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{delivery.merchantName}</td>
                                            <td className="text-secondary">{delivery.deliveryAddress}</td>
                                            <td><StatusBadge status={delivery.status} /></td>
                                            <td className="text-gold font-bold">R$ {delivery.value.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
