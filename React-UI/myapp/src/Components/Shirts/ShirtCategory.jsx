import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

// Components
import ProductCard from "../ProductCard";
import QuickView from "../QuickView/QuickView";

import "./ShirtCategory.css";

const ShirtCategory = () => {
    const { subType } = useParams();
    const navigate = useNavigate();

    const [shirts, setShirts] = useState([]);
    const [filteredShirts, setFilteredShirts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeQuickView, setActiveQuickView] = useState(null);

    // 1. Fetch products from backend
    useEffect(() => {
        const fetchShirts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:3000/shirt/showAll");

                const list = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : [];

                setShirts(list);
            } catch (error) {
                console.error("Error fetching shirts:", error);
                toast.error("Unable to load shirting archive. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchShirts();
    }, []);

    // 2. URL slug -> Database Category direct mapping
    const categoryMap = {
        "formal": "Formal",
        "casual": "Casual",
        "egyptian-giza": "Egyptian Giza",
        "linen": "Linen",
        "cotton": "Cotton",
        "oxford": "Oxford",
        "slim-fit": "Slim Fit",
    };

    // 3. Exact filtering by category
    useEffect(() => {
        if (!shirts.length) return;

        if (!subType || subType === "all") {
            setFilteredShirts(shirts);
            return;
        }

        const targetCategory = categoryMap[subType?.toLowerCase()];

        const matched = shirts.filter((shirt) => {
            const dbCategory = (shirt.category || "").trim().toLowerCase();

            if (targetCategory) {
                return dbCategory === targetCategory.toLowerCase();
            }

            return dbCategory === subType.replace(/-/g, " ").trim().toLowerCase();
        });

        setFilteredShirts(matched);
    }, [subType, shirts]);

    const displayTitle = subType
        ? (categoryMap[subType?.toLowerCase()] || subType.replace(/-/g, " ")).toUpperCase()
        : "ALL SHIRTING COMMISSIONS";

    return (
        <div className="shirts-page-container">
            {/* Editorial Header */}
            <div className="shirts-page-header">
                <span className="shirts-tag">CURATED ATELIER ARCHIVE</span>
                <h1>{displayTitle}</h1>
                <p>
                    Displaying {filteredShirts.length} bespoke shirts engineered with 22 stitches per inch.
                </p>
            </div>

            {/* Product Cards Container */}
            {loading ? (
                <div className="shirts-loading">
                    <div className="shirts-spinner"></div>
                    <p>Curating shirting collection...</p>
                </div>
            ) : filteredShirts.length === 0 ? (
                <div className="shirts-empty">
                    <h3>No shirts found in "{categoryMap[subType?.toLowerCase()] || subType?.replace(/-/g, " ")}"</h3>
                    <p>Explore all available bespoke commissions.</p>
                    <button type="button" onClick={() => navigate("/shirts/all")}>
                        View All Shirts
                    </button>
                </div>
            ) : (
                <div className="shirts-grid">
                    {filteredShirts.map((shirt) => (
                        <ProductCard
                            key={shirt._id || shirt.id}
                            product={shirt}
                            badge={shirt.badge || (shirt.isNewArrival ? "NEW IN" : null)}
                            onQuickView={setActiveQuickView}
                        />
                    ))}
                </div>
            )}

            {/* Quick View Modal */}
            {activeQuickView && (
                <QuickView
                    product={activeQuickView}
                    onClose={() => setActiveQuickView(null)}
                />
            )}
        </div>
    );
};

export default ShirtCategory;