import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import ProductCard from "../../Components/ProductCard";
import QuickView from "../../Components/QuickView/QuickView";
import "./BestSellers.css";

const BestSellers = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const sliderRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch Products
    useEffect(() => {
        axios
            .get("http://localhost:3000/shirt/showAll")
            .then((res) => {
                const items = Array.isArray(res.data?.data)
                    ? res.data.data
                    : Array.isArray(res.data)
                        ? res.data
                        : [];
                setData(items);
            })
            .catch((err) => {
                console.error("Best Sellers Fetch Error:", err);
                toast.error("Unable to load best-selling pieces");
            });
    }, []);

    // Best Seller Filter
    const bestSellers = (Array.isArray(data) ? data : []).filter((product) => {
        return product.isBestSeller === true || product.isBestSeller === "true";
    });

    // Scroll Handlers
    const handlePrev = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
    };

    return (
        <section className="best-sellers-section">
            {/* Header */}
            <div className="best-sellers-header">
                <div className="best-sellers-title-area">
                    <span className="best-sellers-section-label">POPULAR PICKS</span>
                    <h2>Best Sellers</h2>
                    <p className="best-sellers-subtitle">
                        Our most coveted shirts crafted for timeless style.
                    </p>
                </div>

                {/* Arrows */}
                <div className="best-sellers-controls">
                    <button type="button" className="best-sellers-slider-btn" onClick={handlePrev} aria-label="Scroll left">
                        ←
                    </button>
                    <button type="button" className="best-sellers-slider-btn" onClick={handleNext} aria-label="Scroll right">
                        →
                    </button>
                </div>
            </div>

            {/* Product Slider */}
            <div className="best-sellers-product-slider" ref={sliderRef}>
                {bestSellers.map((product) => (
                    <div className="best-sellers-card-wrapper" key={product._id}>
                        <ProductCard
                            product={product}
                            badge="BEST SELLER"
                            onQuickView={setSelectedProduct}
                        />
                    </div>
                ))}
            </div>

            {/* ✨ Animated View More CTA Button */}
            <div className="arrivals-viewmore-box">
                <button
                    type="button"
                    className="arrivals-luxury-btn"
                    onClick={() => navigate("/bestin")}
                >
                    <span className="btn-glow-shimmer"></span>
                    <span className="btn-inner-content">
                        <span>EXPLORE ALL COLLECTIONS</span>
                        <ArrowRight size={16} className="btn-tail-arrow" />
                    </span>
                </button>
            </div>

            {/* Quick View Modal */}
            {selectedProduct && (
                <QuickView
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </section>
    );
};

export default BestSellers;