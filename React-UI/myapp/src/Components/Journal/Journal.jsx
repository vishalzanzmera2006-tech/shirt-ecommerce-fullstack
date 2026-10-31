import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
    Sparkles,
    ArrowUpRight,
    Clock,
    BookOpen,
    Compass,
    Bookmark,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HandSewnStitchingWorkshopCloseUp from '../../assets/Journal/HandSewnStitchingWorkshopCloseUp.png'
import RusticCottonandLinenAtelierFlatLay from '../../assets/Journal/RusticCottonandLinenAtelierFlatLay.png'
import StyleSatorial from '../../assets/Journal/StyleSatorial.jpg'
import MotherofPearl from '../../assets/Journal/MotherofPearl.png'
import LaunderingArchitecture from '../../assets/Journal/LaunderingArchitecture.jpg'
import "./Journal.css";

const categories = ["All Chronicles", "Artisanal Craft", "Style Satorial", "Fabric Science", "Heritage"];

const articles = [
    {
        id: 1,
        title: "The Anatomy of 22 Stitches Per Inch: Why Density Dictates Longevity",
        category: "Artisanal Craft",
        readTime: "4 min read",
        date: "Sep 2026",
        excerpt:
            "A deep interrogation into the tension calibration of Savile Row seamstresses. Discover why high thread-density seamwork repels fraying across a decade of wears.",
        image:HandSewnStitchingWorkshopCloseUp,
        featured: true,
        author: "Master Tailor Alistair Vance",
    },
    {
        id: 2,
        title: "Egyptian Giza 45 vs. Irish Flax: Decoding Breathability in Coastal Climes",
        category: "Fabric Science",
        readTime: "6 min read",
        date: "Aug 2026",
        excerpt:
            "Long-staple fibers meet open-pore weaves. How to choose between crisp cotton drape and relaxed slub linen under elevated humidity.",
        image:RusticCottonandLinenAtelierFlatLay,
        featured: false,
        author: "Elena Rostova, Textile Curator",
    },
    {
        id: 3,
        title: "The Tuxedo Code: Pleated Fronts, French Cuffs & Black-Tie Formalities",
        category: "Style Satorial",
        readTime: "5 min read",
        date: "Aug 2026",
        excerpt:
            "Demystifying collar spread proportions when matching bespoke Marcella bibs with satin lapels for nocturnal celebrations.",
        image:StyleSatorial,
        featured: false,
        author: "Marcus Sterling",
    },
    {
        id: 4,
        title: "Mother of Pearl: The Sourcing Ethics of Australian Pinctada Maxima Shells",
        category: "Heritage",
        readTime: "3 min read",
        date: "Jul 2026",
        excerpt:
            "Why real iridescent nacre buttons outlive plastic resin substitutes and elevate bespoke tailored shirting to gallery status.",
        image:MotherofPearl,
        featured: false,
        author: "Crest & Collar Archive",
    },
    {
        id: 5,
        title: "Laundering Architecture: Preserving Canvas Interlinings at Home",
        category: "Fabric Science",
        readTime: "7 min read",
        date: "Jun 2026",
        excerpt:
            "Temperature benchmarks, natural starch application, and the exact steam pressure needed to avoid collar bubbling.",
        image:LaunderingArchitecture,
        featured: false,
        author: "Artisan Care Unit",
    },
];

