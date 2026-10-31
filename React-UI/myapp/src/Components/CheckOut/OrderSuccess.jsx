import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Check,
    ShieldCheck,
    PackageCheck,
    Truck,
    Scissors,
    ArrowRight,
    ShoppingBag,
    Sparkles,
    Copy,
    CheckCheck,
    Package,
} from "lucide-react";
import confetti from "canvas-confetti";
import "./OrderSuccess.css";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // State mathi ID levanu athva fallback ID
    const rawId = location.state?.orderId || "CREST-" + Math.floor(100000 + Math.random() * 900000);
    const displayId = String(rawId).slice(-8).toUpperCase();

    // Gentle celebration burst on arrival
    useEffect(() => {
        try {
            confetti({
                particleCount: 45,
                spread: 60,
                origin: { y: 0.6 },
                colors: ["#0f172a", "#d4af37", "#94a3b8"],
            });
        } catch {
            // safe fallback if canvas-confetti is not installed
        }
    }, []);

    const handleCopyId = () => {
        try {
            navigator.clipboard.writeText(rawId);
            setCopied(true);
            toast.success("Order reference copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy order reference");
        }
    };

    return (
        <div className="os-wrapper">
            <div className="os-card">
                {/* Brand Accent Bar */}
                <div className="os-gold-ribbon"></div>

                {/* Animated Badge */}
                <div className="os-badge-box">
                    <div className="os-badge-pulse"></div>
                    <div className="os-badge-core">
                        <Check size={26} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Atelier Header */}
                <div className="os-header">
                    <div className="os-kicker">
                        <Sparkles size={11} />
                        <span>BESPOKE COMMISSION LOGGED</span>
                    </div>
                    <h1 className="os-title">Thank You For Your Patronage</h1>
                    <p className="os-subtitle">
                        Your artisanal garment selection has been secured. Our master cutters and tailors are preparing your dispatch queue.
                    </p>
                </div>

                {/* Dynamic Reference Bar */}
                <div className="os-ref-panel">
                    <div className="os-ref-col">
                        <span className="os-label">ORDER REFERENCE</span>
                        <div className="os-id-group">
                            <span className="os-id-val">#CC-{displayId}</span>
                            <button
                                type="button"
                                className="os-copy-btn"
                                onClick={handleCopyId}
                                title="Copy Reference"
                            >
                                {copied ? <CheckCheck size={13} color="#059669" /> : <Copy size={13} />}
                            </button>
                        </div>
                    </div>

                    <div className="os-ref-divider"></div>

                    <div className="os-ref-col">
                        <span className="os-label">COMPLIMENTARY TRANSIT</span>
                        <span className="os-val">Express Courier (3–5 Working Days)</span>
                    </div>
                </div>

                {/* 4-Step Craft Timeline */}
                <div className="os-timeline">
                    <div className="os-timeline-step active">
                        <div className="os-step-bubble">
                            <Scissors size={14} />
                        </div>
                        <span className="os-step-name">Pattern Cut</span>
                        <span className="os-step-sub">Confirmed</span>
                    </div>

                    <div className="os-timeline-line active"></div>

                    <div className="os-timeline-step pending">
                        <div className="os-step-bubble">
                            <PackageCheck size={14} />
                        </div>
                        <span className="os-step-name">Signature Boxing</span>
                        <span className="os-step-sub">Queue</span>
                    </div>

                    <div className="os-timeline-line"></div>

                    <div className="os-timeline-step pending">
                        <div className="os-step-bubble">
                            <Truck size={14} />
                        </div>
                        <span className="os-step-name">Dispatched</span>
                        <span className="os-step-sub">Trackable</span>
                    </div>

                    <div className="os-timeline-line"></div>

                    <div className="os-timeline-step pending">
                        <div className="os-step-bubble">
                            <ShieldCheck size={14} />
                        </div>
                        <span className="os-step-name">Delivered</span>
                        <span className="os-step-sub">Doorstep</span>
                    </div>
                </div>

                {/* Luxury Packing Note */}
                <div className="os-perk-callout">
                    <div className="os-perk-item">
                        <span className="os-perk-dot"></span>
                        <span>Archival Cedarwood Hanger &amp; Suit Bag included</span>
                    </div>
                    <div className="os-perk-item">
                        <span className="os-perk-dot"></span>
                        <span>Hand-pressed and certified by Quality Atelier</span>
                    </div>
                </div>

                {/* Action Controls: Dual Buttons */}
                <div className="os-actions">
                    <button
                        type="button"
                        className="os-btn-primary"
                        onClick={() => navigate("/myorder")}
                    >
                        <Package size={16} />
                        <span>VIEW MY ORDERS</span>
                    </button>

                    <button
                        type="button"
                        className="os-btn-secondary"
                        onClick={() => navigate("/newin")}
                    >
                        <ShoppingBag size={15} />
                        <span>CONTINUE BROWSING</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                <p className="os-footer-note">
                    A receipt breakdown and SMS track link have been forwarded to your registered contact.
                </p>
            </div>
        </div>
    );
};

export default OrderSuccess;