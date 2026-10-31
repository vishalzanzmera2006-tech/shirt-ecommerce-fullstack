import React, { useState } from "react";
import {
    Zap,
    Download,
    MapPin,
} from "lucide-react";
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import "./Analytics.css";

// Conversion & Traffic Flow
const trafficConversionData = [
    { day: "Mon", visitors: 2400, checkout: 420, purchased: 110 },
    { day: "Tue", visitors: 3200, checkout: 580, purchased: 164 },
    { day: "Wed", visitors: 2900, checkout: 510, purchased: 142 },
    { day: "Thu", visitors: 4100, checkout: 720, purchased: 218 },
    { day: "Fri", visitors: 3800, checkout: 680, purchased: 195 },
    { day: "Sat", visitors: 5400, checkout: 940, purchased: 290 },
    { day: "Sun", visitors: 6100, checkout: 1120, purchased: 345 },
];

// Payment Methods
const paymentMethodData = [
    { name: "UPI (GPay/PhonePe)", value: 54, color: "#111111" },
    { name: "Credit/Debit Cards", value: 24, color: "#3b82f6" },
    { name: "Cash on Delivery", value: 16, color: "#f59e0b" },
    { name: "Net Banking", value: 6, color: "#9ca3af" },
];

// Device Split
const deviceData = [
    { name: "Mobile", value: 78, color: "#111111" },
    { name: "Desktop", value: 18, color: "#64748b" },
    { name: "Tablet", value: 4, color: "#cbd5e1" },
];

// Top Geographic Demand
const regionData = [
    { state: "Maharashtra", orders: 420, revenue: "₹10,49,580", percentage: "28%" },
    { state: "Delhi NCR", orders: 340, revenue: "₹8,49,660", percentage: "22%" },
    { state: "Gujarat", orders: 280, revenue: "₹6,99,720", percentage: "18%" },
    { state: "Karnataka", orders: 210, revenue: "₹5,24,790", percentage: "14%" },
    { state: "Tamil Nadu", orders: 150, revenue: "₹3,74,850", percentage: "10%" },
];

