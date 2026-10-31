import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles, ChevronDown } from "lucide-react";

// Components
import ProductCard from "./ProductCard";
import ProductFilterBar from "./ProductFilterBar";
import QuickView from "./QuickView/QuickView";

import "./ShirtsCategory.css";

const CATEGORIES = [
    "All Fabrics",
    "Pure Linen",
    "Oxford Cotton",
    "Premium Twill",
    "Satin Silk",
    "Overshirt",
];

const ShirtsCategory = ({
    categoryName = "Formal Shirts",
    categoryBannerImg = null
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("All Fabrics");
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedFit, setSelectedFit] = useState("All");
    const [selectedPattern, setSelectedPattern] = useState("All");
    const [selectedPriceRange, setSelectedPriceRange] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Layout & QuickView States
    const [gridCols, setGridCols] = useState(4);
    const [activeQuickView, setActiveQuickView] = useState(null);

    // 1. Fetch Garments from Backend
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://shirt-backend-33gt.onrender.com/shirt/showAll");
                const allItems = res.data?.data || [];

                const targetSlug = categoryName.toLowerCase();
                const filtered = allItems.filter((item) => {
                    const itemCat = (item.category || "").toLowerCase();
                    const itemName = (item.name || "").toLowerCase();
                    const itemFabric = (item.fabric || "").toLowerCase();
                    const itemFit = (item.fit || "").toLowerCase();

                    if (targetSlug.includes("formal")) return itemCat.includes("formal") || itemName.includes("formal");
                    if (targetSlug.includes("casual")) return itemCat.includes("casual") || itemName.includes("casual");
                    if (targetSlug.includes("linen")) return itemFabric.includes("linen") || itemCat.includes("linen");
                    if (targetSlug.includes("cotton")) return itemFabric.includes("cotton") || itemCat.includes("cotton");
                    if (targetSlug.includes("oxford")) return itemFabric.includes("oxford") || itemCat.includes("oxford");
                    if (targetSlug.includes("giza")) return itemFabric.includes("giza") || itemName.includes("giza");
                    if (targetSlug.includes("slim")) return itemFit.includes("slim") || itemName.includes("slim");
                    if (targetSlug.includes("all")) return true;

                    return itemCat.includes(targetSlug) || itemName.includes(targetSlug);
                });

                setProducts(filtered);
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Garments load karva ma bhul thai. Farithi prayas karo.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryName]);

    // 2. Multi-Filter & Live Search Engine
    const processedProducts = useMemo(() => {
        return products
            .filter((p) => {
                if (searchQuery.trim() !== "") {
                    const q = searchQuery.toLowerCase();
                    const match =
                        (p.name || "").toLowerCase().includes(q) ||
                        (p.category || "").toLowerCase().includes(q) ||
                        (p.fabric || "").toLowerCase().includes(q) ||
                        (p.fit || "").toLowerCase().includes(q);
                    if (!match) return false;
                }

                if (selectedFilter !== "All Fabrics" && p.category !== selectedFilter) {
                    return false;
                }

                if (selectedSize !== "All") {
                    let sizes = [];
                    if (Array.isArray(p.sizes)) sizes = p.sizes;
                    else if (typeof p.sizes === "string") {
                        try { sizes = JSON.parse(p.sizes); }
                        catch { sizes = p.sizes.replace(/[\[\]"]/g, "").split(","); }
                    }
                    const normalized = sizes.map((s) => String(s).trim().toUpperCase());
                    if (!normalized.includes(selectedSize.toUpperCase())) return false;
                }

                if (selectedFit !== "All" && p.fit && p.fit !== selectedFit) {
                    return false;
                }

                if (selectedPattern !== "All" && p.pattern && p.pattern !== selectedPattern) {
                    return false;
                }

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
                return 0;
            });
    }, [
        products,
        searchQuery,
        selectedFilter,
        selectedSize,
        selectedFit,
        selectedPattern,
        selectedPriceRange,
        sortBy,
    ]);

    const hasActiveFilters =
        selectedFilter !== "All Fabrics" ||
        selectedSize !== "All" ||
        selectedFit !== "All" ||
        selectedPattern !== "All" ||
        selectedPriceRange !== "All" ||
        Boolean(searchQuery);

    const handleResetFilters = () => {
        setSelectedFilter("All Fabrics");
        setSelectedSize("All");
        setSelectedFit("All");
        setSelectedPattern("All");
        setSelectedPriceRange("All");
        setSortBy("newest");
        setSearchQuery("");
    };

    return (
        <section className="category-section">
            {/* Top Lookbook Banner */}
            <div className="category-hero-banner">
                {categoryBannerImg && (
                    <img
                        src={categoryBannerImg}
                        alt={categoryName}
                        className="category-hero-img"
                    />
                )}
                <div className="category-hero-overlay">
                    {/* Left Side Top Filter Sort Dropdown */}
                    <div className="category-top-left-sort">
                        <span className="top-sort-label">Sort By</span>
                        <div className="top-sort-box">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="top-sort-select"
                            >
                                <option value="newest">Latest Arrivals</option>
                                <option value="bestseller">Best Sellers</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="discount">Highest Discount</option>
                                <option value="name-az">Name: A to Z</option>
                            </select>
                            <ChevronDown size={14} className="top-sort-chevron" />
                        </div>
                    </div>

                    <div className="category-hero-content">
                        <span className="hero-kicker">
                            <Sparkles size={12} /> CREST &amp; COLLAR ATELIER
                        </span>
                        <h1 className="hero-heading">{categoryName}</h1>
                        <p className="hero-desc">
                            Meticulously tailored cuts sculpted from the finest high-thread-count yarns.
                        </p>
                    </div>
                </div>
            </div>

            <div className="category-container">
                {/* Product Filter Bar */}
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
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Product Grid */}
                {loading ? (
                    <div className="category-loading">
                        <div className="category-spinner"></div>
                        <span>Curating bespoke garments...</span>
                    </div>
                ) : processedProducts.length === 0 ? (
                    <div className="category-empty">
                        <p>No garments match your selected criteria.</p>
                        <button
                            type="button"
                            className="category-clear-btn"
                            onClick={handleResetFilters}
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className={`category-grid cols-${gridCols}`}>
                        {processedProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                badge={product.badge || "EXCLUSIVE"}
                                onQuickView={setActiveQuickView}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick View Modal */}
            {activeQuickView && (
                <QuickView
                    product={activeQuickView}
                    onClose={() => setActiveQuickView(null)}
                />
            )}
        </section>
    );
};

export default ShirtsCategory;