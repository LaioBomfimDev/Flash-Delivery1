import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Store, Bike, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const roles = [
    {
        id: 'merchant',
        label: 'Parceiro Flash Empresário',
        icon: Store,
        description: 'Solicite entregas e acompanhe em tempo real',
        color: 'gold'
    },
    {
        id: 'motoboy',
        label: 'Parceiro Flash Entregador',
        icon: Bike,
        description: 'Aceite corridas e ganhe R$ 7,00 por entrega',
        color: 'blue'
    },
    {
        id: 'admin',
        label: 'Administrador',
        icon: Shield,
        description: 'Gerencie usuários, entregas e relatórios',
        color: 'red'
    },
];

export default function Login() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!selectedRole) return;

        setLoading(true);

        // Simulate login delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const success = login(selectedRole);

        if (success) {
            const routes = {
                merchant: '/merchant',
                motoboy: '/motoboy',
                admin: '/admin',
            };
            navigate(routes[selectedRole]);
        }

        setLoading(false);
    };

    return (
        <div className="login">
            <div className="login__background">
                <div className="login__gradient"></div>
                <div className="login__lightning"></div>
            </div>

            <div className="login__container">
                <div className="login__header">
                    <div className="login__logo">
                        <Zap className="login__logo-icon" />
                    </div>
                    <h1 className="login__title">Flash Catu</h1>
                    <p className="login__subtitle">Sistema de Logística de Entregas</p>
                </div>

                <div className="login__form">
                    <h2 className="login__form-title">Selecione seu perfil</h2>

                    <div className="login__roles">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.id}
                                    className={`login__role login__role--${role.color} ${selectedRole === role.id ? 'login__role--selected' : ''}`}
                                    onClick={() => setSelectedRole(role.id)}
                                >
                                    <div className="login__role-icon">
                                        <Icon size={28} />
                                    </div>
                                    <div className="login__role-info">
                                        <span className="login__role-label">{role.label}</span>
                                        <span className="login__role-desc">{role.description}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="login__submit"
                        onClick={handleLogin}
                        disabled={!selectedRole || loading}
                    >
                        {loading ? (
                            <span className="login__submit-loading">Entrando...</span>
                        ) : (
                            <>
                                <span>Entrar</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <p className="login__demo-note">
                        <Zap size={14} />
                        Modo demonstração - dados simulados
                    </p>
                </div>
            </div>
        </div>
    );
}
