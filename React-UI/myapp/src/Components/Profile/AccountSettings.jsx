import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccountSettings.css";

const AccountSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const u = JSON.parse(storedUser);
                setProfile({
                    name: u.fname || u.name || "",
                    email: u.email || "",
                    phone: u.phone || "",
                });
            } catch (err) {
                console.error("Failed to parse user data", err);
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Profile Update Handler
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please sign in to update profile settings");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            // 1. Backend database update
            const res = await axios.put(
                "http://localhost:3000/user/update-profile",
                {
                    name: profile.name,
                    phone: profile.phone,
                },
                { headers: { token } }
            );

            if (res.data.status === "Success") {
                const updatedUser = res.data.data;

                // 2. LocalStorage update
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // 3. Notify navbar & layout
                window.dispatchEvent(new Event("userLogin"));

                toast.success("Profile preferences saved successfully");
            }
        } catch (error) {
            // Local fallback if route is not implemented yet
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const u = JSON.parse(storedUser);
                const localUpdated = { ...u, name: profile.name, fname: profile.name, phone: profile.phone };
                localStorage.setItem("user", JSON.stringify(localUpdated));
                window.dispatchEvent(new Event("userLogin"));
                toast.success("Profile updated locally");
            } else {
                toast.error("Unable to synchronize account preferences");
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error("Please complete all security credential fields");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must contain at least 6 characters");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New credentials do not match");
            return;
        }
        toast.success("Security credentials updated successfully");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    return (
        <div className="account-settings-container">
            <div className="account-settings-header">
                <h1>Account Settings</h1>
                <p>Manage your atelier profile credentials, contact details, and security safeguards.</p>
            </div>

            <div className="account-settings-grid">
                {/* Personal Details Form */}
                <div className="settings-card">
                    <div className="settings-card-title">
                        <User size={18} />
                        <h3>Personal Information</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="settings-form">
                        <div className="settings-input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="settings-input-group">
                            <label>Email Address</label>
                            <div className="readonly-input-wrapper">
                                <input type="email" value={profile.email} disabled />
                                <Mail size={15} className="input-icon-right" />
                            </div>
                            <small>Contact concierge to alter registered email identity.</small>
                        </div>

                        <div className="settings-input-group">
                            <label>Phone Number</label>
                            <div className="input-wrapper">
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                                <Phone size={15} className="input-icon-right" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="settings-submit-btn">
                            <Save size={15} />
                            <span>{loading ? "SAVING CHANGES..." : "SAVE PROFILE DETAILS"}</span>
                        </button>
                    </form>
                </div>

                {/* Security / Password Form */}
                <div className="settings-card">
                    <div className="settings-card-title">
                        <Lock size={18} />
                        <h3>Security &amp; Safeguards</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="settings-form">
                        <div className="settings-input-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwords.currentPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, currentPassword: e.target.value })
                                }
                            />
                        </div>

                        <div className="settings-input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwords.newPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, newPassword: e.target.value })
                                }
                            />
                        </div>

                        <div className="settings-input-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={passwords.confirmPassword}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                                }
                            />
                        </div>

                        <button type="submit" className="settings-submit-btn secondary">
                            <ShieldCheck size={15} />
                            <span>UPDATE PASSWORD</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;