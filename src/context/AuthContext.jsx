import { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers, mockMerchants } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted user
        const savedUser = localStorage.getItem('flashcatu_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        const userData = demoUsers[role];
        if (userData) {
            // Check if merchant is active (has paid subscription)
            if (role === 'merchant') {
                const merchant = mockMerchants.find(m => m.id === userData.id);
                userData.subscriptionActive = merchant?.subscriptionPaid ?? false;
            }
            setUser(userData);
            localStorage.setItem('flashcatu_user', JSON.stringify(userData));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('flashcatu_user');
    };

    const updateSubscriptionStatus = (isActive) => {
        if (user && user.role === 'merchant') {
            const updatedUser = { ...user, subscriptionActive: isActive };
            setUser(updatedUser);
            localStorage.setItem('flashcatu_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateSubscriptionStatus,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
