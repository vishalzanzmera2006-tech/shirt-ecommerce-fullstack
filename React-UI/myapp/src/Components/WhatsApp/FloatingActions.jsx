import React from "react";
import { MessageCircle } from "lucide-react";
import "./FloatingActions.css";

const WhatsAppButton = () => {
    const handleWhatsAppClick = () => {
        const phoneNumber = "918469758056";
        const defaultMsg = encodeURIComponent(
            "Hello Crest & Collar! I have an inquiry regarding bespoke shirts."
        );
        window.open(`https://wa.me/${phoneNumber}?text=${defaultMsg}`, "_blank");
    };

    return (
        <button
            type="button"
            className="floating-whatsapp-btn"
            onClick={handleWhatsAppClick}
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
        >
            <MessageCircle size={24} />
            <span className="wa-tooltip">Chat with us</span>
        </button>
    );
};

export default WhatsAppButton;