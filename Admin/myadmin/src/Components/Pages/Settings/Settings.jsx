import React, { useState } from "react";
import {
    Store,
    User,
    CreditCard,
    Truck,
    Bell,
    Check,
    Save,
} from "lucide-react";
import { toast } from "sonner";
import "./Settings.css";

const Settings = () => {
    // active tab state
    const [activeTab, setActiveTab] = useState("general");
    const [saved, setSaved] = useState(false);

    // form state
    const [settingsData, setSettingsData] = useState(() => {
        const savedSettings = localStorage.getItem("adminStoreSettings");
        if (savedSettings) {
            try {
                return JSON.parse(savedSettings);
            } catch {
                // fallback to initial
            }
        }
        return {
            // general
            storeName: "CREST & COLLAR",
            storeEmail: "support@crestandcollar.com",
            storePhone: "+91 84697 58056",
            currency: "INR (₹)",
            timezone: "IST (UTC+05:30)",

            // profile & security
            adminName: "Store Administrator",
            adminEmail: "admin@crestandcollar.com",
            currentPassword: "",
            newPassword: "",

            // payments & taxes
            enableCOD: true,
            enableRazorpay: true,
            taxRate: "12",
            razorpayKey: "rzp_live_xxxxxxxxxxxx",

            // shipping
            flatShippingRate: "99",
            freeShippingThreshold: "1999",
            deliveryDays: "3-5 Business Days",

            // notifications
            orderAlerts: true,
            lowStockAlerts: true,
        };
    });

    // input change handler
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingsData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // Password change validation
        if (settingsData.newPassword && !settingsData.currentPassword) {
            toast.error("Please enter your current password to authorize security changes");
            setActiveTab("profile");
            return;
        }

        if (settingsData.newPassword && settingsData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            setActiveTab("profile");
            return;
        }

        try {
            localStorage.setItem("adminStoreSettings", JSON.stringify(settingsData));
            setSaved(true);
            toast.success("Store configurations updated successfully");
            setTimeout(() => setSaved(false), 2500);
        } catch (error) {
            console.error("Save Settings Error:", error);
            toast.error("Unable to save settings. Please check your storage settings.");
        }
    };

    return (
        <div className="settings-container">
            {/* header */}
            <div className="settings-header">
                <div>
                    <span>CONFIGURATION</span>
                    <h1>Store Settings</h1>
                </div>

                <button
                    type="button"
                    className="save-btn"
                    onClick={handleSubmit}
                >
                    {saved ? <Check size={16} /> : <Save size={16} />}
                    <span>{saved ? "Saved Successfully" : "Save Changes"}</span>
                </button>
            </div>

            {/* settings main layout */}
            <div className="settings-layout">
                {/* left tab menu */}
                <aside className="settings-nav">
                    <button
                        type="button"
                        className={`settings-nav-btn ${activeTab === "general" ? "active" : ""}`}
                        onClick={() => setActiveTab("general")}
                    >
                        <Store size={17} />
                        <span>General Info</span>
                    </button>

                    <button
                        type="button"
                        className={`settings-nav-btn ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={17} />
                        <span>Admin Profile</span>
                    </button>

                    <button
                        type="button"
                        className={`settings-nav-btn ${activeTab === "payments" ? "active" : ""}`}
                        onClick={() => setActiveTab("payments")}
                    >
                        <CreditCard size={17} />
                        <span>Payments & Taxes</span>
                    </button>

                    <button
                        type="button"
                        className={`settings-nav-btn ${activeTab === "shipping" ? "active" : ""}`}
                        onClick={() => setActiveTab("shipping")}
                    >
                        <Truck size={17} />
                        <span>Shipping & Logistics</span>
                    </button>

                    <button
                        type="button"
                        className={`settings-nav-btn ${activeTab === "notifications" ? "active" : ""}`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        <Bell size={17} />
                        <span>Alerts & Notifications</span>
                    </button>
                </aside>

                {/* right tab panel contents */}
                <div className="settings-content">
                    {/* 1. General Tab */}
                    {activeTab === "general" && (
                        <div className="settings-section-card">
                            <h2>Store Identity & Contact</h2>
                            <p>Basic public profile information for your e-commerce storefront.</p>

                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Store / Brand Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={settingsData.storeName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Customer Support Email</label>
                                    <input
                                        type="email"
                                        name="storeEmail"
                                        value={settingsData.storeEmail}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Support Phone Number</label>
                                    <input
                                        type="text"
                                        name="storePhone"
                                        value={settingsData.storePhone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Base Currency</label>
                                    <select
                                        name="currency"
                                        value={settingsData.currency}
                                        onChange={handleChange}
                                    >
                                        <option value="INR (₹)">INR (₹)</option>
                                        <option value="USD ($)">USD ($)</option>
                                        <option value="EUR (€)">EUR (€)</option>
                                        <option value="GBP (£)">GBP (£)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Default Timezone</label>
                                    <input
                                        type="text"
                                        name="timezone"
                                        value={settingsData.timezone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Admin Profile Tab */}
                    {activeTab === "profile" && (
                        <div className="settings-section-card">
                            <h2>Account Credentials & Password</h2>
                            <p>Manage store admin credentials and security login information.</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Admin Name</label>
                                    <input
                                        type="text"
                                        name="adminName"
                                        value={settingsData.adminName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Login Email Address</label>
                                    <input
                                        type="email"
                                        name="adminEmail"
                                        value={settingsData.adminEmail}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="••••••••"
                                        value={settingsData.currentPassword}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="Enter new password (min. 6 chars)"
                                        value={settingsData.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Payments Tab */}
                    {activeTab === "payments" && (
                        <div className="settings-section-card">
                            <h2>Payment Gateways & GST</h2>
                            <p>Configure accepted customer payment options and tax rules.</p>

                            <div className="toggle-list">
                                <label className="toggle-row">
                                    <div>
                                        <strong>Razorpay / Online Gateway</strong>
                                        <small>Accept Cards, UPI, Netbanking & Wallets</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="enableRazorpay"
                                        checked={settingsData.enableRazorpay}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="toggle-row">
                                    <div>
                                        <strong>Cash on Delivery (COD)</strong>
                                        <small>Allow customers to pay upon package receipt</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="enableCOD"
                                        checked={settingsData.enableCOD}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>

                            <div className="form-grid" style={{ marginTop: "20px" }}>
                                <div className="form-group">
                                    <label>Razorpay Key ID</label>
                                    <input
                                        type="text"
                                        name="razorpayKey"
                                        value={settingsData.razorpayKey}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Default GST Rate (%)</label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        value={settingsData.taxRate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Shipping Tab */}
                    {activeTab === "shipping" && (
                        <div className="settings-section-card">
                            <h2>Shipping Rates & Delivery Rules</h2>
                            <p>Set shipping fees, threshold for free shipping, and delivery timelines.</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Standard Flat Rate (₹)</label>
                                    <input
                                        type="number"
                                        name="flatShippingRate"
                                        value={settingsData.flatShippingRate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Free Shipping Min. Order Value (₹)</label>
                                    <input
                                        type="number"
                                        name="freeShippingThreshold"
                                        value={settingsData.freeShippingThreshold}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group full">
                                    <label>Estimated Delivery Timeline</label>
                                    <input
                                        type="text"
                                        name="deliveryDays"
                                        value={settingsData.deliveryDays}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 5. Notifications Tab */}
                    {activeTab === "notifications" && (
                        <div className="settings-section-card">
                            <h2>System Notifications & Alerts</h2>
                            <p>Control automated emails and low inventory threshold triggers.</p>

                            <div className="toggle-list">
                                <label className="toggle-row">
                                    <div>
                                        <strong>Order Confirmation Emails</strong>
                                        <small>Send automated invoices and receipts to customers</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="orderAlerts"
                                        checked={settingsData.orderAlerts}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="toggle-row">
                                    <div>
                                        <strong>Low Inventory Warnings</strong>
                                        <small>Notify admin when shirt stock drops below 5 units</small>
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="lowStockAlerts"
                                        checked={settingsData.lowStockAlerts}
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;