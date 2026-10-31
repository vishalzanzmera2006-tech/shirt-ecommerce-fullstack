import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Package, Clock, ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";
import "./MyOrders.css";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to view your orders");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3000/order/myorders", {
                headers: { token },
            });

            if (res.data.status === "Success") {
                setOrders(res.data.data || []);
            }
        } catch (error) {
            console.error("Fetch Orders Error:", error);
            toast.error("Unable to retrieve your order history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Cancel Order
    const handleCancelOrder = async (orderId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this bespoke commission?");
        if (!confirmCancel) return;

        try {
            setCancellingId(orderId);
            const token = localStorage.getItem("token");

            const res = await axios.put(
                "http://localhost:3000/order/cancel",
                { orderId },
                { headers: { token } }
            );

            if (res.data.status === "Success") {
                setOrders(res.data.data || []);
                toast.success("Commission cancelled successfully");
            } else {
                toast.error(res.data.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Cancel Order Error:", error);
            toast.error(error.response?.data?.message || "Failed to cancel order. Please try again.");
        } finally {
            setCancellingId(null);
        }
    };

    // Safe Image Extractor function
    const resolveItemImage = (item) => {
        const prod = item?.product || item;

        const imgName =
            prod?.mainimage ||
            (Array.isArray(prod?.previewimages) ? prod.previewimages[0] : null) ||
            prod?.image ||
            item?.mainimage;

        if (!imgName) {
            return "https://placehold.co/120x150/f8fafc/0f172a?text=Shirt";
        }

        if (imgName.startsWith("http://") || imgName.startsWith("https://") || imgName.startsWith("data:")) {
            return imgName;
        }

        return `http://localhost:3000/images/productimages/${imgName}`;
    };

    if (loading) {
        return (
            <div className="orders-loading-state">
                <div className="orders-spinner"></div>
                <p>Retrieving your order records...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-empty-state">
                <Package size={52} strokeWidth={1.5} />
                <h2>No Orders Placed Yet</h2>
                <p>You haven't commissioned any pieces from our collection.</p>
                <button type="button" onClick={() => navigate("/newin")}>
                    Explore Collection
                </button>
            </div>
        );
    }

    return (
        <div className="my-orders-container">
            <div className="orders-header">
                <h1>Order History</h1>
                <p>Review and track your bespoke garment commissions and fulfillment status.</p>
            </div>

            <div className="orders-list">
                {orders.map((order) => {
                    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    });

                    const currentStatus = order.orderStatus || "Placed";

                    return (
                        <div className="order-card" key={order._id}>
                            {/* Order Card Top Bar */}
                            <div className="order-card-top">
                                <div className="order-info-meta">
                                    <span className="order-tag">COMMISSION REFERENCE</span>
                                    <h3>#{order._id.slice(-8).toUpperCase()}</h3>
                                    <span className="order-date">
                                        <Clock size={12} /> Ordered on {formattedDate}
                                    </span>
                                </div>

                                <div className="order-badges">
                                    <span className={`status-pill ${currentStatus.toLowerCase()}`}>
                                        {currentStatus}
                                    </span>
                                    <span className="payment-pill">
                                        {order.paymentMethod ? order.paymentMethod.toUpperCase() : "ONLINE"} • {order.paymentStatus || "Pending"}
                                    </span>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="order-items-grid">
                                {order.items?.map((item, idx) => {
                                    const product = item?.product || item;
                                    const title = product?.name || "Bespoke Dress Shirt";
                                    const price = Number(product?.salePrice || product?.originalPrice || item?.price || 0);
                                    const qty = Number(item?.quantity || 1);
                                    const size = item?.size || (product?.sizes && product.sizes[0]) || "M";

                                    return (
                                        <div className="order-item-row" key={idx}>
                                            <img
                                                src={resolveItemImage(item)}
                                                alt={title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/120x150/f8fafc/0f172a?text=Shirt";
                                                }}
                                            />
                                            <div className="order-item-details">
                                                <h4>{title}</h4>
                                                <div className="item-meta-row">
                                                    <span className="spec-badge">Size: {size}</span>
                                                    <span className="spec-badge">Qty: {qty}</span>
                                                </div>
                                                <p className="item-price">
                                                    ₹{price.toLocaleString("en-IN")}
                                                    {qty > 1 && (
                                                        <span className="item-subtotal-hint">
                                                            {" "}(₹{(price * qty).toLocaleString("en-IN")} total)
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary Bottom Bar */}
                            <div className="order-card-bottom">
                                <div className="shipping-address-snippet">
                                    <span className="addr-label">DISPATCH DESTINATION</span>
                                    <p className="addr-recipient">
                                        <strong>{order.fullName}</strong> {order.phone ? `(${order.phone})` : ""}
                                    </p>
                                    <p className="addr-text">
                                        {order.address}, {order.city} - {order.pincode}
                                    </p>
                                </div>

                                <div className="order-summary-action">
                                    <div className="total-amount-box">
                                        <span className="total-label">TOTAL PAID</span>
                                        <span className="total-val">₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</span>
                                    </div>

                                    {currentStatus !== "Cancelled" && currentStatus !== "Delivered" && (
                                        <button
                                            type="button"
                                            className="cancel-order-btn"
                                            disabled={cancellingId === order._id}
                                            onClick={() => handleCancelOrder(order._id)}
                                        >
                                            {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;