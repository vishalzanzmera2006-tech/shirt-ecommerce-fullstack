import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    X,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    ShoppingBag,
    Truck,
    ShieldCheck,
    RotateCcw,
    Sparkles,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setCart } from "../../Redux/cartSlice";
import { toast } from "sonner";
import "./QuickView.css";

// Helper: Fixes stringified arrays and sorts sizes properly
const parseAndSortSizes = (rawSizes) => {
    if (!rawSizes) return [];

    let parsed = rawSizes;

    // Handle nested array string: '["S","M","L"]'
    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            parsed = parsed.replace(/[\[\]"]/g, "").split(",");
        }
    }

    // Handle array containing a single stringified array: ['["S","M"]']
    if (
        Array.isArray(parsed) &&
        parsed.length === 1 &&
        typeof parsed[0] === "string" &&
        parsed[0].includes("[")
    ) {
        try {
            parsed = JSON.parse(parsed[0]);
        } catch {
            parsed = parsed[0].replace(/[\[\]"]/g, "").split(",");
        }
    }

    if (!Array.isArray(parsed)) return [];

    // Clean brackets, quotes, whitespace
    const cleaned = parsed
        .map((s) => String(s).replace(/[\[\]"'\\]/g, "").trim().toUpperCase())
        .filter(Boolean);

    // Standard Luxury Sizing Order
    const standardOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];

    return Array.from(new Set(cleaned)).sort((a, b) => {
        const indexA = standardOrder.indexOf(a);
        const indexB = standardOrder.indexOf(b);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });
};

const QuickView = ({ product, onClose }) => {
    const dispatch = useDispatch();

    const [currentImage, setCurrentImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [adding, setAdding] = useState(false);

    // Clean and sort sizes using the parser helper
    const availableSizes = useMemo(() => {
        return parseAndSortSizes(product?.sizes);
    }, [product?.sizes]);

    useEffect(() => {
        if (product) {
            setCurrentImage(0);
            setQuantity(1);

            // Default first size selection
            setSelectedSize(availableSizes.length > 0 ? availableSizes[0] : "");

            // Default color selection
            setSelectedColor(
                product.colors?.length > 0
                    ? typeof product.colors[0] === "string"
                        ? product.colors[0]
                        : product.colors[0].name
                    : ""
            );
        }
    }, [product, availableSizes]);

    // ESC key close listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        if (product) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [product]);

    if (!product) return null;

    // Normalizing image array
    const images = Array.isArray(product.images)
        ? product.images.filter(Boolean)
        : [
            product.mainimage,
            ...(Array.isArray(product.previewimages)
                ? product.previewimages
                : []),
        ].filter(Boolean);

    const currentImageName = images[currentImage];
    const imageUrl = currentImageName
        ? `http://localhost:3000/images/productimages/${currentImageName}`
        : "";

    // Image navigation handlers
    const handlePrevious = () => {
        if (images.length <= 1) return;
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (images.length <= 1) return;
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Quantity handlers
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    // Add To Cart Handler
    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to place items in your shopping bag");
            return;
        }

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Please select a size for your garment");
            return;
        }

        setAdding(true);

        try {
            await axios.post(
                "http://localhost:3000/cart/add",
                {
                    productId: product._id,
                    quantity: quantity,
                    size: selectedSize || "M",
                    color: selectedColor || "",
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );

            // Fetch refreshed cart list
            const res = await axios.get("http://localhost:3000/cart", {
                headers: {
                    token: token,
                },
            });

            dispatch(setCart(res.data.data || []));
            toast.success("Piece added to your shopping bag");

            setTimeout(() => {
                onClose();
            }, 350);
        } catch (error) {
            console.error("Quick View Cart Error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to add item to shopping bag. Please try again."
            );
        } finally {
            setAdding(false);
        }
    };

    const salePrice = Number(product.salePrice || product.originalPrice || 0);
    const originalPrice = Number(product.originalPrice || 0);

    let discount = 0;
    if (originalPrice > salePrice) {
        discount = Math.round(
            ((originalPrice - salePrice) / originalPrice) * 100
        );
    }

    return (
        <div className="qv-backdrop" onClick={onClose}>
            <div className="qv-dialog" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    className="qv-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X size={18} />
                </button>

                {/* Left Column: Gallery */}
                <div className="qv-gallery-col">
                    <div className="qv-hero-img-box">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="qv-hero-img"
                                draggable="false"
                            />
                        ) : (
                            <div className="qv-no-image">
                                Visual Preview Unavailable
                            </div>
                        )}

                        {product.badge && (
                            <span className="qv-badge-pill">
                                <Sparkles size={11} />
                                {product.badge}
                            </span>
                        )}

                        {images.length > 1 && (
                            <div className="qv-img-nav-group">
                                <button
                                    type="button"
                                    className="qv-img-arrow qv-arrow-prev"
                                    onClick={handlePrevious}
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    type="button"
                                    className="qv-img-arrow qv-arrow-next"
                                    onClick={handleNext}
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="qv-thumb-strip">
                            {images.map((image, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className={`qv-thumb-card ${currentImage === index
                                        ? "is-selected"
                                        : ""
                                        }`}
                                    onClick={() => setCurrentImage(index)}
                                >
                                    <img
                                        src={`http://localhost:3000/images/productimages/${image}`}
                                        alt={`Thumbnail ${index + 1}`}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Information */}
                <div className="qv-content-col">
                    <div className="qv-header-row">
                        <span className="qv-category-tag">
                            {product.category || "BESPOKE COLLECTION"}
                        </span>
                    </div>

                    <h2 className="qv-product-title">{product.name}</h2>

                    {/* Price Cluster */}
                    <div className="qv-pricing-cluster">
                        <div className="qv-price-stack">
                            <span className="qv-sale-price">
                                ₹{salePrice.toLocaleString("en-IN")}
                            </span>
                            {originalPrice > salePrice && (
                                <del className="qv-original-price">
                                    ₹{originalPrice.toLocaleString("en-IN")}
                                </del>
                            )}
                        </div>

                        {(discount > 0 || product.discount) && (
                            <span className="qv-discount-badge">
                                {discount > 0
                                    ? `${discount}% OFF`
                                    : product.discount}
                            </span>
                        )}
                    </div>

                    {/* Dynamic Admin Description */}
                    {product.description &&
                        product.description.trim() !== "" && (
                            <div className="qv-description-block">
                                <span className="qv-description-label">
                                    DESCRIPTION
                                </span>
                                <p className="qv-description-text">
                                    {product.description}
                                </p>
                            </div>
                        )}

                    <div className="qv-section-divider"></div>

                    {/* Color Swatches */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="qv-choice-section">
                            <div className="qv-choice-label">
                                <span>COLOR PALETTE</span>
                                <strong>{selectedColor}</strong>
                            </div>

                            <div className="qv-color-swatches">
                                {product.colors.map((color, index) => {
                                    const colorName =
                                        typeof color === "string"
                                            ? color
                                            : color.name;
                                    const swatchBg =
                                        typeof color === "object"
                                            ? color.value ||
                                            color.hex ||
                                            "#1e293b"
                                            : colorName;

                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={`qv-color-btn ${selectedColor === colorName
                                                ? "is-active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                setSelectedColor(colorName)
                                            }
                                            title={colorName}
                                        >
                                            <span
                                                style={{ background: swatchBg }}
                                            ></span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Available Sizes */}
                    {availableSizes.length > 0 && (
                        <div className="qv-choice-section">
                            <div className="qv-choice-label">
                                <span>AVAILABLE SIZES</span>
                            </div>

                            <div className="qv-size-grid">
                                {availableSizes.map((size, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`qv-size-btn ${selectedSize === size
                                            ? "is-active"
                                            : ""
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stepper + CTA */}
                    <div className="qv-checkout-actions">
                        <div className="qv-stepper-box">
                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <Minus size={13} />
                            </button>
                            <span>{quantity}</span>
                            <button
                                type="button"
                                onClick={increaseQuantity}
                                aria-label="Increase quantity"
                            >
                                <Plus size={13} />
                            </button>
                        </div>

                        <button
                            type="button"
                            className="qv-submit-cta"
                            onClick={handleAddToCart}
                            disabled={adding}
                        >
                            <ShoppingBag size={16} />
                            <span>
                                {adding
                                    ? "ADDING TO BAG..."
                                    : "ADD TO SHOPPING BAG"}
                            </span>
                        </button>
                    </div>

                    {/* Brand Assurance Perks */}
                    <div className="qv-perks-grid">
                        <div className="qv-perk-item">
                            <Truck size={16} className="perk-icon" />
                            <div>
                                <strong>Free Express Transit</strong>
                                <span>Orders above ₹5,000</span>
                            </div>
                        </div>
                        <div className="qv-perk-item">
                            <ShieldCheck size={16} className="perk-icon" />
                            <div>
                                <strong>Bespoke Standard</strong>
                                <span>100% Quality inspected</span>
                            </div>
                        </div>
                        <div className="qv-perk-item">
                            <RotateCcw size={16} className="perk-icon" />
                            <div>
                                <strong>7-Day Trial</strong>
                                <span>Easy size exchange</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickView;