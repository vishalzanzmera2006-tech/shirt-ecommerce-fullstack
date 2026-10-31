import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Search, RotateCcw, UserCheck, UserX, Mail, Phone, Calendar } from "lucide-react";
import "./Customers.css";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch all registered customers
    const getData = async (showToast = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");

            const res = await axios.get("http://localhost:3000/users/customers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    token: token,
                },
            });

            const rawList = res.data?.data || res.data || [];
            const userList = Array.isArray(rawList)
                ? rawList.filter((u) => u.role !== "admin")
                : [];

            setCustomers(userList);
            if (showToast) {
                toast.success("Customer directory updated");
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to load customer directory. Please check authorization."
            );
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        getData(true);
    };

    // Toggle user active status (Block / Unblock)
    const handleToggleStatus = async (id, currentStatus) => {
        const confirmAction = window.confirm(
            `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this customer?`
        );
        if (!confirmAction) return;

        try {
            const token = localStorage.getItem("adminToken");

            await axios.patch(
                `http://localhost:3000/users/customer-status/${id}`,
                { isActive: !currentStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        token: token,
                    },
                }
            );

            // Local state update
            setCustomers((prev) =>
                prev.map((c) => (c._id === id ? { ...c, isActive: !currentStatus } : c))
            );

            if (currentStatus) {
                toast.warning("Customer access suspended");
            } else {
                toast.success("Customer account reactivated");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to update customer account status"
            );
        }
    };

    // Search filter by name, email, or phone
    const filteredCustomers = customers.filter((c) => {
        const term = searchQuery.toLowerCase();
        return (
            c.fname?.toLowerCase().includes(term) ||
            c.email?.toLowerCase().includes(term) ||
            c.phone?.includes(term)
        );
    });

    return (
        <div className="customers-container">
            {/* Header */}
            <div className="customers-header">
                <div>
                    <span>USER DIRECTORY</span>
                    <h1>Registered Customers ({customers.length})</h1>
                </div>

                <button
                    type="button"
                    className={`refresh-btn ${isRefreshing ? "spinning" : ""}`}
                    onClick={handleRefresh}
                    title="Refresh List"
                >
                    <RotateCcw size={15} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Search Toolbar */}
            <div className="table-toolbar">
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Customer List Display */}
            {loading ? (
                <div className="empty-state-box">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
                <div className="empty-state-box">No customers found.</div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map((cust) => (
                        <div className="customer-card" key={cust._id}>
                            <div className="customer-card-header">
                                <div className="customer-avatar">
                                    {cust.fname ? cust.fname.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div>
                                    <h3 className="customer-name">{cust.fname}</h3>
                                    <span className={`status-badge ${cust.isActive ? "active" : "inactive"}`}>
                                        {cust.isActive ? "Active Account" : "Deactivated"}
                                    </span>
                                </div>
                            </div>

                            <div className="customer-details">
                                <div className="detail-item">
                                    <Mail size={14} />
                                    <span>{cust.email}</span>
                                </div>
                                <div className="detail-item">
                                    <Phone size={14} />
                                    <span>{cust.phone || "No phone provided"}</span>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={14} />
                                    <span>
                                        Joined: {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="customer-card-actions">
                                <button
                                    type="button"
                                    className={`status-toggle-btn ${cust.isActive ? "block-btn" : "activate-btn"}`}
                                    onClick={() => handleToggleStatus(cust._id, cust.isActive)}
                                >
                                    {cust.isActive ? (
                                        <>
                                            <UserX size={14} />
                                            <span>Suspend Access</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserCheck size={14} />
                                            <span>Reactivate</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}