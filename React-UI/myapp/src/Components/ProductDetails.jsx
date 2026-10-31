import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
    Heart,
    ShoppingBag,
    Zap,
    Minus,
    Plus,
    ArrowLeft,
    Star,
    Sparkles,
    ShieldCheck,
    Truck,
    RotateCcw,
} from "lucide-react";
import { setWishlist, removeWishlist } from "../Redux/wishlistSlice";
import { addCart } from "../Redux/cartSlice";
import { toast } from "sonner";
import SizeGuideModal from "./SizeGuideModal";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView/QuickView";
import "./ProductDetails.css";

// Helper: Fixes stringified arrays and standardizes sizing sequence
const parseAndSortSizes = (rawSizes) => {
    if (!rawSizes) return [];

    let parsed = rawSizes;

    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            parsed = parsed.replace(/[\[\]"]/g, "").split(",");
        }
    }

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

    const cleaned = parsed
        .map((s) => String(s).replace(/[\[\]"'\\]/g, "").trim().toUpperCase())
        .filter(Boolean);

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

const ProductDetails = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const id = searchParams.get("id");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeImage, setActiveImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [cartLoading, setCartLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const wishlistItems = useSelector(
        (state) => state.wishlist?.items || []
    );

    const isWishlisted = wishlistItems.some((item) => {
        const prodId = item?.product?._id || item?.product || item?._id;
        return String(prodId) === String(id);
    });

    const availableSizes = useMemo(() => {
        return parseAndSortSizes(product?.sizes);
    }, [product?.sizes]);

    // Initial Wishlist Fetch
    useEffect(() => {
        const fetchWishlistInitial = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await axios.get("http://localhost:3000/wishlist", {
                    headers: { token },
                });
                dispatch(setWishlist(res.data?.data || []));
            } catch (err) {
                console.error("Wishlist sync error:", err);
            }
        };

        if (wishlistItems.length === 0) {
            fetchWishlistInitial();
        }
    }, [dispatch]);

    // Fetch Product Details
    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `http://localhost:3000/shirt/showOne?id=${id}`
                );

                const productData = res.data?.data;
                setProduct(productData);

                if (productData?.mainimage) {
                    setActiveImage(productData.mainimage);
                } else if (
                    Array.isArray(productData?.previewimages) &&
                    productData.previewimages.length > 0
                ) {
                    setActiveImage(productData.previewimages[0]);
                }
            } catch (error) {
                console.error(
                    "Product Details Error:",
                    error.response?.data || error.message
                );
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load garment details. Please try again."
                );
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            getProduct();
        } else {
            setLoading(false);
        }
        window.scrollTo(0, 0);
    }, [id]);

    // Fetch Related Products
    useEffect(() => {
        const fetchRelated = async () => {
            if (!product?.category) return;
            try {
                const res = await axios.get("http://localhost:3000/shirt/showAll");
                const all = res.data?.data || [];

                const filtered = all
                    .filter((item) => item.category === product.category && item._id !== product._id)
                    .slice(0, 4);

                setRelatedProducts(filtered);
            } catch (err) {
                console.error("Related fetch error:", err);
            }
        };

        if (product) {
            fetchRelated();
        }
    }, [product]);

    // Auto-select first available size
    useEffect(() => {
        if (availableSizes.length > 0 && !selectedSize) {
            setSelectedSize(availableSizes[0]);
        }
    }, [availableSizes, selectedSize]);

    // Wishlist Toggle
    const handleWishlist = async (e) => {
        e.stopPropagation();

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to save pieces to your wishlist");
            navigate("/login");
            return;
        }

        if (wishlistLoading || !product) return;

        setWishlistLoading(true);

        try {
            if (isWishlisted) {
                await axios.delete("http://localhost:3000/wishlist/remove/", {
                    headers: { token },
                    data: { productId: product._id },
                });

                dispatch(removeWishlist(product._id));
                toast.success("Piece removed from wishlist");
            } else {
                const res = await axios.post(
                    "http://localhost:3000/wishlist/add",
                    { productId: product._id },
                    { headers: { token } }
                );

                const newWishlistItem = res.data?.data || {
                    _id: Date.now().toString(),
                    product: product,
                };

                dispatch(
                    setWishlist([
                        ...wishlistItems,
                        newWishlistItem,
                    ])
                );

                toast.success("Piece saved to your wishlist");
            }
        } catch (error) {
            console.error("Wishlist Error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to update wishlist. Please try again."
            );
        } finally {
            setWishlistLoading(false);
        }
    };

    // Add To Cart
    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to place pieces in your shopping bag");
            navigate("/login");
            return;
        }

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Please select a size for your garment");
            return;
        }

        try {
            setCartLoading(true);

            const res = await axios.post(
                "http://localhost:3000/cart/add",
                {
                    productId: product._id,
                    quantity: quantity,
                    size: selectedSize || "M",
                },
                {
                    headers: {
                        token: token,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.data) {
                dispatch(addCart(res.data.data));
            }
            toast.success("Piece added to your shopping bag");
        } catch (error) {
            console.error(
                "Add To Cart Error:",
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message ||
                "Unable to add item to shopping bag. Please try again."
            );
        } finally {
            setCartLoading(false);
        }
    };

    // Buy Now
    const handleBuyNow = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to proceed with checkout");
            navigate("/login");
            return;
        }

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Please select a size for your garment");
            return;
        }

        try {
            setCartLoading(true);

            const res = await axios.post(
                "http://localhost:3000/cart/add",
                {
                    productId: product._id,
                    quantity: quantity,
                    size: selectedSize || "M",
                },
                {
                    headers: {
                        token: token,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.data) {
                dispatch(addCart(res.data.data));
            }

            toast.success("Proceeding to checkout review...");
            navigate("/cart");
        } catch (error) {
            console.error(
                "Buy Now Error:",
                error.response?.data || error.message
            );
            toast.error(
                error.response?.data?.message ||
                "Unable to prepare order for checkout. Please try again."
            );
        } finally {
            setCartLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="product-details-page">
                <div className="product-details-loading">
                    <div className="product-loader"></div>
                    <span>LOADING PRODUCT DETAILS...</span>
                </div>
            </section>
        );
    }

    if (!product) {
        return (
            <section className="product-details-page">
                <div className="product-not-found">
                    <div className="not-found-number">404</div>
                    <h1>Garment Not Found</h1>
                    <p>
                        This signature piece is either archived or no longer available.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={16} />
                        BACK TO SHOP
                    </button>
                </div>
            </section>
        );
    }

    const previewImages = Array.isArray(product.previewimages)
        ? product.previewimages
        : [];

    const allImages = [
        product.mainimage,
        ...previewImages,
    ].filter(Boolean);

    const galleryImages = allImages.slice(0, 6);

    const hasSalePrice =
        product.salePrice !== undefined &&
        product.salePrice !== null &&
        product.salePrice !== "" &&
        Number(product.salePrice) > 0;

    const salePrice = hasSalePrice
        ? Number(product.salePrice)
        : Number(product.originalPrice || 0);

    const originalPrice =
        product.originalPrice !== undefined &&
            product.originalPrice !== null &&
            product.originalPrice !== "" &&
            Number(product.originalPrice) > 0
            ? Number(product.originalPrice)
            : 0;

    let discountPercent = 0;
    if (originalPrice > salePrice) {
        discountPercent = Math.round(
            ((originalPrice - salePrice) / originalPrice) * 100
        );
    }

    const getImageUrl = (image) => `http://localhost:3000/images/productimages/${image}`;

    return (
        <section className="product-details-page">
            <div className="product-details-topbar">
                <button
                    type="button"
                    className="product-back-btn"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    <span>BACK TO COLLECTION</span>
                </button>
            </div>

            <div className="product-details-container">
                {/* GALLERY */}
                <div className="product-gallery">
                    <div className="product-thumbnail-list">
                        {galleryImages.map((image, index) => (
                            <button
                                type="button"
                                key={index}
                                className={`product-thumbnail ${activeImage === image ? "active" : ""}`}
                                onClick={() => setActiveImage(image)}
                            >
                                <img
                                    src={getImageUrl(image)}
                                    alt={`${product.name} ${index + 1}`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="product-main-image-box">
                        {activeImage ? (
                            <img
                                src={getImageUrl(activeImage)}
                                alt={product.name}
                                className="product-main-image"
                            />
                        ) : (
                            <div className="product-image-empty">
                                NO IMAGE AVAILABLE
                            </div>
                        )}

                        {product.badge && (
                            <span className="product-detail-badge">
                                <Sparkles size={11} />
                                {product.badge}
                            </span>
                        )}
                    </div>
                </div>

                {/* INFORMATION */}
                <div className="product-information">
                    <div className="product-meta-header">
                        <span className="product-detail-category">
                            {product.category || "BESPOKE TAILORED"}
                        </span>
                        <span className="product-in-stock-tag">
                            <span className="stock-glow-dot"></span>
                            IN STOCK
                        </span>
                    </div>

                    <h1 className="product-detail-title">
                        {product.name}
                    </h1>

                    <div className="product-rating-bar">
                        <div className="rating-stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="star-icon" />
                            ))}
                        </div>
                        <span className="rating-number">4.9</span>
                        <span className="rating-count">(38 Customer Reviews)</span>
                    </div>

                    <div className="product-detail-price">
                        <span className="detail-sale-price">
                            ₹{salePrice.toLocaleString("en-IN")}
                        </span>

                        {hasSalePrice && originalPrice > salePrice && (
                            <del className="detail-original-price">
                                ₹{originalPrice.toLocaleString("en-IN")}
                            </del>
                        )}

                        {(discountPercent > 0 || product.discount) && (
                            <span className="detail-discount">
                                {discountPercent > 0 ? `${discountPercent}% OFF` : product.discount}
                            </span>
                        )}
                    </div>

                    <div className="product-description-section">
                        <span className="detail-section-label">
                            GARMENT PROFILE
                        </span>
                        <p className="product-description">
                            {product.description ||
                                "Carefully tailored from luxury high-count yarns for supreme breathability, structural drape, and an impeccably sharp collar."}
                        </p>
                    </div>

                    {availableSizes.length > 0 && (
                        <div className="product-size-section">
                            <div className="detail-section-heading">
                                <span className="detail-section-label">
                                    AVAILABLE SIZES
                                </span>
                                <button
                                    type="button"
                                    className="size-guide"
                                    onClick={() => setIsSizeGuideOpen(true)}
                                >
                                    Size Guide
                                </button>
                            </div>

                            <div className="product-size-options">
                                {availableSizes.map((size, index) => (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`product-size-button ${selectedSize === size ? "selected" : ""}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="product-quantity-section">
                        <span className="detail-section-label">
                            QUANTITY
                        </span>

                        <div className="product-quantity-box">
                            <button
                                type="button"
                                disabled={quantity <= 1}
                                onClick={() =>
                                    setQuantity((prev) => Math.max(1, prev - 1))
                                }
                                aria-label="Decrease quantity"
                            >
                                <Minus size={14} />
                            </button>

                            <span>{quantity}</span>

                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                aria-label="Increase quantity"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="product-detail-actions">
                        <button
                            type="button"
                            className="detail-add-cart-btn"
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                        >
                            <ShoppingBag size={17} />
                            <span>
                                {cartLoading ? "ADDING TO BAG..." : "ADD TO CART"}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`detail-wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
                            onClick={handleWishlist}
                            disabled={wishlistLoading}
                            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                            aria-label="Wishlist"
                        >
                            <Heart
                                size={19}
                                fill={isWishlisted ? "#ef4444" : "none"}
                                color={isWishlisted ? "#ef4444" : "currentColor"}
                            />
                        </button>
                    </div>

                    <button
                        type="button"
                        className="detail-buy-now-btn"
                        onClick={handleBuyNow}
                        disabled={cartLoading}
                    >
                        <Zap size={16} />
                        <span>
                            {cartLoading ? "REDIRECTING..." : "BUY IT NOW"}
                        </span>
                    </button>

                    <div className="product-detail-features">
                        <div className="detail-feature">
                            <div className="feature-icon">
                                <Truck size={15} />
                            </div>
                            <div>
                                <strong>Complimentary Express Logistics</strong>
                                <span>Free shipping on all prepaid orders over ₹5,000</span>
                            </div>
                        </div>

                        <div className="detail-feature">
                            <div className="feature-icon">
                                <ShieldCheck size={15} />
                            </div>
                            <div>
                                <strong>Bespoke Quality Standard</strong>
                                <span>French seams with mother-of-pearl buttons</span>
                            </div>
                        </div>

                        <div className="detail-feature">
                            <div className="feature-icon">
                                <RotateCcw size={15} />
                            </div>
                            <div>
                                <strong>7-Day Tailoring Exchange</strong>
                                <span>Hassle-free size adjustment guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <section className="related-products-section">
                    <div className="related-header">
                        <span className="related-kicker">CURATED COMPLEMENTS</span>
                        <h2 className="related-title">You May Also Like</h2>
                    </div>

                    <div className="related-grid">
                        {relatedProducts.map((item) => (
                            <div className="related-card-wrapper" key={item._id}>
                                <ProductCard
                                    product={item}
                                    badge={item.badge}
                                    onQuickView={setSelectedProduct}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Size Guide Modal */}
            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
            />

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

export default ProductDetails;