import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Scissors,
    Layers,
    ShieldCheck,
    Sparkles,
    ArrowRight,
    Award,
    Feather,
} from "lucide-react";
import OurPhiosophy from '../../assets/AboutUs/OurPhilosophy.png'
import SunlitTextileMillAtelier from '../../assets/AboutUs/SunlitTextileMillAtelier.png'
import "./AboutUs.css";

const AboutUs = () => {
    const navigate = useNavigate();

    const milestones = [
        {
            figure: "22",
            suffix: "SPI",
            label: "Stitches Per Inch",
            desc: "Double the industry density for unyielding seam integrity.",
        },
        {
            figure: "100%",
            suffix: "",
            label: "Egyptian Giza Cotton",
            desc: "Extra-long staple yarn picked exclusively along the Nile Delta.",
        },
        {
            figure: "48",
            suffix: "Hrs",
            label: "Artisanal Benchwork",
            desc: "Each commission rests, cures, and passes a 14-point audit.",
        },
        {
            figure: "Zero",
            suffix: "",
            label: "Synthetic Interlinings",
            desc: "Pure horsehair and natural cotton woven chest canvas.",
        },
    ];

    const pillars = [
        {
            icon: <Scissors size={20} />,
            title: "Hand-Cut Patterns",
            desc: "We balance stripes, checks, and grainlines across the split-yoke manually using surgical steel shears.",
        },
        {
            icon: <Feather size={20} />,
            title: "Mother-of-Pearl Nacre",
            desc: "Carved from genuine Pinctada Maxima shells—cross-stitched with reinforced shanks that never shatter in laundry cycles.",
        },
        {
            icon: <Layers size={20} />,
            title: "Single-Needle French Seams",
            desc: "Raw edges are folded inwards and enclosed with 3mm single-needle runs, ensuring silk-smooth contact against bare skin.",
        },
        {
            icon: <Award size={20} />,
            title: "Floating Collar Canvas",
            desc: "Non-fused interlinings allow the collar to roll naturally instead of stiffening cardboard-flat under formal neckwear.",
        },
    ];

    return (
        <div className="about-page">
            <div className="about-container">
                {/* Hero Section */}
                <header className="about-hero">
                    <div className="about-kicker">
                        <Sparkles size={12} />
                        <span>ESTABLISHED 2026 • THE SARTORIAL STANDARD</span>
                    </div>
                    <h1 className="about-heading">
                        Rejecting Fast Fashion.
                        <br />
                        Reviving Pure Bespoke Tailoring.
                    </h1>
                    <p className="about-subtext">
                        Crest &amp; Collar was built to challenge mass-produced, throwaway
                        shirting. We engineer custom-tailored dress shirts built on Savile
                        Row heritage, artisanal patience, and uncompromised natural textiles.
                    </p>
                    <div className="about-divider"></div>
                </header>

                {/* Brand Narrative Block */}
                <section className="about-story-grid">
                    <div className="about-story-img-wrap">
                        <img
                            src={OurPhiosophy}
                            alt="Tailor cutting pattern on table"
                            className="about-story-img"
                        />
                        <span className="story-badge">CUTTING ROOM ARCHIVE</span>
                    </div>

                    <div className="about-story-content">
                        <span className="section-tag">OUR PHILOSOPHY</span>
                        <h2>The Shirt as a Piece of Structural Engineering</h2>
                        <p>
                            Most ready-to-wear garments are built on production quotas, glued
                            fused collars, and synthetic blends that warp after two dozen
                            washes. We believe true luxury is tactile, honest, and resilient.
                        </p>
                        <p>
                            From drafting the original chest draft to mounting genuine
                            mother-of-pearl buttons with hand-wound shanks, every shirt that
                            leaves our workbench is treated as a long-term bespoke commission.
                        </p>

                        <div className="quote-box">
                            <blockquote>
                                "A properly tailored shirt should balance across your shoulders
                                without resistance, moving like an unforced second skin."
                            </blockquote>
                            <span className="quote-author">— Master Cutter, Crest &amp; Collar</span>
                        </div>
                    </div>
                </section>

                {/* Numeric Precision Metrics */}
                <section className="about-metrics-strip">
                    <div className="metrics-grid">
                        {milestones.map((m, idx) => (
                            <div className="metric-cell" key={idx}>
                                <div className="metric-number">
                                    {m.figure}
                                    {m.suffix && <span className="metric-suffix">{m.suffix}</span>}
                                </div>
                                <h4 className="metric-label">{m.label}</h4>
                                <p className="metric-desc">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4 Pillars of Craftsmanship */}
                <section className="about-pillars">
                    <div className="pillars-header">
                        <span className="section-tag">THE ANATOMY</span>
                        <h2>Four Tenets of Tailored Excellence</h2>
                        <p>Every seam, collar point, and buttonhole serves a distinct structural function.</p>
                    </div>

                    <div className="pillars-grid">
                        {pillars.map((p, idx) => (
                            <div className="pillar-card" key={idx}>
                                <div className="pillar-icon">{p.icon}</div>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Fabric Heritage Callout */}
                <section className="about-fabric-strip">
                    <div className="fabric-content">
                        <span className="section-tag-light">RARE SOURCING</span>
                        <h2>Milled by Generations, Finished for You</h2>
                        <p>
                            We bypass wholesalers to work straight with legacy mills across
                            Biella, Northern Italy, and the Nile Delta. Pure 100% two-fold
                            cotton, open-weave Irish flax, and brushed twills—certified zero
                            microplastics.
                        </p>
                        <button
                            type="button"
                            className="about-explore-btn"
                            onClick={() => navigate("/newin")}
                        >
                            <span>EXPLORE THE COLLECTION</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="fabric-img-wrap">
                        <img
                            src={SunlitTextileMillAtelier}
                            alt="Folded luxury tailored cotton shirt"
                        />
                    </div>
                </section>

                {/* Commitment Banner */}
                <section className="about-guarantee">
                    <div className="guarantee-inner">
                        <ShieldCheck size={28} />
                        <div className="guarantee-text">
                            <h3>The 30-Day Atelier Fit Guarantee</h3>
                            <p>
                                If your bespoke commission requires fine-tuning, our tailors will
                                alter or recut your garment complimentary within 30 days of receipt.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;