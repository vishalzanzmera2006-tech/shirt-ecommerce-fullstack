import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from 'axios';
import "./Footer.css";

const Footer = () => {
    const navigate = useNavigate();

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [loading, setLoading] = useState(false); 

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();

        // Basic front validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newsletterEmail.trim())) {
            toast.error("PLEASE ENTER A VALID EMAIL ADDRESS");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('https://shirt-backend-33gt.onrender.com/accessrequest/requestaccess', {
                email: newsletterEmail.trim(),
            });

            if (res.data.success) {
                toast.success('Welcome to the Inner Circle. Access Grandet.');
                setNewsletterEmail('');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Please. Try Again!!";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <footer className="dark-luxe-footer">
                {/* Top Infinite Moving Marquee Ticker */}
                <div className="footer-marquee-strip">
                    <div className="marquee-track">
                        <span>COMPLIMENTARY WORLDWIDE DISPATCH</span>
                        <span className="marquee-dot">✦</span>
                        <span>100% GIZA LONG-STAPLE COTTON</span>
                        <span className="marquee-dot">✦</span>
                        <span>HAND-FINISHED MOTHER OF PEARL</span>
                        <span className="marquee-dot">✦</span>
                        <span>ARCHITECTURAL MINIMALISM</span>
                        <span className="marquee-dot">✦</span>
                    </div>
                </div>

                <div className="dark-footer-container">
                    {/* Top Attraction Area */}
                    <div className="dark-top-row">
                        <div className="dispatch-box">
                            <div className="live-status-pill">
                                <span className="pulse-beacon"></span>
                                <span className="status-text">
                                    ATELIER ACTIVE // EDITION 2026
                                </span>
                            </div>

                            <h2 className="dispatch-title">
                                JOIN THE <em>INNER CIRCLE.</em>
                            </h2>

                            <p className="dispatch-desc">
                                Receive private access to small-batch drops,
                                private lookbooks, and textile origin archives.
                                Strictly zero promotional spam.
                            </p>

                            <form
                                className="dark-newsletter-form"
                                onSubmit={handleNewsletterSubmit}
                            >
                                <div className="dark-input-wrap">
                                    <input
                                        type="email"
                                        placeholder="ENTER YOUR EMAIL FOR PRIVATE ACCESS"
                                        className="dark-input"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />

                                    <button
                                        type="submit"
                                        className="dark-unique-btn"
                                        disabled={loading}
                                        style={{ cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
                                    >
                                        <span className="btn-text">
                                            {loading ? "TRANSMITTING..." : "REQUEST ACCESS"}
                                        </span>
                                        <span className="btn-circle"></span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="manifesto-box">
                            <span className="meta-label">
                                ATELIER MANIFESTO
                            </span>

                            <p className="manifesto-para">
                                WE ENGINEER POSTURE, NOT TRENDS.
                                CUT FROM HIGH-DENSITY NATURAL FLAX AND
                                LONG-STAPLE GIZA COTTON. SHIRTS DESIGNED
                                TO COMMAND ATTENTION IN PURE MONOCHROME SILENCE.
                            </p>

                            <div className="craft-metrics">
                                <div className="metric-item">
                                    <span className="metric-num">160s</span>
                                    <span className="metric-lbl">Two-Ply Weave</span>
                                </div>

                                <div className="metric-divider"></div>

                                <div className="metric-item">
                                    <span className="metric-num">100%</span>
                                    <span className="metric-lbl">Organic Cotton</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Navigation Grid (Cleaned & Minimal) */}
                    <div className="dark-nav-grid">
                        <div className="dark-col">
                            <span className="col-title">COLLECTIONS</span>
                            <ul className="dark-links">
                                <li>
                                    <span onClick={() => navigate("/newin")} style={{ cursor: "pointer" }}>New In Capsule</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/bestin")} style={{ cursor: "pointer" }}>Best Sellers</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/shirts/all")} style={{ cursor: "pointer" }}>Shirts</span>
                                </li>
                            </ul>
                        </div>

                        <div className="dark-col">
                            <span className="col-title">ATELIER</span>
                            <ul className="dark-links">
                                <li>
                                    <span onClick={() => navigate("/aboutus")} style={{ cursor: "pointer" }}>Our Philosophy</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/journal")} style={{ cursor: "pointer" }}>Journal &amp; Press</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/aboutus")} style={{ cursor: "pointer" }}>Sustainability</span>
                                </li>
                            </ul>
                        </div>

                        <div className="dark-col">
                            <span className="col-title">CONCIERGE</span>
                            <ul className="dark-links">
                                <li>
                                    <span onClick={() => navigate("/myorder")} style={{ cursor: "pointer" }}>Track Dispatch</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/account")} style={{ cursor: "pointer" }}>My Account</span>
                                </li>
                                <li>
                                    <span onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>Shopping Bag</span>
                                </li>
                            </ul>
                        </div>

                        <div className="dark-col">
                            <span className="col-title">SANCTUARY</span>
                            <ul className="dark-links">
                                <li>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="external-link">
                                        Instagram <span>↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="external-link">
                                        Pinterest <span>↗</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:concierge@crestcollar.com" className="mail-highlight">
                                        concierge@crestcollar.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Giant Brand */}
                    <div className="dark-huge-brand-wrap" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <h1 className="dark-giant-logo">
                            CREST &amp; COLLAR
                        </h1>
                    </div>

                    {/* Bottom Bar */}
                    <div className="dark-bottom-bar">
                        <div className="bot-left">
                            <span>
                                © 2026 CREST &amp; COLLAR. ALL RIGHTS RESERVED.
                            </span>
                        </div>

                        <div className="bot-center">
                            <span>
                                COORDINATES // 45.4642° N, 9.1900° E (MILANO)
                            </span>
                        </div>

                        <div className="bot-right">
                            <span onClick={() => navigate("/aboutus")} style={{ cursor: "pointer" }}>PRIVACY</span>
                            <span className="dot-sep">•</span>
                            <span onClick={() => navigate("/aboutus")} style={{ cursor: "pointer" }}>TERMS</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;