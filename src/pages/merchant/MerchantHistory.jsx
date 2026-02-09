import { Calendar, User, Zap, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import './MerchantHistory.css';

export default function MerchantHistory() {
    const { user } = useAuth();
    const { getMerchantDeliveries } = useDelivery();

    const myDeliveries = getMerchantDeliveries(user?.id) || [];

    // Show all deliveries sorted by date (newest first)
    const historyDeliveries = myDeliveries
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <>
            <Header />
            <main className="merchant-history page">
                <section className="merchant-history__section">
                    <h2 className="merchant-history__section-title">
                        <Calendar size={24} />
                        Histórico de Entregas
                    </h2>

                    {historyDeliveries.length === 0 ? (
                        <div className="merchant-history__empty">
                            <Package size={32} />
                            <p>Nenhuma entrega finalizada ainda</p>
                        </div>
                    ) : (
                        <div className="merchant-history__table-wrapper">
                            <table className="merchant-history__table">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Entregador</th>
                                        <th>Destino</th>
                                        <th>Valor</th>
                                        <th>Rastreio</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyDeliveries.map(delivery => (
                                        <tr key={delivery.id}>
                                            <td>
                                                <div className="merchant-history__date">
                                                    <span>{new Date(delivery.createdAt).toLocaleDateString('pt-BR')}</span>
                                                    <span className="text-muted">
                                                        {new Date(delivery.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {delivery.motoboyName ? (
                                                        <>
                                                            <User size={16} className="text-muted" />
                                                            {delivery.motoboyName}
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={delivery.deliveryAddress}>
                                                {delivery.deliveryAddress}
                                            </td>
                                            <td className="text-gold font-bold">R$ {delivery.value.toFixed(2)}</td>
                                            <td className="font-mono text-sm">{delivery.trackingCode}</td>
                                            <td><StatusBadge status={delivery.status} /></td>
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