const Analytics = () => {
    const [activeRange, setActiveRange] = useState("30D");

    const handleRangeChange = (range) => {
        setActiveRange(range);
        toast.info(`Metrics filtered for: ${range}`);
    };

    const handleExport = () => {
        toast.success("Telemetry report exported to CSV successfully");
    };

    return (
        <div className="analytics-container">
            {/* 1. Header Banner */}
            <div className="analytics-header">
                <div>
                    <div className="analytics-tag">
                        <Zap size={13} />
                        <span>BUSINESS INTELLIGENCE & TELEMETRY</span>
                    </div>
                    <h1>Sales & Consumer Analytics</h1>
                    <p>Deep data metrics covering conversion funnel, payment flows, and geographical density.</p>
                </div>

                <div className="analytics-header-actions">
                    <div className="range-pills">
                        {["7D", "30D", "Quarter", "YTD"].map((range) => (
                            <button
                                key={range}
                                type="button"
                                className={activeRange === range ? "active" : ""}
                                onClick={() => handleRangeChange(range)}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    <button 
                        type="button" 
                        className="export-report-btn" 
                        onClick={handleExport}
                    >
                        <Download size={15} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* 2. Core Business Metrics */}
            <div className="analytics-kpi-grid">
                <div className="analytics-kpi-card">
                    <div className="kpi-meta">
                        <span>Avg Order Value (AOV)</span>
                        <span className="badge-growth positive">+12.4%</span>
                    </div>
                    <h2>₹2,840</h2>
                    <small>Up from ₹2,520 last month</small>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-meta">
                        <span>Store Conversion Rate</span>
                        <span className="badge-growth positive">+3.8%</span>
                    </div>
                    <h2>4.62%</h2>
                    <small>Sessions to orders completed</small>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-meta">
                        <span>Cart Abandonment</span>
                        <span className="badge-growth negative">-5.1%</span>
                    </div>
                    <h2>32.4%</h2>
                    <small>Industry standard avg: 45%</small>
                </div>

                <div className="analytics-kpi-card">
                    <div className="kpi-meta">
                        <span>Return / Exchange Rate</span>
                        <span className="badge-growth neutral">Stable</span>
                    </div>
                    <h2>1.8%</h2>
                    <small>24 returns in 1,248 shipments</small>
                </div>
            </div>

            {/* 3. Conversion Funnel Chart */}
            <div className="analytics-chart-card">
                <div className="chart-title-bar">
                    <div>
                        <h3>Traffic vs Checkout Conversion Funnel</h3>
                        <p>Comparing website visitors with final completed purchases</p>
                    </div>
                    <div className="funnel-legend">
                        <span className="legend-indicator visitors">Visitors</span>
                        <span className="legend-indicator checkout">Initiated Checkout</span>
                        <span className="legend-indicator purchased">Purchased</span>
                    </div>
                </div>

                <div className="chart-body-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trafficConversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="purchasedGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#111111" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1ee" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#777" }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#777" }} />
                            <Tooltip
                                contentStyle={{ background: "#111", borderRadius: "6px", color: "#fff", border: "none", fontSize: "12px" }}
                                itemStyle={{ color: "#fff" }}
                            />
                            <Area type="monotone" dataKey="visitors" stroke="#94a3b8" strokeWidth={2} fill="url(#visitorsGrad)" />
                            <Area type="monotone" dataKey="checkout" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                            <Area type="monotone" dataKey="purchased" stroke="#111111" strokeWidth={2.5} fill="url(#purchasedGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 4. Split Cards: Payment Methods & Device Split */}
            <div className="analytics-dual-grid">
                {/* Payment Methods */}
                <div className="analytics-chart-card">
                    <div className="chart-title-bar">
                        <div>
                            <h3>Payment Method Distribution</h3>
                            <p>Breakdown of checkout gateways chosen by buyers</p>
                        </div>
                    </div>
                    <div className="donut-content-split">
                        <ResponsiveContainer width="50%" height={190}>
                            <PieChart>
                                <Pie data={paymentMethodData} innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                                    {paymentMethodData.map((item, idx) => (
                                        <Cell key={idx} fill={item.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="custom-legend-col">
                            {paymentMethodData.map((item) => (
                                <div key={item.name} className="legend-item-row">
                                    <div className="legend-label">
                                        <span className="dot" style={{ background: item.color }}></span>
                                        <span>{item.name}</span>
                                    </div>
                                    <strong>{item.value}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Device Acquisition */}
                <div className="analytics-chart-card">
                    <div className="chart-title-bar">
                        <div>
                            <h3>Platform & Device Origin</h3>
                            <p>Browsing platform split across all visitors</p>
                        </div>
                    </div>
                    <div className="donut-content-split">
                        <ResponsiveContainer width="50%" height={190}>
                            <PieChart>
                                <Pie data={deviceData} innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                                    {deviceData.map((item, idx) => (
                                        <Cell key={idx} fill={item.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="custom-legend-col">
                            {deviceData.map((item) => (
                                <div key={item.name} className="legend-item-row">
                                    <div className="legend-label">
                                        <span className="dot" style={{ background: item.color }}></span>
                                        <span>{item.name}</span>
                                    </div>
                                    <strong>{item.value}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Geographic Order Breakdown Table */}
            <div className="analytics-chart-card">
                <div className="chart-title-bar">
                    <div>
                        <h3>Geographic Sales Distribution (India)</h3>
                        <p>Top revenue contributing states and region demand</p>
                    </div>
                </div>

                <div className="region-table-wrapper">
                    <table className="region-table">
                        <thead>
                            <tr>
                                <th>State / Region</th>
                                <th>Orders Fulfilled</th>
                                <th>Gross Revenue</th>
                                <th>Volume Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {regionData.map((reg) => (
                                <tr key={reg.state}>
                                    <td className="state-name">
                                        <MapPin size={14} style={{ color: "#777", marginRight: "6px" }} />
                                        {reg.state}
                                    </td>
                                    <td>{reg.orders} shipments</td>
                                    <td className="revenue-val">{reg.revenue}</td>
                                    <td>
                                        <div className="volume-bar-wrap">
                                            <div className="volume-progress-bar" style={{ width: reg.percentage }}></div>
                                            <span>{reg.percentage}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;