import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    ShoppingBag,
    IndianRupee,
    Users,
    ArrowUpRight,
    Package,
    Layers,
    ChevronRight,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import "./Dashboard.css";

// Dynamic timeframe chart data
const timeFramesData = {
    "7D": [
        { label: "Mon", revenue: 18400, orders: 12 },
        { label: "Tue", revenue: 24200, orders: 16 },
        { label: "Wed", revenue: 21900, orders: 14 },
        { label: "Thu", revenue: 32000, orders: 22 },
        { label: "Fri", revenue: 28400, orders: 19 },
        { label: "Sat", revenue: 41200, orders: 28 },
        { label: "Sun", revenue: 48900, orders: 34 },
    ],
    "30D": [
        { label: "Week 1", revenue: 124000, orders: 84 },
        { label: "Week 2", revenue: 148000, orders: 102 },
        { label: "Week 3", revenue: 139000, orders: 95 },
        { label: "Week 4", revenue: 193000, orders: 138 },
    ],
    "1Y": [
        { label: "Jan", revenue: 420000, orders: 290 },
        { label: "Feb", revenue: 490000, orders: 340 },
        { label: "Mar", revenue: 540000, orders: 380 },
        { label: "Apr", revenue: 610000, orders: 430 },
        { label: "May", revenue: 580000, orders: 410 },
        { label: "Jun", revenue: 720000, orders: 510 },
        { label: "Jul", revenue: 840000, orders: 590 },
        { label: "Aug", revenue: 910000, orders: 640 },
    ],
};

const categoryShare = [
    { name: "Oxford Cotton", value: 38, color: "#111111" },
    { name: "Pure Linen", value: 26, color: "#444444" },
    { name: "Overshirt", value: 20, color: "#777777" },
    { name: "Premium Twill", value: 16, color: "#b0b0a8" },
];

const topProducts = [
    {
        name: "Classic White Oxford",
        category: "Oxford Cotton",
        sales: "342 sold",
        revenue: "₹8,54,658",
        growth: "+24%",
    },
    {
        name: "Midnight Navy Twill",
        category: "Premium Twill",
        sales: "289 sold",
        revenue: "₹7,22,211",
        growth: "+18%",
    },
    {
        name: "Sage Relaxed Linen",
        category: "Pure Linen",
        sales: "214 sold",
        revenue: "₹6,41,786",
        growth: "+31%",
    },
    {
        name: "Heavyweight Overshirt",
        category: "Overshirt",
        sales: "178 sold",
        revenue: "₹5,33,822",
        growth: "+12%",
    },
];

const recentTransactions = [
    {
        id: "#ORD-8941",
        customer: "Aarav Singhania",
        email: "aarav.s@atelier.in",
        item: "Classic White Oxford (Size L)",
        total: "₹2,499",
        status: "Delivered",
        time: "12m ago",
    },
    {
        id: "#ORD-8940",
        customer: "Devansh Mehta",
        email: "devansh@mehta.co",
        item: "Midnight Navy Twill (Size M)",
        total: "₹2,799",
        status: "In Transit",
        time: "48m ago",
    },
    {
        id: "#ORD-8939",
        customer: "Rohan Varma",
        email: "rohan.v@outlook.com",
        item: "Sage Relaxed Linen (Size XL)",
        total: "₹3,199",
        status: "Processing",
        time: "2h ago",
    },
    {
        id: "#ORD-8938",
        customer: "Kabir Roy",
        email: "k.roy@studio.com",
        item: "Overshirt Olive (Size M)",
        total: "₹3,499",
        status: "Delivered",
        time: "4h ago",
    },
];

