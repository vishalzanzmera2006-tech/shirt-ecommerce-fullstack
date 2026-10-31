import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Compass, Feather } from "lucide-react";
import "./Craftsmanship.css";

const fabrics = [
    {
        id: "giza",
        num: "01",
        name: "120s Egyptian Giza Cotton",
        tagline: "The Sovereign of Business Weaves",
        desc: "Spun from extra-long staple Egyptian fibers twisted in a 2-ply formation. Delivers an impeccably crisp drape with natural wrinkle resilience and day-long breathability.",
        weight: "140 GSM",
        weave: "2-Ply Royal Poplin",
        softness: 95,
        breathability: 90,
        structure: 98,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
        origin: "Giza Basin, Egypt",
    },
    {
        id: "linen",
        num: "02",
        name: "Pure Normandy Flax Linen",
        tagline: "Effortless Coastal Fluidity",
        desc: "Harvested from French flax fields and pre-washed with bio-enzymes to eliminate stiffness. Naturally thermal-regulating, absorbing moisture effortlessly in peak heat.",
        weight: "165 GSM",
        weave: "Open Basket Slub",
        softness: 88,
        breathability: 100,
        structure: 75,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
        origin: "Normandy, France",
    },
    {
        id: "twill",
        num: "03",
        name: "Royal Satin Twill",
        tagline: "Subtle Lustre for Evening Black-Tie",
        desc: "Woven on high-density rapier looms to create a subtle diagonal sheen. Heavy enough to drape gracefully across the chest without cling or transparency.",
        weight: "155 GSM",
        weave: "High-Lustre 2/2 Twill",
        softness: 98,
        breathability: 82,
        structure: 92,
        image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1200&auto=format&fit=crop",
        origin: "Biella, Northern Italy",
    },
    {
        id: "oxford",
        num: "04",
        name: "Vintage Heavy Oxford",
        tagline: "Rugged Elegance with Age-Defying Character",
        desc: "Characterized by its distinct basketweave texture using two warp threads over a single weft. Gets softer and more characterful with every single machine wash.",
        weight: "185 GSM",
        weave: "Heavyweight Oxford Weft",
        softness: 82,
        breathability: 86,
        structure: 100,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop",
        origin: "Lancashire Heritage Mills",
    },
];

const Craftsmanship = () => {
    const [selected, setSelected] = useState(0);
    const active = fabrics[selected];

    return (
        <section className="atelier-lab">
            {/* Top Section Header */}
            <div className="atelier-header">
                <div className="atelier-pill">
                    <Sparkles size={11} />
                    <span>TEXTILE LABORATORY</span>
                </div>
                <h2 className="atelier-title">
                    Mastery of the <em>Raw Fiber</em>
                </h2>
                <p className="atelier-subtitle">
                    Select a weave below to inspect its origin, tactile weight, and performance metrics.
                </p>
            </div>

            {/* Main Interactive Canvas */}
            <div className="atelier-container">

                {/* Left Column: Interactive Selector & Live Metrics */}
                <div className="atelier-controls">

                    {/* Weave Switcher Tabs */}
                    <div className="fabric-selector-bar">
                        {fabrics.map((item, idx) => (
                            <button
                                key={item.id}
                                className={`fabric-tab-btn ${idx === selected ? "is-selected" : ""}`}
                                onClick={() => setSelected(idx)}
                            >
                                <span className="tab-idx">0{idx + 1}</span>
                                <span className="tab-name">{item.name.split(" ")[0]} {item.name.split(" ")[1]}</span>
                            </button>
                        ))}
                    </div>

                    {/* Active Detail Canvas */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            className="fabric-detail-panel"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <span className="detail-tagline">{active.tagline}</span>
                            <h3 className="detail-heading">{active.name}</h3>
                            <p className="detail-body">{active.desc}</p>

                            {/* Spec Badges Grid */}
                            <div className="tactile-specs-grid">
                                <div className="spec-unit">
                                    <span className="spec-unit-label">WEIGHT //</span>
                                    <strong>{active.weight}</strong>
                                </div>
                                <div className="spec-unit">
                                    <span className="spec-unit-label">WEAVE //</span>
                                    <strong>{active.weave}</strong>
                                </div>
                                <div className="spec-unit">
                                    <span className="spec-unit-label">MILL ORIGIN //</span>
                                    <strong>{active.origin}</strong>
                                </div>
                            </div>

                            {/* Live Animated Performance Gauges */}
                            <div className="performance-meters">

                                <div className="meter-row">
                                    <div className="meter-label-wrap">
                                        <span><Feather size={13} /> Softness &amp; Hand-Feel</span>
                                        <strong>{active.softness}%</strong>
                                    </div>
                                    <div className="meter-track">
                                        <motion.div
                                            className="meter-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${active.softness}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                <div className="meter-row">
                                    <div className="meter-label-wrap">
                                        <span><Compass size={13} /> Airflow &amp; Breathability</span>
                                        <strong>{active.breathability}%</strong>
                                    </div>
                                    <div className="meter-track">
                                        <motion.div
                                            className="meter-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${active.breathability}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
                                        />
                                    </div>
                                </div>

                                <div className="meter-row">
                                    <div className="meter-label-wrap">
                                        <span><ShieldCheck size={13} /> Collar &amp; Cuff Structure</span>
                                        <strong>{active.structure}%</strong>
                                    </div>
                                    <div className="meter-track">
                                        <motion.div
                                            className="meter-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${active.structure}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
                                        />
                                    </div>
                                </div>

                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Column: High-Fashion Portrait Canvas */}
                <div className="atelier-visual">
                    <div className="portrait-frame">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={active.id}
                                src={active.image}
                                alt={active.name}
                                className="portrait-img"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </AnimatePresence>

                        <div className="portrait-stamp">
                            <span>AUTHENTIC TEXTILE ARCHIVE</span>
                            <strong>{active.origin}</strong>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Craftsmanship;