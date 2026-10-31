import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    Package,
    Search,
    Eye,
    RotateCcw,
} from "lucide-react";
import "./Orders.css";

const statusOptions = ["Placed", "Dispatched", "Delivered", "Cancelled"];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchAllOrders = async (showToast = false) => {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

        if (!token) {
            toast.error("Please login to access order ledgers");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3000/order/admin/all", {
                headers: { token: token }
            });

            if (res.data.status === "Success" || res.data.success) {
                setOrders(res.data.data || []);
                if (showToast) {
                    toast.success("Order ledgers synchronized");
                }
            }
        } catch (error) {
            console.error("Order fetch error:", error);
            toast.error(error.response?.data?.message || "Failed to load commission orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    // Status Changes with Loading State & Sonner Feedback
    const handleStatusChange = async (orderId, newStatus) => {
        const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

        if (!token) {
            toast.error("Please login first to authorize changes");
            return;
        }

        setUpdatingId(orderId);
        const toastId = toast.loading(`Updating order status to ${newStatus}...`);

        try {
            const res = await axios.put(
                "http://localhost:3000/order/admin/status-update",
                {
                    orderId: orderId,
                    orderStatus: newStatus,
                },
                {
                    headers: {
                        token: token,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.status === "Success" || res.data.success) {
                toast.success(`Order #${orderId.slice(-8).toUpperCase()} marked as ${newStatus}`, {
                    id: toastId,
                });

                // Update main orders list
                setOrders((prevOrders) =>
                    prevOrders.map((ord) =>
                        ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
                    )
                );

                // Sync selected order if modal is open
                setSelectedOrder((prev) =>
                    prev && prev._id === orderId ? { ...prev, orderStatus: newStatus } : prev
                );
            } else {
                toast.error(res.data.message || "Failed to update status", { id: toastId });
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(error.response?.data?.message || "Failed to update commission status", {
                id: toastId,
            });
        } finally {
            setUpdatingId(null);
        }
    };

    // Safe Image Helper
    const resolveItemImage = (item) => {
        const target = item?.product || item;
        const imgName =
            target?.mainimage ||
            (Array.isArray(target?.previewimages) ? target.previewimages[0] : null) ||
            target?.image ||
            item?.mainimage;

        if (!imgName) return "https://placehold.co/80x100?text=Shirt";
        if (imgName.startsWith("http")) return imgName;
        return `http://localhost:3000/images/productimages/${imgName}`;
    };

    // Filter & Search Logic
    const filteredOrders = orders.filter((order) => {
        const matchesStatus =
            filterStatus === "ALL" ||
            order.orderStatus?.toLowerCase() === filterStatus.toLowerCase();

        const matchesSearch =
            order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone?.includes(searchQuery) ||
            order.city?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div className="admin-orders-page">
            <div className="admin-orders-header">
                <div>
                    <span className="admin-sub-tag">ATELIER CONTROL ARCHIVE</span>
                    <h1>Commissions &amp; Client Orders</h1>
                    <p>Supervise bespoke tailoring queues, dispatch cycles, and client addresses.</p>
                </div>

                <button
                    type="button"
                    className="admin-refresh-btn"
                    onClick={() => fetchAllOrders(true)}
                    disabled={loading}
                >
                    <RotateCcw size={14} className={loading ? "spin" : ""} />
                    <span>REFRESH LOGS</span>
                </button>
            </div>

            {/* Controls: Search & Tabs */}
            <div className="admin-controls-strip">
                <div className="admin-search-box">
                    <Search size={15} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Patron Name, Phone, or City..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="admin-status-tabs">
                    {["ALL", "Placed", "Dispatched", "Delivered", "Cancelled"].map((st) => (
                        <button
                            key={st}
                            type="button"
                            className={`admin-tab-btn ${filterStatus === st ? "active" : ""}`}
                            onClick={() => setFilterStatus(st)}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <div className="admin-orders-loading">
                    <div className="admin-spinner"></div>
                    <p>Retrieving master order ledgers...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="admin-orders-empty">
                    <Package size={44} strokeWidth={1.2} />
                    <h3>No Orders Found</h3>
                    <p>No transactions match the specified filter or query.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-orders-table">
                        <thead>
                            <tr>
                                <th>REF ID</th>
                                <th>PATRON</th>
                                <th>GARMENTS</th>
                                <th>DISPATCH DESTINATION</th>
                                <th>SETTLEMENT</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                });

                                return (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="table-ref-col">
                                                <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                                                <span className="table-date">{formattedDate}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="table-patron-col">
                                                <span className="patron-name">{order.fullName}</span>
                                                <span className="patron-phone">{order.phone}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="table-items-preview">
                                                <span className="items-count-pill">
                                                    {order.items?.length || 0} Article(s)
                                                </span>
                                                <span className="items-preview-names">
                                                    {order.items?.[0]?.product?.name || order.items?.[0]?.name || "Bespoke Shirt"}
                                                    {order.items?.length > 1 ? ` +${order.items.length - 1} more` : ""}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="table-address-col">
                                                <span>{order.city}, {order.pincode}</span>
                                                <small>{order.address}</small>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="table-price-col">
                                                <strong>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                                                <span className="payment-type">
                                                    {order.paymentMethod?.toUpperCase()} • {order.paymentStatus}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="status-dropdown-wrap">
                                                <select
                                                    className={`status-select ${order.orderStatus?.toLowerCase()}`}
                                                    value={order.orderStatus || "Placed"}
                                                    disabled={updatingId === order._id}
                                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                >
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="view-order-btn"
                                                onClick={() => setSelectedOrder(order)}
                                                title="Inspect Commission Details"
                                            >
                                                <Eye size={14} />
                                                <span>Inspect</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details Modal */}
            {selectedOrder && (
                <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span className="modal-kicker">COMMISSION SPECIFICATION</span>
                                <h2>Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() => setSelectedOrder(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-meta-strip">
                                <div>
                                    <label>Patron Details</label>
                                    <p><strong>{selectedOrder.fullName}</strong></p>
                                    <p>{selectedOrder.phone} • {selectedOrder.email || "No Email"}</p>
                                </div>
                                <div>
                                    <label>Destination</label>
                                    <p>{selectedOrder.address}</p>
                                    <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                                </div>
                                <div>
                                    <label>Order Status</label>
                                    <span className={`status-pill ${selectedOrder.orderStatus?.toLowerCase()}`}>
                                        {selectedOrder.orderStatus}
                                    </span>
                                </div>
                            </div>

                            <h3>Ordered Garments ({selectedOrder.items?.length})</h3>
                            <div className="modal-items-list">
                                {selectedOrder.items?.map((item, idx) => {
                                    const product = item.product || item;
                                    return (
                                        <div className="modal-item-row" key={idx}>
                                            <img
                                                src={resolveItemImage(item)}
                                                alt={product.name || "Shirt"}
                                            />
                                            <div className="modal-item-info">
                                                <h4>{product.name || "Artisanal Dress Shirt"}</h4>
                                                <p>Size: {item.size || "M"} • Quantity: {item.quantity || 1}</p>
                                                <strong>
                                                    ₹{Number(product.salePrice || product.price || item.price || 0).toLocaleString("en-IN")}
                                                </strong>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="modal-summary-box">
                                <div className="summary-line">
                                    <span>Subtotal</span>
                                    <span>₹{Number(selectedOrder.subtotal || 0).toLocaleString("en-IN")}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Shipping Charges</span>
                                    <span>{selectedOrder.shippingCharges === 0 ? "FREE" : `₹${selectedOrder.shippingCharges}`}</span>
                                </div>
                                <div className="summary-line total">
                                    <span>Total Amount Paid</span>
                                    <strong>₹{Number(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;