const containerMotion = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const itemMotion = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const Journal = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("All Chronicles");
    const [savedIds, setSavedIds] = useState([]);

    const toggleBookmark = (id, e) => {
        e.stopPropagation();
        setSavedIds((prev) => {
            const isAlreadySaved = prev.includes(id);
            if (isAlreadySaved) {
                toast.success("Dispatch removed from reading list");
                return prev.filter((i) => i !== id);
            } else {
                toast.success("Dispatch saved to reading list");
                return [...prev, id];
            }
        });
    };

    const filteredArticles =
        activeCategory === "All Chronicles"
            ? articles
            : articles.filter((art) => art.category === activeCategory);

    const heroArticle = articles.find((a) => a.featured) || articles[0];
    const gridArticles = filteredArticles.filter((a) => a.id !== heroArticle.id);

    return (
        <div className="journal-page">
            {/* Background Accent Gradients */}
            <div className="journal-glow-top"></div>

            <div className="journal-container">
                {/* Editorial Masthead Header */}
                <motion.header
                    className="journal-masthead"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="masthead-badge">
                        <Sparkles size={12} />
                        <span>THE SARTORIAL DISPATCH • VOLUME IV</span>
                    </div>
                    <h1 className="masthead-title">The Journal</h1>
                    <p className="masthead-subtitle">
                        An editorial compendium of fabric technology, tailoring heritage, and sartorial philosophy from our master cutting tables.
                    </p>

                    <div className="masthead-rule">
                        <span>EST. 2026</span>
                        <div className="masthead-line"></div>
                        <span>CREST &amp; COLLAR ATELIER</span>
                    </div>
                </motion.header>

                {/* Featured Editorial Hero */}
                {activeCategory === "All Chronicles" && (
                    <motion.article
                        className="journal-hero-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onClick={() => navigate(`/journal/${heroArticle.id}`)}
                    >
                        <div className="hero-img-box">
                            <motion.img
                                src={heroArticle.image}
                                alt={heroArticle.title}
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            />
                            <span className="hero-floating-pill">EDITOR'S SELECTION</span>
                        </div>

                        <div className="hero-content-box">
                            <div className="hero-meta-row">
                                <span className="hero-category">{heroArticle.category}</span>
                                <span className="hero-dot">•</span>
                                <span className="hero-time">
                                    <Clock size={12} /> {heroArticle.readTime}
                                </span>
                                <span className="hero-dot">•</span>
                                <span className="hero-date">{heroArticle.date}</span>
                            </div>

                            <h2 className="hero-title">{heroArticle.title}</h2>
                            <p className="hero-excerpt">{heroArticle.excerpt}</p>

                            <div className="hero-footer-row">
                                <span className="hero-author">By {heroArticle.author}</span>
                                <button
                                    type="button"
                                    className={`journal-save-btn ${savedIds.includes(heroArticle.id) ? "saved" : ""}`}
                                    onClick={(e) => toggleBookmark(heroArticle.id, e)}
                                    title="Bookmark Chronicle"
                                >
                                    <Bookmark size={15} />
                                </button>
                            </div>

                            <div className="hero-read-action">
                                <span>READ COMPLETE DISPATCH</span>
                                <ArrowUpRight size={16} />
                            </div>
                        </div>
                    </motion.article>
                )}

                {/* Interactive Category Filter Pills */}
                <div className="journal-filter-nav">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            <span>{cat}</span>
                            {activeCategory === cat && (
                                <motion.div
                                    className="filter-pill-indicator"
                                    layoutId="activeFilterIndicator"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
                <motion.div
                    className="journal-grid"
                    variants={containerMotion}
                    initial="hidden"
                    animate="visible"
                    key={activeCategory}
                >
                    <AnimatePresence mode="popLayout">
                        {(activeCategory === "All Chronicles" ? gridArticles : filteredArticles).map((post) => (
                            <motion.article
                                className="journal-card"
                                key={post.id}
                                variants={itemMotion}
                                layout
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => navigate(`/journal/${post.id}`)}
                            >
                                <div className="card-thumb-container">
                                    <img src={post.image} alt={post.title} loading="lazy" />
                                    <span className="card-category-tag">{post.category}</span>
                                    <button
                                        type="button"
                                        className={`card-bookmark-btn ${savedIds.includes(post.id) ? "saved" : ""}`}
                                        onClick={(e) => toggleBookmark(post.id, e)}
                                        aria-label="Save for later"
                                    >
                                        <Bookmark size={13} />
                                    </button>
                                </div>

                                <div className="card-body">
                                    <div className="card-meta">
                                        <span className="card-time">
                                            <Clock size={11} /> {post.readTime}
                                        </span>
                                        <span className="meta-sep">/</span>
                                        <span className="card-date">{post.date}</span>
                                    </div>

                                    <h3 className="card-title">{post.title}</h3>
                                    <p className="card-excerpt">{post.excerpt}</p>

                                    <div className="card-footer">
                                        <span className="card-author">{post.author}</span>
                                        <span className="card-read-link">
                                            <span>Examine</span>
                                            <ArrowUpRight size={13} />
                                        </span>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </div>
    );
};

export default Journal;