import { BarChart3, Download, Users, Zap, TrendingUp } from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import LiveMap from '../../components/LiveMap';
import StatusBadge from '../../components/StatusBadge';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const { deliveries, merchants, motoboys, exportToCSV } = useDelivery();

    const todayDeliveries = deliveries.filter(d =>
        new Date(d.createdAt).toDateString() === new Date().toDateString()
    );
    const activeDeliveries = deliveries.filter(d => d.status === 'in_transit');
    const completedToday = todayDeliveries.filter(d => d.status === 'completed');
    const revenue = deliveries.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.value, 0);

    const activeMerchants = merchants.filter(m => m.subscriptionPaid).length;
    const activeMotoboys = motoboys.filter(m => m.active).length;

    return (
        <>
            <Header />
            <main className="admin-dashboard page">
                <h1 className="admin-dashboard__title">
                    <Zap size={28} className="text-gold" />
                    Dashboard Admin
                </h1>

                {/* Stats Grid */}
                <div className="admin-dashboard__stats">
                    <div className="stat-box stat-box--primary">
                        <div className="stat-box__icon">
                            <Zap size={24} />
                        </div>
                        <div className="stat-box__content">
                            <span className="stat-box__value">{activeDeliveries.length}</span>
                            <span className="stat-box__label">Em Trânsito</span>
                        </div>
                    </div>

                    <div className="stat-box stat-box--success">
                        <div className="stat-box__icon">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-box__content">
                            <span className="stat-box__value">{completedToday.length}</span>
                            <span className="stat-box__label">Hoje</span>
                        </div>
                    </div>

                    <div className="stat-box stat-box--gold">
                        <div className="stat-box__icon">
                            <Users size={24} />
                        </div>
                        <div className="stat-box__content">
                            <span className="stat-box__value">{activeMerchants}/{merchants.length}</span>
                            <span className="stat-box__label">Comerciantes</span>
                        </div>
                    </div>

                    <div className="stat-box stat-box--blue">
                        <div className="stat-box__icon">
                            <BarChart3 size={24} />
                        </div>
                        <div className="stat-box__content">
                            <span className="stat-box__value">R$ {revenue.toFixed(0)}</span>
                            <span className="stat-box__label">Receita Total</span>
                        </div>
                    </div>
                </div>

                {/* Live Map */}
                <section className="admin-dashboard__section">
                    <LiveMap deliveries={deliveries} height="400px" />
                </section>

                {/* Recent Deliveries */}
                <section className="admin-dashboard__section">
                    <div className="admin-dashboard__section-header">
                        <h2>
                            <BarChart3 size={20} />
                            Entregas Recentes
                        </h2>
                        <button className="btn btn--secondary btn--sm" onClick={exportToCSV}>
                            <Download size={16} />
                            Exportar CSV
                        </button>
                    </div>

                    <div className="admin-dashboard__table-wrapper">
                        <table className="admin-dashboard__table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Comércio</th>
                                    <th>Motoboy</th>
                                    <th>Destino</th>
                                    <th>Status</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.slice(0, 15).map(delivery => (
                                    <tr key={delivery.id}>
                                        <td>
                                            <span className="admin-dashboard__date">
                                                {new Date(delivery.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="font-bold">{delivery.merchantName}</td>
                                        <td>{delivery.motoboyName || <span className="text-muted">-</span>}</td>
                                        <td className="text-secondary">{delivery.deliveryAddress.slice(0, 30)}...</td>
                                        <td><StatusBadge status={delivery.status} /></td>
                                        <td className="text-gold font-bold">R$ {delivery.value.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quick Stats */}
                <div className="admin-dashboard__quick-stats">
                    <div className="quick-stat">
                        <span className="quick-stat__label">Motoboys Ativos</span>
                        <span className="quick-stat__value">{activeMotoboys}/{motoboys.length}</span>
                    </div>
                    <div className="quick-stat">
                        <span className="quick-stat__label">Taxa por Entrega</span>
                        <span className="quick-stat__value">R$ 7,00</span>
                    </div>
                    <div className="quick-stat">
                        <span className="quick-stat__label">Assinatura Semanal</span>
                        <span className="quick-stat__value">R$ 15,00</span>
                    </div>
                </div>
            </main>
        </>
    );
}
