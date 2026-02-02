import { Zap } from 'lucide-react';
import './LightningButton.css';

export default function LightningButton({ onClick, disabled, children, size = 'large', variant = 'primary' }) {
    return (
        <button
            className={`lightning-btn lightning-btn--${size} lightning-btn--${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span className="lightning-btn__glow"></span>
            <span className="lightning-btn__content">
                <Zap className="lightning-btn__icon" />
                <span className="lightning-btn__text">{children}</span>
            </span>
        </button>
    );
}
