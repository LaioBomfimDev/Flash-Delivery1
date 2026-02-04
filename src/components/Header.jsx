import { Zap, LogOut, User, Menu, X, Users, Bike } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDelivery } from '../context/DeliveryContext';
import './Header.css';

const roleLabels = {
    merchant: 'Parceiro Empresário',
    motoboy: 'Parceiro Entregador',
    admin: 'Administrador',
};

const navItems = {
    merchant: [
        { path: '/merchant', label: 'Início' },
        { path: '/merchant/history', label: 'Histórico' },
    ],
    motoboy: [
        { path: '/motoboy', label: 'Corridas' },
        { path: '/motoboy/history', label: 'Ganhos' },
    ],
    admin: [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/users', label: 'Usuários' },
        { path: '/admin/deliveries', label: 'Entregas' },
    ],
};

export default function Header() {
    const { user, logout } = useAuth();
    const { merchants, motoboys } = useDelivery();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const items = navItems[user?.role] || [];

    // Calculate online counts
    const onlineMotoboys = motoboys?.filter(m => m.active)?.length || 0;
    const onlineMerchants = merchants?.filter(m => m.subscriptionPaid)?.length || 0;

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__brand" onClick={() => navigate('/')}>
                    <div className="header__logo">
                        <Zap className="header__logo-icon" />
                    </div>
                    <span className="header__title">Flash Catu</span>
                </div>

                {/* Online Status - Visible to all */}
                <div className="header__online-status">
                    <div className="header__online-item header__online-item--motoboy">
                        <Bike size={16} />
                        <span>{onlineMotoboys} Entregadores</span>
                    </div>
                    <div className="header__online-item header__online-item--merchant">
                        <Users size={16} />
                        <span>{onlineMerchants} Empresários</span>
                    </div>
                </div>

                <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
                    {items.map((item) => (
                        <button
                            key={item.path}
                            className={`header__nav-item ${location.pathname === item.path ? 'header__nav-item--active' : ''}`}
                            onClick={() => {
                                navigate(item.path);
                                setMobileMenuOpen(false);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="header__user">
                    <div className="header__user-info">
                        <User size={18} />
                        <div className="header__user-details">
                            <span className="header__user-name">{user?.name}</span>
                            <span className="header__user-role">{roleLabels[user?.role]}</span>
                        </div>
                    </div>

                    <button className="header__logout" onClick={handleLogout} title="Sair">
                        <LogOut size={20} />
                    </button>
                </div>

                <button
                    className="header__mobile-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}
