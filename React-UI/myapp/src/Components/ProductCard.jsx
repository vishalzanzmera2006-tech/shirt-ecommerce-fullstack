import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../Redux/cartSlice";
import { setWishlist, removeWishlist } from "../Redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner"; 
import "./ProductCard.css";

const ProductCard = ({ product, badge, onQuickView }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const wishlistItems = useSelector(
        (state) => state.wishlist?.items || []
    );

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    // Normalize Images
    const images = useMemo(() => {
        if (!product) return [];
        const previews = Array.isArray(product.previewimages)
            ? product.previewimages
            : [];
        const combined = Array.isArray(product.images)
            ? product.images
            : [product.mainimage, ...previews];
        return combined.filter(Boolean).slice(0, 5);
    }, [product]);

    const [activeImg, setActiveImg] = useState(product?.mainimage || "");

    useEffect(() => {
        if (product?.mainimage) {
            setActiveImg(product.mainimage);
        }
    }, [product?.mainimage]);

    // Wishlist state check
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || !product?._id) {
            setIsWishlisted(false);
            return;
        }

        const exists = wishlistItems.some((item) => {
            const prodId =
                item?.product?._id ||
                item?.productId?._id ||
                item?.product ||
                item?.productId ||
                item?._id;

            return String(prodId) === String(product._id);
        });

        setIsWishlisted(exists);
    }, [wishlistItems, product?._id]);

    if (!product) return null;

    // Price calculations
    const salePrice = Number(product.salePrice || product.originalPrice || 0);
    const origPrice = Number(product.originalPrice || 0);

    let discountPercent = 0;
    if (origPrice > salePrice && origPrice > 0) {
        discountPercent = Math.round(((origPrice - salePrice) / origPrice) * 100);
    }

    const discountBadgeText =
        product.discount || (discountPercent > 0 ? `${discountPercent}% OFF` : "");

    // Navigation
    const handleCardClick = () => {
        navigate(`/productdetails?id=${product._id}`);
    };

    // Quick View
    const handleQuickView = (e) => {
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product);
        }
    };

    // Add To Cart
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to place pieces in your bag");
            navigate("/login");
            return;
        }

        setAdding(true);
        try {
            await axios.post(
                "https://shirt-backend-33gt.onrender.com/cart/add",
                {
                    productId: product._id,
                    quantity: 1,
                    size: Array.isArray(product.sizes) && product.sizes.length > 0 ? product.sizes[0] : "M",
                },
                { headers: { token } }
            );

            const res = await axios.get("https://shirt-backend-33gt.onrender.com/cart", {
                headers: { token },
            });

            dispatch(setCart(res.data.data || []));
            toast.success("Piece added to your shopping bag");
        } catch (error) {
            console.error("Cart Add Error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to add garment to your bag. Please try again."
            );
        } finally {
            setAdding(false);
        }
    };

    // Wishlist Toggle
    const handleWishlist = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to save pieces to your wishlist");
            navigate("/login");
            return;
        }

        if (wishlistLoading) return;
        setWishlistLoading(true);

        try {
            if (isWishlisted) {
                await axios.delete("https://shirt-backend-33gt.onrender.com/wishlist/remove", {
                    headers: { token },
                    data: { productId: product._id },
                });

                setIsWishlisted(false);
                dispatch(removeWishlist(product._id));
                toast.success("Piece removed from wishlist");
            } else {
                const res = await axios.post(
                    "https://shirt-backend-33gt.onrender.com/wishlist/add",
                    { productId: product._id },
                    { headers: { token } }
                );

                setIsWishlisted(true);
                if (Array.isArray(res.data?.data)) {
                    dispatch(setWishlist(res.data.data));
                } else {
                    const newFav = res.data?.data || { product: product, _id: product._id };
                    dispatch(setWishlist([...wishlistItems, newFav]));
                }

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

    const displayBadge = badge || product.badge;

    return (
        <article className="product-card" onClick={handleCardClick}>
            {/* Media Box */}
            <div className="product-card-image-box">
                <img
                    src={`https://shirt-backend-33gt.onrender.com/images/productimages/${activeImg || product.mainimage}`}
                    alt={product.name || "Product"}
                    className="product-card-img"
                    loading="lazy"
                />

                {/* Top-Left Badge */}
                {displayBadge && (
                    <span className="product-card-badge">{displayBadge}</span>
                )}

                {/* Action Column */}
                <div className="product-card-overlay">
                    <button
                        type="button"
                        className={`product-card-action-btn ${isWishlisted ? "active" : ""}`}
                        onClick={handleWishlist}
                        disabled={wishlistLoading}
                        aria-label="Wishlist"
                    >
                        <Heart
                            size={15}
                            fill={isWishlisted ? "#ef4444" : "none"}
                            color={isWishlisted ? "#ef4444" : "currentColor"}
                        />
                    </button>

                    <button
                        type="button"
                        className="product-card-action-btn"
                        onClick={handleAddToCart}
                        disabled={adding}
                        aria-label="Add to cart"
                    >
                        <ShoppingBag size={15} />
                    </button>

                    <button
                        type="button"
                        className="product-card-action-btn"
                        onClick={handleQuickView}
                        aria-label="Quick view"
                    >
                        <Eye size={15} />
                    </button>
                </div>

                {/* Preview Thumbnail Strip */}
                {images.length > 1 && (
                    <div
                        className="product-card-thumbs"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`product-card-thumb-dot ${activeImg === img ? "active" : ""}`}
                                onMouseEnter={() => setActiveImg(img)}
                                onClick={() => setActiveImg(img)}
                                aria-label={`Thumbnail ${idx + 1}`}
                            >
                                <img
                                    src={`https://shirt-backend-33gt.onrender.com/images/productimages/${img}`}
                                    alt=""
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Information Block */}
            <div className="product-card-info">
                <div className="product-card-meta">
                    <span className="product-card-cat">{product.category || "BESPOKE"}</span>
                    {discountBadgeText && (
                        <span className="product-card-discount">{discountBadgeText}</span>
                    )}
                </div>

                <h3 className="product-card-title">{product.name}</h3>

                <div className="product-card-pricing">
                    <span className="product-card-sale-price">
                        ₹{salePrice.toLocaleString("en-IN")}
                    </span>
                    {origPrice > salePrice && (
                        <del className="product-card-del-price">
                            ₹{origPrice.toLocaleString("en-IN")}
                        </del>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;