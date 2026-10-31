import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import {
    Minus,
    Plus,
    Trash2,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    Truck,
    Sparkles,
    Layers,
} from "lucide-react";

import { setCart, removeCart } from "../../Redux/cartSlice";
import "./Cart.css";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items || []);

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    // Checkout Navigation
    const handleProceedToCheckout = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to proceed to checkout");
            navigate("/login");
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            toast.error("Your shopping bag is empty");
            return;
        }

        navigate("/checkout");
    };

    // Fetch Cart Items
    useEffect(() => {
        const getCart = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                dispatch(setCart([]));
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("https://shirt-backend-33gt.onrender.com/cart", {
                    headers: { token: token },
                });
                dispatch(setCart(res.data.data || []));
            } catch (error) {
                console.error("Get Cart Error:", error);
                toast.error("Unable to load your shopping bag");
                dispatch(setCart([]));
            } finally {
                setLoading(false);
            }
        };

        getCart();
    }, [dispatch]);

    // Remove Item from Bag
    const handleRemove = async (cartId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`https://shirt-backend-33gt.onrender.com/cart/remove/${cartId}`, {
                headers: { token: token },
            });

            dispatch(removeCart(cartId));
            toast.success("Article removed from your bag"); // 👈 Clean luxury message
        } catch (error) {
            console.error(
                "Remove Cart Error:",
                error.response?.data || error.message
            );
            toast.error("Failed to remove article. Please try again.");
        }
    };

    // Update Quantity (+ / -)
    const handleUpdateQuantity = async (item, delta) => {
        const newQty = Number(item.quantity) + delta;
        if (newQty < 1) return;

        const token = localStorage.getItem("token");
        setUpdatingId(item.product._id);

        try {
            await axios.patch(
                `https://shirt-backend-33gt.onrender.com/cart/update/${item.product._id}`,
                { quantity: newQty },
                { headers: { token: token } }
            );

            const updatedCart = cartItems.map((cartItem) =>
                cartItem.product._id === item.product._id
                    ? { ...cartItem, quantity: newQty }
                    : cartItem
            );

            dispatch(setCart(updatedCart));
            toast.success("Bag quantity updated");
        } catch (error) {
            console.error("Quantity Update Error:", error.response?.data || error.message);
            toast.error("Failed to update quantity");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <section className="cart-viewport">
                <div className="cart-status-box">
                    <div className="cart-ring-loader"></div>
                    <span>GATHERING YOUR BAG...</span>
                </div>
            </section>
        );
    }

    if (cartItems.length === 0) {
        return (
            <section className="cart-viewport">
                <div className="empty-cart-card">
                    <div className="empty-cart-pill">
                        <ShoppingBag size={34} strokeWidth={1.2} />
                    </div>
                    <span className="cart-kicker">WARDROBE ARCHIVE</span>
                    <h1>Your Shopping Bag is Empty</h1>
                    <p>
                        Explore our curated tailored shirts and bespoke fabrics to begin building your custom lookbook.
                    </p>
                    <button className="primary-dark-btn" onClick={() => navigate("/")}>
                        <span>EXPLORE THE COLLECTION</span>
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>
        );
    }

    const subtotal = cartItems.reduce(
        (acc, item) =>
            acc + Number(item.product?.salePrice || 0) * Number(item.quantity || 1),
        0
    );

    const freeShippingThreshold = 5000;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : 150;
    const grandTotal = subtotal + shippingFee;
    const freeShippingLeft = Math.max(0, freeShippingThreshold - subtotal);
    const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

    return (
        <section className="cart-viewport">
            {/* Header */}
            <div className="cart-hero-header">
                <div className="cart-hero-meta">
                    <div className="cart-counter-pill">
                        <Layers size={13} />
                        <span>
                            {cartItems.length} {cartItems.length === 1 ? "ARTICLE" : "ARTICLES"}
                        </span>
                    </div>
                </div>

                <div className="cart-hero-title">
                    <h1>Shopping Bag</h1>
                    <p>Review and finalize your bespoke tailoring order.</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="cart-grid-container">
                {/* Left Column: Items */}
                <div className="cart-main-items">
                    {/* Free Shipping Progress Bar */}
                    <div className="shipping-progress-banner">
                        <div className="shipping-progress-labels">
                            <span>
                                {shippingFee === 0 ? (
                                    <strong>Complimentary express shipping unlocked!</strong>
                                ) : (
                                    <>
                                        Add <strong>₹{freeShippingLeft.toLocaleString("en-IN")}</strong> more for complimentary delivery.
                                    </>
                                )}
                            </span>
                            <span className="progress-percent">{Math.round(shippingProgress)}%</span>
                        </div>
                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{ width: `${shippingProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="cart-item-list">
                        {cartItems.map((item) => {
                            const product = item.product || {};
                            const coverImage =
                                product.mainimage ||
                                (Array.isArray(product.previewimages) ? product.previewimages[0] : null);

                            const lineTotal =
                                Number(product.salePrice || 0) * Number(item.quantity || 1);

                            return (
                                <div className="cart-entry-card" key={item._id || product._id}>
                                    <div className="cart-thumbnail-box">
                                        {coverImage ? (
                                            <img
                                                src={`https://shirt-backend-33gt.onrender.com/images/productimages/${coverImage}`}
                                                alt={product.name || "Shirt"}
                                                className="cart-thumbnail-img"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="cart-no-img">NO VISUAL</div>
                                        )}
                                        {product.badge && (
                                            <span className="cart-entry-badge">
                                                <Sparkles size={10} />
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>

                                    <div className="cart-entry-content">
                                        <div className="cart-entry-header">
                                            <div>
                                                <span className="cart-entry-category">
                                                    {product.category || "BESPOKE SHIRT"}
                                                </span>
                                                <h2 className="cart-entry-title">{product.name}</h2>
                                            </div>
                                            <button
                                                type="button"
                                                className="cart-delete-icon-btn"
                                                onClick={() => handleRemove(item._id)}
                                                title="Remove article"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="cart-entry-specs">
                                            <span className="spec-badge">Fit: Tailored</span>
                                            {product.sizes && product.sizes.length > 0 && (
                                                <span className="spec-badge">Size: {product.sizes[0]}</span>
                                            )}
                                        </div>

                                        <div className="cart-entry-footer">
                                            {/* Quantity Stepper */}
                                            <div className="quantity-stepper">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item, -1)}
                                                    disabled={item.quantity <= 1 || updatingId === product._id}
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateQuantity(item, 1)}
                                                    disabled={updatingId === product._id}
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            {/* Price Display */}
                                            <div className="cart-entry-prices">
                                                <span className="item-unit-price">
                                                    ₹{Number(product.salePrice || 0).toLocaleString("en-IN")} each
                                                </span>
                                                <strong className="item-total-price">
                                                    ₹{lineTotal.toLocaleString("en-IN")}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Guarantee Badges */}
                    <div className="cart-assurance-strip">
                        <div className="assurance-box">
                            <Truck size={18} />
                            <div>
                                <strong>BESPOKE LOGISTICS</strong>
                                <span>Direct tailored fulfillment & tracked transit</span>
                            </div>
                        </div>
                        <div className="assurance-box">
                            <ShieldCheck size={18} />
                            <div>
                                <strong>SECURE TRANSACTIONS</strong>
                                <span>256-bit encrypted checkout gateway</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <aside className="cart-order-sidebar">
                    <div className="sidebar-inner-card">
                        <div className="order-summary-title">
                            <h3>ORDER SUMMARY</h3>
                            <ShoppingBag size={17} />
                        </div>

                        <div className="receipt-rows">
                            <div className="receipt-line">
                                <span>Bag Subtotal</span>
                                <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                            </div>

                            <div className="receipt-line">
                                <span>Shipping</span>
                                <strong className={shippingFee === 0 ? "free-tag" : ""}>
                                    {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
                                </strong>
                            </div>

                            <div className="receipt-line">
                                <span>Estimated Taxes</span>
                                <span className="muted-italic">Calculated at step 2</span>
                            </div>
                        </div>

                        <div className="receipt-separator"></div>

                        <div className="receipt-grand-total">
                            <div>
                                <span>ESTIMATED TOTAL</span>
                                <small>Including all import & duties</small>
                            </div>
                            <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                        </div>

                        <button
                            type="button"
                            className="checkout-action-btn"
                            onClick={handleProceedToCheckout}
                        >
                            <span>CHECKOUT SECURELY</span>
                            <ArrowRight size={16} />
                        </button>

                        <p className="checkout-guarantee-note">
                            30-day tailoring adjustment guarantee on all registered garments.
                        </p>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default Cart;