// Tracks a CSS media query so charts can adapt their ticks / sizes
const useMediaQuery = (query) => {
    const getMatch = () =>
        typeof window !== "undefined" && window.matchMedia
            ? window.matchMedia(query).matches
            : false;
    const [matches, setMatches] = useState(getMatch);

    useEffect(() => {
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, [query]);

    return matches;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const [timeRange, setTimeRange] = useState("7D");
    const [productCount, setProductCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoadingCount(true);
                const res = await axios.get("https://shirt-backend-33gt.onrender.com/shirt/showAll");
                setProductCount(res.data?.data?.length || 0);
            } catch (err) {
                console.error("Error fetching product counts:", err);
                toast.error("Telemetry error: unable to load live SKU count");
            } finally {
                setLoadingCount(false);
            }
        };
        fetchStats();
    }, []);

    const handleTimeRangeSelect = (tf) => {
        setTimeRange(tf);
        toast.info(`Dashboard timeframe shifted to: ${tf}`);
    };

    return (
        <div className="pro-dashboard">
            {/* 1. Header Banner */}
            <div className="dash-hero-header">
                <div>
                    <div className="dash-badge-pill">
                        <Sparkles size={13} />
                        <span>EXECUTIVE ATELIER OVERVIEW</span>
                    </div>
                    <h1>Analytics &amp; Store Intelligence</h1>
                    <p>Real-time metrics, financial trajectory, and inventory telemetry.</p>
                </div>

                <div className="hero-action-group">
                    <div className="live-indicator">
                        <span className="live-dot"></span>
                        <span>Live System Operational</span>
                    </div>
                    <button
                        type="button"
                        className="primary-dash-btn"
                        onClick={() => navigate("/admin/addproduct")}
                    >
                        <Package size={15} />
                        <span>New Product</span>
                    </button>
                </div>
            </div>

            {/* 2. Key Performance Indicators (KPI Cards) */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-title">Gross Revenue</span>
                        <div className="kpi-icon-badge">
                            <IndianRupee size={16} />
                        </div>
                    </div>
                    <div className="kpi-mid">
                        <h2>₹6,04,250</h2>
                    </div>
                    <div className="kpi-footer">
                        <span className="trend-badge up">
                            <ArrowUpRight size={13} />
                            +21.8%
                        </span>
                        <span className="trend-caption">vs last 30 days</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-title">Confirmed Orders</span>
                        <div className="kpi-icon-badge">
                            <ShoppingBag size={16} />
                        </div>
                    </div>
                    <div className="kpi-mid">
                        <h2>748</h2>
                    </div>
                    <div className="kpi-footer">
                        <span className="trend-badge up">
                            <ArrowUpRight size={13} />
                            +14.3%
                        </span>
                        <span className="trend-caption">98.4% fulfillment rate</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-title">Active Inventory</span>
                        <div className="kpi-icon-badge">
                            <Layers size={16} />
                        </div>
                    </div>
                    <div className="kpi-mid">
                        <h2>{loadingCount ? "..." : `${productCount} SKUs`}</h2>
                    </div>
                    <div className="kpi-footer">
                        <span className="trend-badge neutral">
                            <CheckCircle2 size={13} />
                            In Catalog
                        </span>
                        <span className="trend-caption">All stores synchronized</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-title">Customer Base</span>
                        <div className="kpi-icon-badge">
                            <Users size={16} />
                        </div>
                    </div>
                    <div className="kpi-mid">
                        <h2>1,892</h2>
                    </div>
                    <div className="kpi-footer">
                        <span className="trend-badge up">
                            <ArrowUpRight size={13} />
                            +8.5%
                        </span>
                        <span className="trend-caption">32% repeat buyers</span>
                    </div>
                </div>
            </div>

            {/* 3. Main Chart & Category Distribution Grid */}
            <div className="analytics-split-grid">
                {/* Left: Revenue Area Chart */}
                <div className="dash-card main-chart-card">
                    <div className="card-top-bar">
                        <div>
                            <h3>Revenue Trajectory</h3>
                            <p>Income performance analysis across chosen timeframe</p>
                        </div>

                        <div className="timeframe-toggle">
                            {["7D", "30D", "1Y"].map((tf) => (
                                <button
                                    key={tf}
                                    type="button"
                                    className={timeRange === tf ? "active" : ""}
                                    onClick={() => handleTimeRangeSelect(tf)}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="chart-canvas-area">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={timeFramesData[timeRange]}
                                margin={{ top: 12, right: isMobile ? 4 : 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="proRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#111111" stopOpacity={0.22} />
                                        <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: isMobile ? 10.5 : 11.5, fill: "#777" }}
                                    interval="preserveStartEnd"
                                    minTickGap={isMobile ? 8 : 16}
                                />
                                <YAxis
                                    width={isMobile ? 42 : 52}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: isMobile ? 10.5 : 11.5, fill: "#777" }}
                                    tickFormatter={(val) =>
                                        val >= 100000
                                            ? `₹${+(val / 100000).toFixed(1)}L`
                                            : val >= 1000
                                            ? `₹${+(val / 1000).toFixed(1)}k`
                                            : `₹${val}`
                                    }
                                />
                                <Tooltip
                                    formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                                    contentStyle={{
                                        background: "#111",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        border: "none",
                                        fontSize: "12px",
                                        padding: "8px 14px",
                                    }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#111"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#proRevenueGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right: Fabric Category Donut Distribution */}
                <div className="dash-card category-pie-card">
                    <div className="card-top-bar">
                        <div>
                            <h3>Category Share</h3>
                            <p>Volume by fabric</p>
                        </div>
                    </div>

                    <div className="donut-center-wrap">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryShare}
                                    innerRadius="62%"
                                    outerRadius="92%"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {categoryShare.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}%`, "Market Share"]}
                                    contentStyle={{
                                        background: "#111",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        border: "none",
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="category-legend-list">
                        {categoryShare.map((cat) => (
                            <div key={cat.name} className="legend-row">
                                <div className="legend-name">
                                    <span className="color-swatch" style={{ background: cat.color }}></span>
                                    <span>{cat.name}</span>
                                </div>
                                <strong className="legend-val">{cat.value}%</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Bottom Row: Recent Orders & Top Sellers */}
            <div className="bottom-split-grid">
                {/* Left: Recent Activity Table */}
                <div className="dash-card table-section-card">
                    <div className="card-top-bar">
                        <div>
                            <h3>Recent Dispatches</h3>
                            <p>Latest customer transactions and shipping statuses</p>
                        </div>
                        <button
                            type="button"
                            className="ghost-icon-link"
                            onClick={() => navigate("/admin/orders")}
                        >
                            <span>View All Orders</span>
                            <ChevronRight size={15} />
                        </button>
                    </div>

                    <div className="responsive-table-box">
                        <table className="pro-data-table">
                            <thead>
                                <tr>
                                    <th>Order Reference</th>
                                    <th>Client</th>
                                    <th>Product Spec</th>
                                    <th>Amount</th>
                                    <th>Logistics Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map((order) => (
                                    <tr key={order.id}>
                                        <td data-label="Order" className="cell-order">
                                            <span className="order-code">{order.id}</span>
                                            <small className="order-time">{order.time}</small>
                                        </td>
                                        <td data-label="Client">
                                            <div className="client-cell">
                                                <strong>{order.customer}</strong>
                                                <span>{order.email}</span>
                                            </div>
                                        </td>
                                        <td data-label="Product">
                                            <span className="item-title">{order.item}</span>
                                        </td>
                                        <td data-label="Amount">
                                            <strong className="order-amount">{order.total}</strong>
                                        </td>
                                        <td data-label="Status">
                                            <span
                                                className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Top Selling Products */}
                <div className="dash-card topsellers-card">
                    <div className="card-top-bar">
                        <div>
                            <h3>Top Performers</h3>
                            <p>Highest volume shirts</p>
                        </div>
                    </div>

                    <div className="top-products-list">
                        {topProducts.map((item, idx) => (
                            <div key={idx} className="top-product-item">
                                <span className="rank-number">0{idx + 1}</span>
                                <div className="top-product-info">
                                    <h4>{item.name}</h4>
                                    <div className="top-product-meta">
                                        <span>{item.category}</span>
                                        <span className="dot-sep">&bull;</span>
                                        <span>{item.sales}</span>
                                    </div>
                                </div>
                                <div className="top-product-finance">
                                    <strong>{item.revenue}</strong>
                                    <span className="growth-tag">{item.growth}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;