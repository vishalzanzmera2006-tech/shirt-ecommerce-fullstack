import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // 👈 Added Sonner Toast
import { Search, X, ArrowUpRight, Sparkles, Loader2 } from "lucide-react";
import "./SearchModal.css";

const trendingTags = [
    "Formal",
    "Casual",
    "Egyptian Giza",
    "Linen",
    "Cotton",
    "Oxford",
    "Slim Fit"
];

export default function SearchModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Modal data fetch
    useEffect(() => {
        if (!isOpen) return;

        const fetchAllStoreProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://shirt-backend-33gt.onrender.com/shirt/showAll");
                const items = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : [];
                setAllProducts(items);
            } catch (err) {
                console.error("Search fetch error:", err);
                toast.error("Unable to load store archive for search"); 
            } finally {
                setLoading(false);
            }
        };

        fetchAllStoreProducts();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            const handleKeyDown = (e) => {
                if (e.key === "Escape") onClose();
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        } else {
            setQuery("");
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Filtering 
    const cleanQuery = query.trim().toLowerCase();
    const filteredProducts = cleanQuery === ""
        ? []
        : allProducts.filter((item) => {
            const name = (item.name || "").toLowerCase();
            const category = (item.category || "").toLowerCase();
            const fabric = (item.fabric || "").toLowerCase();
            const description = (item.description || "").toLowerCase();

            return (
                name.includes(cleanQuery) ||
                category.includes(cleanQuery) ||
                fabric.includes(cleanQuery) ||
                description.includes(cleanQuery)
            );
        });

    const handleSelectProduct = (productId) => {
        onClose();
        navigate(`/productdetails?id=${productId}`);
    };

    return (
        <div className="search-modal-backdrop" onClick={onClose}>
            <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* TOP SEARCH INPUT BAR */}
                <div className="search-input-header">
                    <Search size={20} className="search-lead-icon" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search by fabric, fit, category or shirt name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input-field"
                    />
                    {query && (
                        <button className="clear-query-btn" onClick={() => setQuery("")}>
                            CLEAR
                        </button>
                    )}
                    <button className="search-close-btn" onClick={onClose} aria-label="Close search">
                        <X size={20} />
                    </button>
                </div>

                {/* TRENDING QUICK SEARCH TAGS */}
                <div className="search-tags-row">
                    <span className="tags-label">
                        <Sparkles size={12} /> SUGGESTED:
                    </span>
                    <div className="tags-list">
                        {trendingTags.map((tag, idx) => (
                            <button
                                key={idx}
                                className={`tag-pill ${cleanQuery === tag.toLowerCase() ? "active" : ""}`}
                                onClick={() => setQuery(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RESULTS SECTION */}
                <div className="search-results-viewport">
                    {loading ? (
                        <div className="search-empty-state">
                            <Loader2 size={24} className="spinning" style={{ margin: "0 auto 8px" }} />
                            <p>Loading entire collection...</p>
                        </div>
                    ) : cleanQuery === "" ? (
                        <div className="search-empty-state">
                            <p>Type to discover tailoring masterpieces...</p>
                            <small>Press <strong>ESC</strong> to close</small>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="search-results-list">
                            {filteredProducts.map((item) => {
                                const coverImg =
                                    item.mainimage ||
                                    (Array.isArray(item.previewimages) ? item.previewimages[0] : null);

                                const price = Number(item.salePrice || item.originalPrice || 0);

                                return (
                                    <div
                                        key={item._id}
                                        className="search-result-item"
                                        onClick={() => handleSelectProduct(item._id)}
                                    >
                                        {coverImg ? (
                                            <img
                                                src={`https://shirt-backend-33gt.onrender.com/images/productimages/${coverImg}`}
                                                alt={item.name}
                                                className="result-thumb"
                                            />
                                        ) : (
                                            <div className="result-thumb-placeholder">NO IMG</div>
                                        )}

                                        <div className="result-details">
                                            <span className="result-category">
                                                {item.category || "BESPOKE TAILORED"}
                                            </span>
                                            <h4 className="result-title">{item.name}</h4>
                                            <span className="result-price">
                                                ₹{price.toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <div className="result-arrow">
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <p>No bespoke garments found matching "<strong>{query}</strong>"</p>
                            <small>Try searching for "Oxford", "Linen", or "Giza"</small>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}