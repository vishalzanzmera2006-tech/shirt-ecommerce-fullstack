import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, ArrowRight, CreditCard, Truck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { clearCart } from "../../Redux/cartSlice";
import "./Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cartItems = useSelector((state) => state.cart?.items || []);

    const [shippingData, setShippingData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "Gujarat",
        pincode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("online");
    const [isProcessing, setIsProcessing] = useState(false);

    // Subtotal calculation
    const subtotal = cartItems.reduce((acc, item) => {
        const price = Number(item.product?.salePrice || item.product?.originalPrice || item.price || 0);
        const qty = Number(item.quantity || 1);
        return acc + price * qty;
    }, 0);

    const shippingCharges = subtotal > 5000 || subtotal === 0 ? 0 : 250;
    const totalAmount = subtotal + shippingCharges;

    const handleInputChange = (e) => {
        setShippingData({ ...shippingData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to confirm your order");
            navigate("/login");
            return;
        }

        // Mandatory fields check
        if (!shippingData.fullName.trim() || !shippingData.phone.trim() || !shippingData.address.trim() || !shippingData.pincode.trim()) {
            toast.error("Please provide all required delivery details");
            return;
        }

        setIsProcessing(true);

        try {
            const res = await axios.post(
                "https://shirt-backend-33gt.onrender.com/order/create",
                {
                    items: cartItems,
                    ...shippingData,
                    paymentMethod,
                    subtotal,
                    shippingCharges,
                    totalAmount,
                },
                { headers: { token } }
            );

            console.log("Order placed response:", res.data);

            if (res.data.status === "Success" || res.status === 201) {
                try {
                    await axios.delete("https://shirt-backend-33gt.onrender.com/cart/clear", {
                        headers: { token },
                    });
                } catch (err) {
                    console.error("Cart clear error:", err);
                }

                dispatch(clearCart());
                localStorage.removeItem("cart");

                toast.success("Order secured successfully!");

                const orderId = res.data?.data?._id || "SUCCESS";
                navigate("/ordersuccess", { state: { orderId } });

            } else {
                toast.error(res.data.message || "Unable to place order. Please try again.");
            }
        } catch (error) {
            console.error("Order Error:", error);
            toast.error(error.response?.data?.message || "Payment or order processing failed");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Your Bag is Empty</h2>
                <p>Add some garments to your cart before proceeding to checkout.</p>
                <button onClick={() => navigate("/")} className="checkout-back-btn">
                    Return to Atelier
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                {/* Left Form: Shipping & Payment */}
                <form onSubmit={handlePlaceOrder} className="checkout-form-col">
                    {/* 1. Delivery Address */}
                    <div className="checkout-block">
                        <div className="checkout-block-header">
                            <span className="step-num">1</span>
                            <h3>Bespoke Delivery Address</h3>
                        </div>

                        <div className="checkout-grid-inputs">
                            <div className="input-group full">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="e.g. Aarav Mehta"
                                    value={shippingData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="10-digit mobile"
                                    value={shippingData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@domain.com"
                                    value={shippingData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="input-group full">
                                <label>Street Address & Landmark *</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="House/Flat No, Building, Road"
                                    value={shippingData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Surat"
                                    value={shippingData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Postal PIN Code *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="395007"
                                    value={shippingData.pincode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Payment Method */}
                    <div className="checkout-block">
                        <div className="checkout-block-header">
                            <span className="step-num">2</span>
                            <h3>Select Payment Preference</h3>
                        </div>

                        <div className="payment-options-grid">
                            <label className={`payment-card ${paymentMethod === "online" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={() => setPaymentMethod("online")}
                                />
                                <div className="payment-content">
                                    <CreditCard size={18} />
                                    <div>
                                        <strong>Razorpay Secure Pay (UPI / Cards / NetBanking)</strong>
                                        <p>Instant complimentary gift packaging included</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`payment-card ${paymentMethod === "cod" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={() => setPaymentMethod("cod")}
                                />
                                <div className="payment-content">
                                    <Truck size={18} />
                                    <div>
                                        <strong>Cash On Delivery (Bespoke Courier)</strong>
                                        <p>Pay verified carrier upon doorstep delivery</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <button type="submit" disabled={isProcessing} className="checkout-submit-btn">
                        <Lock size={15} />
                        <span>{isProcessing ? "SECURING ORDER..." : `PLACE ORDER • ₹${totalAmount.toLocaleString("en-IN")}`}</span>
                        <ArrowRight size={15} />
                    </button>
                </form>

                {/* Right Summary: Sticky Cart Items */}
                <div className="checkout-summary-col">
                    <div className="checkout-summary-card">
                        <h3>Order Summary ({cartItems.length} Garments)</h3>

                        <div className="summary-items-list">
                            {cartItems.map((item, idx) => {
                                const product = item.product || item;
                                const price = Number(product.salePrice || product.originalPrice || 0);
                                return (
                                    <div key={idx} className="summary-item-row">
                                        <img
                                            src={`https://shirt-backend-33gt.onrender.com/images/productimages/${product.mainimage}`}
                                            alt={product.name}
                                            className="summary-thumb"
                                        />
                                        <div className="summary-item-details">
                                            <h4>{product.name}</h4>
                                            <p>Size: {item.size || "M"} • Qty: {item.quantity || 1}</p>
                                            <span className="summary-item-price">
                                                ₹{(price * (item.quantity || 1)).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="summary-calc-block">
                            <div className="calc-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="calc-row">
                                <span>Express Tailored Logistics</span>
                                <span>{shippingCharges === 0 ? "COMPLIMENTARY" : `₹${shippingCharges}`}</span>
                            </div>
                            <div className="calc-row total-row">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        <div className="checkout-trust-badge">
                            <ShieldCheck size={16} />
                            <span>Encrypted 256-Bit SSL Architecture</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;