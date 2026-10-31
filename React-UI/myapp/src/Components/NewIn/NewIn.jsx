import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import NewArrivalsPage from "../../assets/NewInPage/NewArrivalsPage.jpg"

// Components
import ProductCard from "../ProductCard";
import ProductFilterBar from "../ProductFilterBar";
import QuickView from "../QuickView/QuickView";

import "./NewIn.css";

const CATEGORIES = [
    "All Fabrics",
    "Pure Linen",
    "Oxford Cotton",
    "Premium Twill",
    "Satin Silk",
    "Overshirt",
];

const NewIn = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedFilter, setSelectedFilter] = useState("All Fabrics");
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedFit, setSelectedFit] = useState("All");
    const [selectedPattern, setSelectedPattern] = useState("All");
    const [selectedPriceRange, setSelectedPriceRange] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Layout & Modal States
    const [gridCols, setGridCols] = useState(4);
    const [activeQuickView, setActiveQuickView] = useState(null);

    // Fetch New In Garments
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:3000/shirt/showAll");
                const allItems = res.data?.data || [];

                // Filter new items or fallback to all
                const newItems = allItems.filter(
                    (item) =>
                        item.isNewArrival === true ||
                        item.isNewArrival === "true" ||
                        item.badge === "NEW ARRIVAL" ||
                        item.badge === "NEW IN"
                );

                setProducts(newItems.length > 0 ? newItems : allItems);
            } catch (err) {
                console.error("New In Fetch Error:", err);
                toast.error("Unable to load new seasonal arrivals. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    // Multi-Level Filter & Sorting Engine
    const processedProducts = useMemo(() => {
        return products
            .filter((p) => {
                // 1. Fabric Category
                if (selectedFilter !== "All Fabrics" && p.category !== selectedFilter) {
                    return false;
                }

                // 2. Size Check
                if (selectedSize !== "All") {
                    let sizes = [];
                    if (Array.isArray(p.sizes)) {
                        sizes = p.sizes;
                    } else if (typeof p.sizes === "string") {
                        try {
                            sizes = JSON.parse(p.sizes);
                        } catch {
                            sizes = p.sizes.replace(/[\[\]"]/g, "").split(",");
                        }
                    }
                    const normalizedSizes = sizes.map((s) => String(s).trim().toUpperCase());
                    if (!normalizedSizes.includes(selectedSize.toUpperCase())) return false;
                }

                // 3. Fit Check
                if (selectedFit !== "All" && p.fit && p.fit !== selectedFit) {
                    return false;
                }

                // 4. Pattern Check
                if (selectedPattern !== "All" && p.pattern && p.pattern !== selectedPattern) {
                    return false;
                }

                // 5. Price Bracket Check
                const price = Number(p.salePrice || p.originalPrice || 0);
                if (selectedPriceRange === "under-2500" && price >= 2500) return false;
                if (selectedPriceRange === "2500-4000" && (price < 2500 || price > 4000)) return false;
                if (selectedPriceRange === "above-4000" && price <= 4000) return false;

                return true;
            })
            .sort((a, b) => {
                const priceA = Number(a.salePrice || a.originalPrice || 0);
                const priceB = Number(b.salePrice || b.originalPrice || 0);

                if (sortBy === "price-low") return priceA - priceB;
                if (sortBy === "price-high") return priceB - priceA;
                if (sortBy === "bestseller") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
                if (sortBy === "name-az") return (a.name || "").localeCompare(b.name || "");
                if (sortBy === "discount") {
                    const discA = a.discount ? parseInt(a.discount, 10) : 0;
                    const discB = b.discount ? parseInt(b.discount, 10) : 0;
                    return discB - discA;
                }
                return 0; // Default newest
            });
    }, [
        products,
        selectedFilter,
        selectedSize,
        selectedFit,
        selectedPattern,
        selectedPriceRange,
        sortBy,
    ]);

    // Check if any filter is active
    const hasActiveFilters =
        selectedFilter !== "All Fabrics" ||
        selectedSize !== "All" ||
        selectedFit !== "All" ||
        selectedPattern !== "All" ||
        selectedPriceRange !== "All";

    // Reset all filters
    const handleResetFilters = () => {
        setSelectedFilter("All Fabrics");
        setSelectedSize("All");
        setSelectedFit("All");
        setSelectedPattern("All");
        setSelectedPriceRange("All");
        setSortBy("newest");
    };

    return (
        <section className="newin-section">
            {/* 1. TOP LOOKBOOK HERO BANNER */}
            <div className="newin-hero-banner">
                <img
                    src={NewArrivalsPage}
                    alt="New In Atelier"
                    className="newin-hero-img"
                />
                <div className="newin-hero-overlay">
                    <div className="newin-hero-content">
                        <span className="hero-kicker">
                            <Sparkles size={12} /> AUTUMN / WINTER '26 CAPSULE
                        </span>
                        <h1 className="hero-heading">The New In Edit</h1>
                        <p className="hero-desc">
                            Pristine tailored silhouettes sculpted from high-count European flax &amp; Giza twill.
                        </p>
                    </div>
                </div>
            </div>

            <div className="newin-container">
                {/* 2. REUSABLE STICKY MULTI-FILTER BAR */}
                <ProductFilterBar
                    categories={CATEGORIES}
                    selectedFilter={selectedFilter}
                    onSelectFilter={setSelectedFilter}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    selectedFit={selectedFit}
                    onSelectFit={setSelectedFit}
                    selectedPattern={selectedPattern}
                    onSelectPattern={setSelectedPattern}
                    selectedPriceRange={selectedPriceRange}
                    onSelectPriceRange={setSelectedPriceRange}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    gridCols={gridCols}
                    onGridChange={setGridCols}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* 3. PRODUCT GRID */}
                {loading ? (
                    <div className="newin-loading">
                        <div className="newin-spinner"></div>
                        <span>Curating new seasonal cuts...</span>
                    </div>
                ) : processedProducts.length === 0 ? (
                    <div className="newin-empty">
                        <p>No garments match your selected criteria.</p>
                        <button
                            type="button"
                            className="newin-clear-btn"
                            onClick={handleResetFilters}
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className={`newin-grid cols-${gridCols}`}>
                        {processedProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                badge={product.badge || "NEW IN"}
                                onQuickView={setActiveQuickView}
                            />
                        ))}
                    </div>
                )}
            </div>

            

            {/* 4. QUICK VIEW MODAL */}
            {activeQuickView && (
                <QuickView
                    product={activeQuickView}
                    onClose={() => setActiveQuickView(null)}
                />
            )}


        </section>
    );
};

export default NewIn;