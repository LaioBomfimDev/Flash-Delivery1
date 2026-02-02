import { useState } from 'react';
import { Users, Store, Bike, Search, Trash2, ToggleLeft, ToggleRight, AlertTriangle, X } from 'lucide-react';
import { useDelivery } from '../../context/DeliveryContext';
import Header from '../../components/Header';
import './UserManagement.css';

export default function UserManagement() {
    const { merchants, motoboys, toggleUserActive, toggleMerchantSubscription, deleteUser } = useDelivery();
    const [activeTab, setActiveTab] = useState('merchants');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState(null);

    const filteredMerchants = merchants.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && m.active && m.subscriptionPaid) ||
            (filter === 'inactive' && (!m.active || !m.subscriptionPaid));
        return matchesSearch && matchesFilter;
    });

    const filteredMotoboys = motoboys.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.cpf.includes(search) ||
            m.plate.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && m.active) ||
            (filter === 'inactive' && !m.active);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = () => {
        if (deleteModal) {
            deleteUser(deleteModal.id, deleteModal.type);
            setDeleteModal(null);
        }
    };

    return (
        <>
            <Header />
            <main className="user-management page">
                <h1 className="user-management__title">
                    <Users size={28} />
                    Gestão de Usuários
                </h1>

                {/* Tabs */}
                <div className="user-management__tabs">
                    <button
                        className={`user-management__tab ${activeTab === 'merchants' ? 'user-management__tab--active' : ''}`}
                        onClick={() => setActiveTab('merchants')}
                    >
                        <Store size={20} />
                        Comerciantes ({merchants.length})
                    </button>
                    <button
                        className={`user-management__tab ${activeTab === 'motoboys' ? 'user-management__tab--active' : ''}`}
                        onClick={() => setActiveTab('motoboys')}
                    >
                        <Bike size={20} />
                        Motoboys ({motoboys.length})
                    </button>
                </div>

                {/* Filters */}
                <div className="user-management__filters">
                    <div className="user-management__search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={activeTab === 'merchants' ? 'Buscar por nome ou email...' : 'Buscar por nome, CPF ou placa...'}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="user-management__filter-btns">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </button>
                        <button
                            className={`filter-btn ${filter === 'active' ? 'filter-btn--active' : ''}`}
                            onClick={() => setFilter('active')}
                        >
                            Ativos
                        </button>
                        <button
                            className={`filter-btn ${filter === 'inactive' ? 'filter-btn--active' : ''}`}
                            onClick={() => setFilter('inactive')}
                        >
                            Inativos
                        </button>
                    </div>
                </div>

                {/* Users List */}
                {activeTab === 'merchants' ? (
                    <div className="user-management__list">
                        {filteredMerchants.map(merchant => (
                            <div key={merchant.id} className={`user-card ${!merchant.active || !merchant.subscriptionPaid ? 'user-card--inactive' : ''}`}>
                                <div className="user-card__avatar">
                                    <Store size={24} />
                                </div>
                                <div className="user-card__info">
                                    <span className="user-card__name">{merchant.name}</span>
                                    <span className="user-card__email">{merchant.email}</span>
                                    <span className="user-card__meta">{merchant.phone} • {merchant.address}</span>
                                </div>
                                <div className="user-card__status">
                                    <span className={`user-card__badge ${merchant.subscriptionPaid ? 'user-card__badge--paid' : 'user-card__badge--unpaid'}`}>
                                        {merchant.subscriptionPaid ? 'Assinatura Ativa' : 'Assinatura Inativa'}
                                    </span>
                                </div>
                                <div className="user-card__actions">
                                    <button
                                        className={`toggle-btn ${merchant.subscriptionPaid ? 'toggle-btn--on' : ''}`}
                                        onClick={() => toggleMerchantSubscription(merchant.id)}
                                        title={merchant.subscriptionPaid ? 'Desativar assinatura' : 'Ativar assinatura'}
                                    >
                                        {merchant.subscriptionPaid ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => setDeleteModal({ id: merchant.id, name: merchant.name, type: 'merchant' })}
                                        title="Excluir usuário"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="user-management__list">
                        {filteredMotoboys.map(motoboy => (
                            <div key={motoboy.id} className={`user-card ${!motoboy.active ? 'user-card--inactive' : ''}`}>
                                <div className="user-card__avatar user-card__avatar--motoboy">
                                    <Bike size={24} />
                                </div>
                                <div className="user-card__info">
                                    <span className="user-card__name">{motoboy.name}</span>
                                    <span className="user-card__email">{motoboy.email}</span>
                                    <span className="user-card__meta">
                                        CPF: {motoboy.cpf} • Placa: {motoboy.plate}
                                    </span>
                                    <span className="user-card__stats">
                                        {motoboy.totalDeliveries} entregas • R$ {motoboy.totalEarnings.toFixed(2)} total
                                    </span>
                                </div>
                                <div className="user-card__status">
                                    <span className={`user-card__badge ${motoboy.active ? 'user-card__badge--active' : 'user-card__badge--inactive'}`}>
                                        {motoboy.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <div className="user-card__actions">
                                    <button
                                        className={`toggle-btn ${motoboy.active ? 'toggle-btn--on' : ''}`}
                                        onClick={() => toggleUserActive(motoboy.id, 'motoboy')}
                                        title={motoboy.active ? 'Desativar' : 'Ativar'}
                                    >
                                        {motoboy.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => setDeleteModal({ id: motoboy.id, name: motoboy.name, type: 'motoboy' })}
                                        title="Excluir usuário"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
                    <div className="modal modal--danger" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <h3>
                                <AlertTriangle size={24} />
                                Confirmar Exclusão
                            </h3>
                            <button className="modal__close" onClick={() => setDeleteModal(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal__body">
                            <p>Tem certeza que deseja excluir <strong>{deleteModal.name}</strong>?</p>
                            <p className="text-muted">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="modal__footer">
                            <button className="btn btn--secondary" onClick={() => setDeleteModal(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn--danger" onClick={handleDelete}>
                                <Trash2 size={18} />
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
