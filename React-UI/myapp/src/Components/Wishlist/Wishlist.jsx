import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
    Trash2,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Layers,
    HeartCrack,
} from "lucide-react";
import { setWishlist, removeWishlist } from "../../Redux/wishlistSlice";
import { addCart } from "../../Redux/cartSlice";
import "./Wishlist.css";

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const wishlistItems = useSelector((state) => state.wishlist.items || []);

    const [loading, setLoading] = useState(true);
    const [movingId, setMovingId] = useState(null);

    useEffect(() => {
        const getWishlist = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                dispatch(setWishlist([]));
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("http://localhost:3000/wishlist", {
                    headers: { token: token },
                });
                dispatch(setWishlist(res.data?.data || []));
            } catch (error) {
                console.error("Wishlist Error:", error);
                toast.error("Unable to synchronize your saved pieces");
                dispatch(setWishlist([]));
            } finally {
                setLoading(false);
            }
        };

        getWishlist();
    }, [dispatch]);

    const handleRemove = async (targetDeleteId) => {
        if (!targetDeleteId) return;

        dispatch(removeWishlist(targetDeleteId));
        toast.success("Piece removed from your saved rack");

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await axios.delete("http://localhost:3000/wishlist/remove/", {
                headers: { token: token },
                data: { productId: targetDeleteId },
            });
        } catch (error) {
            console.warn("Backend Remove Notice:", error?.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to remove item from wishlist");
        }
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to transfer pieces to your bag");
            navigate("/login");
            return;
        }

        if (!product?._id) return;

        setMovingId(product._id);
        try {
            const res = await axios.post(
                "http://localhost:3000/cart/add/",
                {
                    productId: product._id,
                    quantity: 1,
                    size: product?.sizes?.[0] || "M",
                },
                { headers: { token: token } }
            );

            dispatch(addCart(res.data?.data));
            dispatch(removeWishlist(product._id));
            toast.success("Piece moved to your shopping bag");

            await axios.delete("http://localhost:3000/wishlist/remove/", {
                headers: { token: token },
                data: { productId: product._id },
            });
        } catch (error) {
            console.error("Cart Error:", error);
            toast.error(error.response?.data?.message || "Unable to transfer garment to shopping bag");
        } finally {
            setMovingId(null);
        }
    };

    if (loading) {
        return (
            <section className="cc-wishlist-page">
                <div className="cc-wishlist-loading">
                    <div className="cc-loader-ring"></div>
                    <span className="cc-loader-text">CURATING YOUR SELECTION</span>
                </div>
            </section>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <section className="cc-wishlist-page">
                <div className="cc-empty-state">
                    <div className="cc-empty-icon-box">
                        <HeartCrack size={38} strokeWidth={1.2} />
                    </div>
                    <span className="cc-kicker">CURATED CLOSET</span>
                    <h1>Your Saved Rack is Empty</h1>
                    <p>
                        Explore our handcrafted bespoke shirts, select your silhouettes, and
                        curate your signature capsule wardrobe here.
                    </p>
                    <button className="cc-cta-btn" onClick={() => navigate("/")}>
                        <span>EXPLORE BESPOKE PIECES</span>
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="cc-wishlist-page">
            <div className="cc-wishlist-header">
                <div className="cc-header-top">
                    <div className="cc-count-pill">
                        <Layers size={13} />
                        <span>
                            {wishlistItems.length} {wishlistItems.length === 1 ? "PIECE" : "PIECES"}
                        </span>
                    </div>
                </div>
                <div className="cc-header-title-group">
                    <h1>Wishlist</h1>
                    <p>Hand-selected shirt patterns reserved for your tailored fit.</p>
                </div>
            </div>

            <div className="cc-wishlist-grid">
                {wishlistItems.map((item) => {
                    const product = item.product || {};
                    const targetDeleteId = product._id || item._id;
                    const coverImage =
                        product.mainimage ||
                        (Array.isArray(product.previewimages) ? product.previewimages[0] : null);

                    return (
                        <article className="cc-card" key={item._id || product._id || Math.random()}>
                            <div className="cc-media-box">
                                {coverImage ? (
                                    <img
                                        src={`http://localhost:3000/images/productimages/${coverImage}`}
                                        alt={product.name || "Shirt"}
                                        className="cc-product-img"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="cc-no-img">NO VISUAL AVAILABLE</div>
                                )}

                                {product.badge && (
                                    <span className="cc-badge">
                                        <Sparkles size={10} />
                                        <span>{product.badge}</span>
                                    </span>
                                )}

                                <button
                                    type="button"
                                    className="cc-remove-btn"
                                    onClick={() => handleRemove(targetDeleteId)}
                                    title="Remove from wishlist"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>

                            <div className="cc-content-box">
                                <div className="cc-meta">
                                    <span className="cc-category">
                                        {product.category || "BESPOKE TAILORED"}
                                    </span>
                                    <h3 className="cc-title">{product.name || "Archived Piece"}</h3>
                                </div>

                                <div className="cc-price-row">
                                    <div className="cc-price-group">
                                        <span className="cc-sale-price">
                                            ₹{Number(product.salePrice || 0).toLocaleString("en-IN")}
                                        </span>
                                        {product.originalPrice && (
                                            <del className="cc-orig-price">
                                                ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                            </del>
                                        )}
                                    </div>
                                    {product.discount && (
                                        <span className="cc-discount-tag">{product.discount}</span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className={`cc-cart-cta ${movingId === product._id ? "loading" : ""}`}
                                    onClick={() => handleAddToCart(product)}
                                    disabled={movingId === product._id || !product._id}
                                >
                                    <ShoppingBag size={14} />
                                    <span>
                                        {movingId === product._id ? "TRANSFERRING..." : "MOVE TO BAG"}
                                    </span>
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default Wishlist;