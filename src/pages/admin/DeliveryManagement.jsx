import { useState } from 'react';
import { Package, Search, X, RefreshCw, XCircle, Navigation } from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import StatusBadge from '../../components/StatusBadge';
import './DeliveryManagement.css';

export default function DeliveryManagement() {
    const { deliveries, motoboys, cancelDelivery, reassignDelivery } = useDelivery();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [reassignModal, setReassignModal] = useState(null);
    const [cancelModal, setCancelModal] = useState(null);

    const activeMotoboys = motoboys.filter(m => m.active);

    const filteredDeliveries = deliveries.filter(d => {
        const matchesSearch = d.merchantName.toLowerCase().includes(search.toLowerCase()) ||
            d.deliveryAddress.toLowerCase().includes(search.toLowerCase()) ||
            (d.motoboyName && d.motoboyName.toLowerCase().includes(search.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleReassign = (motoboyId) => {
        const motoboy = motoboys.find(m => m.id === motoboyId);
        if (reassignModal && motoboy) {
            reassignDelivery(reassignModal.id, motoboyId, motoboy.name);
            setReassignModal(null);
        }
    };

    const handleCancel = () => {
        if (cancelModal) {
            cancelDelivery(cancelModal.id);
            setCancelModal(null);
        }
    };

    const openInMaps = (coords) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    };

    return (
        <>
            <Header />
            <main className="delivery-management page">
                <h1 className="delivery-management__title">
                    <Package size={28} />
                    Gestão de Entregas
                </h1>

                {/* Filters */}
                <div className="delivery-management__filters">
                    <div className="delivery-management__search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por comerciante, motoboy ou endereço..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="delivery-management__status-filters">
                        {['all', 'waiting', 'in_transit', 'completed', 'cancelled'].map(status => (
                            <button
                                key={status}
                                className={`status-filter ${statusFilter === status ? 'status-filter--active' : ''} status-filter--${status}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === 'all' ? 'Todos' :
                                    status === 'waiting' ? 'Aguardando' :
                                        status === 'in_transit' ? 'Em Trânsito' :
                                            status === 'completed' ? 'Finalizados' : 'Cancelados'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Deliveries Table */}
                <div className="delivery-management__table-wrapper">
                    <table className="delivery-management__table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Comércio</th>
                                <th>Motoboy</th>
                                <th>Destino</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map(delivery => (
                                <tr key={delivery.id} className={`delivery-row delivery-row--${delivery.status}`}>
                                    <td>
                                        <div className="delivery-management__date">
                                            <span>{new Date(delivery.createdAt).toLocaleDateString('pt-BR')}</span>
                                            <span className="text-muted">
                                                {new Date(delivery.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="font-bold">{delivery.merchantName}</td>
                                    <td>{delivery.motoboyName || <span className="text-muted">Não atribuído</span>}</td>
                                    <td>
                                        <div className="delivery-management__address">
                                            <span>{delivery.deliveryAddress.slice(0, 40)}{delivery.deliveryAddress.length > 40 ? '...' : ''}</span>
                                            <button
                                                className="action-btn action-btn--maps"
                                                onClick={() => openInMaps(delivery.deliveryCoords)}
                                                title="Abrir no Maps"
                                            >
                                                <Navigation size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td><StatusBadge status={delivery.status} /></td>
                                    <td>
                                        <div className="delivery-management__actions">
                                            {(delivery.status === 'waiting' || delivery.status === 'in_transit') && (
                                                <>
                                                    <button
                                                        className="action-btn action-btn--reassign"
                                                        onClick={() => setReassignModal(delivery)}
                                                        title="Reatribuir"
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                    <button
                                                        className="action-btn action-btn--cancel"
                                                        onClick={() => setCancelModal(delivery)}
                                                        title="Cancelar"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDeliveries.length === 0 && (
                    <div className="delivery-management__empty">
                        <Package size={32} />
                        <p>Nenhuma entrega encontrada</p>
                    </div>
                )}
            </main>

            {/* Reassign Modal */}
            {reassignModal && (
                <div className="modal-overlay" onClick={() => setReassignModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <h3>
                                <RefreshCw size={24} />
                                Reatribuir Entrega
                            </h3>
                            <button className="modal__close" onClick={() => setReassignModal(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <p>Selecione um motoboy para esta entrega:</p>
                            <div className="motoboy-list">
                                {activeMotoboys.map(motoboy => (
                                    <button
                                        key={motoboy.id}
                                        className={`motoboy-option ${reassignModal.motoboyId === motoboy.id ? 'motoboy-option--current' : ''}`}
                                        onClick={() => handleReassign(motoboy.id)}
                                    >
                                        <span className="motoboy-option__name">{motoboy.name}</span>
                                        <span className="motoboy-option__plate">{motoboy.plate}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModal && (
                <div className="modal-overlay" onClick={() => setCancelModal(null)}>
                    <div className="modal modal--danger" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <h3>
                                <XCircle size={24} />
                                Cancelar Entrega
                            </h3>
                            <button className="modal__close" onClick={() => setCancelModal(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <p>Tem certeza que deseja cancelar esta entrega?</p>
                            <p className="text-muted">Comerciante: {cancelModal.merchantName}</p>
                        </div>
                        <div className="modal__footer">
                            <button className="btn btn--secondary" onClick={() => setCancelModal(null)}>
                                Voltar
                            </button>
                            <button className="btn btn--danger" onClick={handleCancel}>
                                <XCircle size={18} />
                                Cancelar Entrega
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
