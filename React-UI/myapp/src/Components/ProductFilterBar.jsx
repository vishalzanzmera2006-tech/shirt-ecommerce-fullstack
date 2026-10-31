import React, { useState, useEffect } from "react";
import {
    SlidersHorizontal,
    X,
    RotateCcw,
    ChevronDown,
    Search,
    Check
} from "lucide-react";
import { toast } from "sonner";
import "./ProductFilterBar.css";

const GridThreeIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="5" height="16" rx="1" />
        <rect x="9.5" y="4" width="5" height="16" rx="1" />
        <rect x="17" y="4" width="5" height="16" rx="1" />
    </svg>
);

const GridFourIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="3.5" height="16" rx="0.8" />
        <rect x="7.5" y="4" width="3.5" height="16" rx="0.8" />
        <rect x="13" y="4" width="3.5" height="16" rx="0.8" />
        <rect x="18.5" y="4" width="3.5" height="16" rx="0.8" />
    </svg>
);

const SIZES = ["S", "M", "L", "XL", "XXL"];
const FITS = [
    { label: "All Fits", value: "All" },
    { label: "Slim Fit", value: "Slim Fit" },
    { label: "Regular Fit", value: "Regular Fit" },
    { label: "Relaxed Oversized", value: "Relaxed Oversized" }
];
const PATTERNS = [
    { label: "All Patterns", value: "All" },
    { label: "Solid / Plain", value: "Solid" },
    { label: "Striped", value: "Striped" },
    { label: "Checked", value: "Checked" },
    { label: "Textured", value: "Textured" }
];
const PRICES = [
    { label: "All Price Ranges", value: "All" },
    { label: "Under ₹2,500", value: "under-2500" },
    { label: "₹2,500 - ₹4,000", value: "2500-4000" },
    { label: "Above ₹4,000", value: "above-4000" }
];

