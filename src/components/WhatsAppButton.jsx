import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const ADMIN_WHATSAPP = '5575999000000'; // Admin phone number

export default function WhatsAppButton({ message = 'Olá! Preciso de ajuda com o Flash Catu.' }) {
    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`, '_blank');
    };

    return (
        <button className="whatsapp-btn" onClick={handleClick} title="Falar com suporte">
            <MessageCircle size={28} />
        </button>
    );
}
