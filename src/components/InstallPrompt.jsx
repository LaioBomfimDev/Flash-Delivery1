import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './InstallPrompt.css';

export default function InstallPrompt() {
    const { isInstallable, promptInstall } = useInstallPrompt();
    const [isVisible, setIsVisible] = useState(true);

    if (!isInstallable || !isVisible) return null;

    return (
        <div className="install-prompt animate-slide-up">
            <div className="install-prompt__content">
                <div className="install-prompt__icon">
                    <Download size={24} />
                </div>
                <div className="install-prompt__text">
                    <span className="install-prompt__title">Instalar App</span>
                    <span className="install-prompt__desc">Adicione à tela inicial para acesso rápido</span>
                </div>
            </div>
            <div className="install-prompt__actions">
                <button className="install-prompt__btn" onClick={promptInstall}>
                    Instalar
                </button>
                <button
                    className="install-prompt__close"
                    onClick={() => setIsVisible(false)}
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