const ProductFilterBar = ({
    categories = [],
    selectedFilter,
    onSelectFilter,
    selectedSize,
    onSelectSize,
    selectedFit,
    onSelectFit,
    selectedPattern,
    onSelectPattern,
    selectedPriceRange,
    onSelectPriceRange,
    sortBy,
    onSortChange,
    gridCols,
    onGridChange,
    onResetFilters,
    hasActiveFilters,
    // Optional Search query prop if parent uses it
    searchQuery = "",
    onSearchChange,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Lock background scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isDrawerOpen]);

    // Count Active Filters for the badge
    const activeCount = [
        selectedFilter !== "All Fabrics",
        selectedSize !== "All",
        selectedFit !== "All",
        selectedPattern !== "All",
        selectedPriceRange !== "All",
        Boolean(searchQuery),
    ].filter(Boolean).length;

    const handleReset = () => {
        if (onResetFilters) {
            onResetFilters();
            if (onSearchChange) onSearchChange("");
            toast.success("All filters reset successfully");
        }
    };

    return (
        <>
            <div className="filter-bar-sticky">
                <div className="filter-bar-inner">
                    {/* Left: Filter Trigger Button */}
                    <div className="filter-left-actions">
                        <button
                            type="button"
                            className={`filter-drawer-trigger-btn ${activeCount > 0 ? "has-filters" : ""}`}
                            onClick={() => setIsDrawerOpen(true)}
                        >
                            <SlidersHorizontal size={14} />
                            <span>Filters</span>
                            {activeCount > 0 && (
                                <span className="filter-badge-pill">{activeCount}</span>
                            )}
                        </button>

                        {/* Quick Category Pills in Sticky bar for quick switch */}
                        <div className="filter-quick-pills">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`quick-pill ${selectedFilter === cat ? "active" : ""}`}
                                    onClick={() => onSelectFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Layout Grid Toggles & Sorter */}
                    <div className="filter-right-actions">
                        {onGridChange && (
                            <div className="filter-grid-toggles">
                                <button
                                    type="button"
                                    className={`grid-icon-btn ${gridCols === 3 ? "active" : ""}`}
                                    onClick={() => onGridChange(3)}
                                    title="3 Columns"
                                >
                                    <GridThreeIcon />
                                </button>
                                <button
                                    type="button"
                                    className={`grid-icon-btn ${gridCols === 4 ? "active" : ""}`}
                                    onClick={() => onGridChange(4)}
                                    title="4 Columns"
                                >
                                    <GridFourIcon />
                                </button>
                            </div>
                        )}

                        <div className="filter-sort-box">
                            <select
                                value={sortBy}
                                onChange={(e) => onSortChange(e.target.value)}
                                className="filter-sort-dropdown"
                            >
                                <option value="newest">Latest Arrivals</option>
                                <option value="bestseller">Best Sellers</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="discount">Highest Discount</option>
                                <option value="name-az">Name: A to Z</option>
                            </select>
                            <ChevronDown size={13} className="sort-arrow" />
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
                RIGHT SIDE SLIDE DRAWER
            ========================================= */}
            <div
                className={`filter-drawer-backdrop ${isDrawerOpen ? "open" : ""}`}
                onClick={() => setIsDrawerOpen(false)}
            />

            <aside className={`filter-drawer-container ${isDrawerOpen ? "open" : ""}`}>
                {/* Header */}
                <div className="filter-drawer-header">
                    <div className="drawer-title-group">
                        <h3>Refine Selection</h3>
                        {activeCount > 0 && <span className="drawer-sub">{activeCount} applied</span>}
                    </div>
                    <button
                        type="button"
                        className="filter-close-btn"
                        onClick={() => setIsDrawerOpen(false)}
                        aria-label="Close filters"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="filter-drawer-body">
                    {/* 0. Live Search Product Input */}
                    {onSearchChange && (
                        <div className="drawer-section">
                            <label className="drawer-label">Search Garment</label>
                            <div className="drawer-search-wrapper">
                                <Search size={15} className="drawer-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by color, fabric, name..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="drawer-search-input"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="search-clear-btn"
                                        onClick={() => onSearchChange("")}
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 1. Fabric Selection */}
                    <div className="drawer-section">
                        <label className="drawer-label">Fabrics & Materials</label>
                        <div className="drawer-chips-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`drawer-chip ${selectedFilter === cat ? "active" : ""}`}
                                    onClick={() => onSelectFilter(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Size Selection */}
                    <div className="drawer-section">
                        <div className="drawer-label-flex">
                            <label className="drawer-label">Size</label>
                            {selectedSize !== "All" && (
                                <button type="button" className="clear-link" onClick={() => onSelectSize("All")}>
                                    Clear
                                </button>
                            )}
                        </div>
                        <div className="drawer-sizes-grid">
                            <button
                                type="button"
                                className={`size-tile ${selectedSize === "All" ? "active" : ""}`}
                                onClick={() => onSelectSize("All")}
                            >
                                All
                            </button>
                            {SIZES.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className={`size-tile ${selectedSize === s ? "active" : ""}`}
                                    onClick={() => onSelectSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Fit Selection */}
                    <div className="drawer-section">
                        <label className="drawer-label">Tailored Silhouette / Fit</label>
                        <div className="drawer-radio-list">
                            {FITS.map((fit) => (
                                <button
                                    key={fit.value}
                                    type="button"
                                    className={`drawer-radio-row ${selectedFit === fit.value ? "selected" : ""}`}
                                    onClick={() => onSelectFit(fit.value)}
                                >
                                    <span>{fit.label}</span>
                                    {selectedFit === fit.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Pattern Selection */}
                    <div className="drawer-section">
                        <label className="drawer-label">Weave & Pattern</label>
                        <div className="drawer-radio-list">
                            {PATTERNS.map((pat) => (
                                <button
                                    key={pat.value}
                                    type="button"
                                    className={`drawer-radio-row ${selectedPattern === pat.value ? "selected" : ""}`}
                                    onClick={() => onSelectPattern(pat.value)}
                                >
                                    <span>{pat.label}</span>
                                    {selectedPattern === pat.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 5. Price Bracket */}
                    <div className="drawer-section">
                        <label className="drawer-label">Price Range</label>
                        <div className="drawer-radio-list">
                            {PRICES.map((pr) => (
                                <button
                                    key={pr.value}
                                    type="button"
                                    className={`drawer-radio-row ${selectedPriceRange === pr.value ? "selected" : ""}`}
                                    onClick={() => onSelectPriceRange(pr.value)}
                                >
                                    <span>{pr.label}</span>
                                    {selectedPriceRange === pr.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="filter-drawer-footer">
                    <button
                        type="button"
                        className="drawer-reset-btn"
                        onClick={handleReset}
                        disabled={!hasActiveFilters && !searchQuery}
                    >
                        <RotateCcw size={13} />
                        <span>Reset All</span>
                    </button>
                    <button
                        type="button"
                        className="drawer-apply-btn"
                        onClick={() => setIsDrawerOpen(false)}
                    >
                        View Results
                    </button>
                </div>
            </aside>
        </>
    );
};

export default ProductFilterBar;