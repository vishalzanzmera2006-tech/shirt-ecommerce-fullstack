import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LucideHash, LucideTrash2, LucideCopy, LucideCheck, LucideSearch, LucideRefreshCw, LucideDownload } from "lucide-react";
import "./AccessRequests.css";

const AccessRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    // Fetch data[cite: 1]
    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:3000/accessrequest/allrequests");
            if (res.data.success) {
                setRequests(res.data.data || []);
            }
        } catch (err) {
            toast.error("Failed to load access requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Filter requests
    const filteredRequests = useMemo(() => {
        return requests.filter((item) =>
            item.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [requests, searchQuery]);

    
    // Delete request[cite: 1]
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this request?")) return;

        try {
            const res = await axios.delete("http://localhost:3000/accessrequest/delete/accessrequest", {
                data: { id: id }
            });

            if (res.data.success) {
                toast.success("Request removed successfully");
                setRequests((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Delete failed";
            toast.error(errMsg);
        }
    };

    // Copy to clipboard[cite: 1]
    const handleCopy = (email, id) => {
        navigator.clipboard.writeText(email);
        setCopiedId(id);
        toast.success(`Copied: ${email}`);
        setTimeout(() => setCopiedId(null), 1800);
    };

    // Export CSV
    const handleExportCSV = () => {
        if (requests.length === 0) {
            toast.error("No requests to export");
            return;
        }

        const headers = "Index,Email,Timestamp\n";
        const rows = requests
            .map((r, i) => `${i + 1},"${r.email}","${new Date(r.createdAt).toISOString()}"`)
            .join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `access_requests_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV file downloaded");
    };

    return (
        <div className="light-admin-root">
            {/* Header Section */}
            <div className="light-header">
                <div>
                    <div className="light-pill">
                        <span className="light-pill-dot"></span>
                        <span>ATELIER // DIRECTORY</span>
                    </div>
                    <h1 className="light-title">INNER CIRCLE REQUESTS</h1>
                    <p className="light-subtitle">Manage VIP early access email applications.</p>
                </div>

                <div className="light-header-actions">
                    <button className="light-btn-secondary" onClick={fetchRequests} disabled={loading}>
                        <LucideRefreshCw size={14} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <button className="light-btn-primary" onClick={handleExportCSV}>
                        <LucideDownload size={14} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="light-metrics-grid">
                <div className="light-metric-card">
                    <span className="metric-heading">Total Subscribers</span>
                    <span className="metric-number">{requests.length}</span>
                    <span className="metric-subtext">All time applications</span>
                </div>
                <div className="light-metric-card">
                    <span className="metric-heading">Filtered Count</span>
                    <span className="metric-number">{filteredRequests.length}</span>
                    <span className="metric-subtext">Currently visible</span>
                </div>
                <div className="light-metric-card">
                    <span className="metric-heading">System Status</span>
                    <span className="metric-number text-accent">Active</span>
                    <span className="metric-subtext">Port 3000 Connected</span>
                </div>
            </div>

            {/* Toolbar / Search */}
            <div className="light-toolbar">
                <div className="light-search-box">
                    <LucideSearch size={16} className="search-icon-svg" />
                    <input
                        type="text"
                        placeholder="Search subscriber by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="light-search-input"
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery("")}>
                            ✕
                        </button>
                    )}
                </div>
                <span className="light-count-info">
                    Showing <strong>{filteredRequests.length}</strong> of {requests.length} items
                </span>
            </div>

            {/* Table Card */}
            <div className="light-table-wrapper">
                {loading ? (
                    <div className="light-state-box">
                        <div className="light-spinner"></div>
                        <p>Loading subscribers...</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="light-state-box">
                        <p className="empty-symbol">✦</p>
                        <h3>No Applications Found</h3>
                        <p className="empty-desc">
                            {searchQuery ? `No records matching "${searchQuery}"` : "Database me koi requests nahi hain."}
                        </p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="light-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "80px" }}>
                                        <div className="ref-head-cell">
                                            <LucideHash size={13} />
                                            <span>REF</span>
                                        </div>
                                    </th>
                                    <th>EMAIL ADDRESS</th>
                                    <th>REGISTERED DATE</th>
                                    <th style={{ width: "160px", textAlign: "right" }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.map((item, index) => (
                                    <tr key={item._id} className="light-table-row">
                                        <td className="ref-number">
                                            #{String(index + 1).padStart(2, "0")}
                                        </td>
                                        <td className="email-cell">
                                            <span className="email-value">{item.email}</span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(item.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td style={{ textAlign: "right" }}>
                                            <div className="action-buttons-group">
                                                <button
                                                    className="action-btn copy-btn"
                                                    onClick={() => handleCopy(item.email, item._id)}
                                                    title="Copy Email"
                                                >
                                                    {copiedId === item._id ? (
                                                        <LucideCheck size={14} className="copied-icon" />
                                                    ) : (
                                                        <LucideCopy size={14} />
                                                    )}
                                                    <span>{copiedId === item._id ? "Copied" : "Copy"}</span>
                                                </button>

                                                <button
                                                    className="action-btn delete-btn"
                                                    onClick={() => handleDelete(item._id)}
                                                    title="Delete Entry"
                                                >
                                                    <LucideTrash2 size={14} />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccessRequests;