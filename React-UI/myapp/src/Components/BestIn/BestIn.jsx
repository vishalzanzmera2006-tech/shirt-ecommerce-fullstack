import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import BestSellersPage from "../../assets/BestIn/BestSellersPage.jpg"

// Components
import ProductCard from "../ProductCard";
import ProductFilterBar from "../ProductFilterBar";
import QuickView from "../QuickView/QuickView";

import "./BestIn.css";

const CATEGORIES = [
    "All Fabrics",
    "Pure Linen",
    "Oxford Cotton",
    "Premium Twill",
    "Satin Silk",
    "Overshirt",
];

const BestIn = () => {
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

    // ================= GET BEST SELLER PRODUCTS =================
    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "http://localhost:3000/shirt/showAll"
                );

                const allItems = res.data?.data || [];

                // Best Seller Products
                const bestSellerItems = allItems.filter(
                    (item) =>
                        item.isBestSeller === true ||
                        item.isBestSeller === "true" ||
                        item.badge === "BEST SELLER" ||
                        item.badge === "BESTSELLER"
                );

                setProducts(bestSellerItems);
            } catch (err) {
                console.error("Best Sellers Fetch Error:", err);
                toast.error("Unable to load best-selling articles. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []);

    // ================= FILTER & SORTING =================
    const processedProducts = useMemo(() => {
        return products
            .filter((p) => {
                // 1. Fabric Category
                if (
                    selectedFilter !== "All Fabrics" &&
                    p.category !== selectedFilter
                ) {
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
                            sizes = p.sizes
                                .replace(/[\[\]"]/g, "")
                                .split(",");
                        }
                    }

                    const normalizedSizes = sizes.map((s) =>
                        String(s).trim().toUpperCase()
                    );

                    if (!normalizedSizes.includes(selectedSize.toUpperCase())) {
                        return false;
                    }
                }

                // 3. Fit Check
                if (
                    selectedFit !== "All" &&
                    p.fit &&
                    p.fit !== selectedFit
                ) {
                    return false;
                }

                // 4. Pattern Check
                if (
                    selectedPattern !== "All" &&
                    p.pattern &&
                    p.pattern !== selectedPattern
                ) {
                    return false;
                }

                // 5. Price Check
                const price = Number(
                    p.salePrice ||
                    p.originalPrice ||
                    0
                );

                if (
                    selectedPriceRange === "under-2500" &&
                    price >= 2500
                ) {
                    return false;
                }

                if (
                    selectedPriceRange === "2500-4000" &&
                    (price < 2500 || price > 4000)
                ) {
                    return false;
                }

                if (
                    selectedPriceRange === "above-4000" &&
                    price <= 4000
                ) {
                    return false;
                }

                return true;
            })
            // ================= SORT =================
            .sort((a, b) => {
                const priceA = Number(
                    a.salePrice ||
                    a.originalPrice ||
                    0
                );

                const priceB = Number(
                    b.salePrice ||
                    b.originalPrice ||
                    0
                );

                if (sortBy === "price-low") {
                    return priceA - priceB;
                }

                if (sortBy === "price-high") {
                    return priceB - priceA;
                }

                if (sortBy === "bestseller") {
                    return (
                        (b.isBestSeller ? 1 : 0) -
                        (a.isBestSeller ? 1 : 0)
                    );
                }

                if (sortBy === "name-az") {
                    return (a.name || "").localeCompare(b.name || "");
                }

                if (sortBy === "discount") {
                    const discA = a.discount ? parseInt(a.discount, 10) : 0;
                    const discB = b.discount ? parseInt(b.discount, 10) : 0;
                    return discB - discA;
                }

                // Default: newest
                return 0;
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

    // ================= ACTIVE FILTER CHECK =================
    const hasActiveFilters =
        selectedFilter !== "All Fabrics" ||
        selectedSize !== "All" ||
        selectedFit !== "All" ||
        selectedPattern !== "All" ||
        selectedPriceRange !== "All";

    // ================= RESET FILTERS =================
    const handleResetFilters = () => {
        setSelectedFilter("All Fabrics");
        setSelectedSize("All");
        setSelectedFit("All");
        setSelectedPattern("All");
        setSelectedPriceRange("All");
        setSortBy("newest");
    };

    return (
        <section className="bestin-section">
            {/* ================= HERO ================= */}
            <div className="bestin-hero-banner">
                <img
                    src={BestSellersPage}
                    alt="Best Sellers"
                    className="bestin-hero-img"
                />

                <div className="bestin-hero-overlay">
                    <div className="bestin-hero-content">
                        <span className="hero-kicker">
                            <Sparkles size={12} />
                            SIGNATURE SHIRTS / BEST SELLERS
                        </span>

                        <h1 className="hero-heading">The Best Seller Edit</h1>

                        <p className="hero-desc">
                            Discover the shirts our community returns to season after season —
                            refined silhouettes, exceptional fabrics, and timeless craftsmanship.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bestin-container">
                {/* ================= FILTER BAR ================= */}
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

                {/* ================= PRODUCT GRID ================= */}
                {loading ? (
                    <div className="bestin-loading">
                        <div className="bestin-spinner"></div>
                        <span>Curating our most-loved shirts...</span>
                    </div>
                ) : processedProducts.length === 0 ? (
                    <div className="bestin-empty">
                        <p>No best-selling garments match your selected criteria.</p>

                        <button
                            type="button"
                            className="bestin-clear-btn"
                            onClick={handleResetFilters}
                        >
                            Clear All Filters
                        </button>
                    </div>
                ) : (
                    <div className={`bestin-grid cols-${gridCols}`}>
                        {processedProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                badge={product.badge || "BEST SELLER"}
                                onQuickView={setActiveQuickView}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ================= QUICK VIEW ================= */}
            {activeQuickView && (
                <QuickView
                    product={activeQuickView}
                    onClose={() => setActiveQuickView(null)}
                />
            )}
        </section>
    );
};

export default BestIn;