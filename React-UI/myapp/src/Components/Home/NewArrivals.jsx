import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import ProductCard from "../../Components/ProductCard";
import QuickView from "../../Components/QuickView/QuickView";
import "./NewArrivals.css";

const NewArrivals = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const sliderRef = useRef(null);

    // Selected Product for Quick View
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filter new arrivals and limit to maximum 4 products
    const newArrivals = (Array.isArray(data) ? data : [])
        .filter((product) => product.isNewArrival === true || product.isNewArrival === "true")
        .slice(0, 4);

    useEffect(() => {
        axios
            .get("http://localhost:3000/shirt/showAll")
            .then((res) => setData(res.data?.data || []))
            .catch((err) => {
                console.error("New Arrivals Fetch Error:", err);
                toast.error("Unable to load fresh arrivals");
            });
    }, []);

    return (
        <section className="best-sellers-section">
            <div className="best-sellers-header">
                <div className="best-sellers-title-area">
                    <span className="best-sellers-section-label">FRESH DROPS</span>
                    <h2>New Arrivals</h2>
                    <p className="best-sellers-subtitle">
                        Recently added bespoke tailoring cuts and fabrics.
                    </p>
                </div>
            </div>

            <div className="best-sellers-product-slider" ref={sliderRef}>
                {newArrivals.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        badge="NEW ARRIVAL"
                        onQuickView={(item) => setSelectedProduct(item)}
                    />
                ))}
            </div>

            {/* ✨ Premium Animated View More CTA Button */}
            <div className="arrivals-viewmore-box">
                <button
                    type="button"
                    className="arrivals-luxury-btn"
                    onClick={() => navigate("/newin")}
                >
                    <span className="btn-glow-shimmer"></span>
                    <span className="btn-inner-content">
                        <span>EXPLORE FULL CAPSULE</span>
                        <ArrowRight size={16} className="btn-tail-arrow" />
                    </span>
                </button>
            </div>

            {selectedProduct && (
                <QuickView
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </section>
    );
};

export default NewArrivals;