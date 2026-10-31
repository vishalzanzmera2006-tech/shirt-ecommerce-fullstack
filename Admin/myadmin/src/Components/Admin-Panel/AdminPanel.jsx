import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Plus,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { toast } from "sonner";
import "./AdminPanel.css";

const AdminPanel = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [adminName, setAdminName] = useState("");

    const go = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        toast.success("Admin session terminated securely");
        navigate("/admin/login");
    };

    useEffect(() => {
        const adminUser = localStorage.getItem("adminUser");

        if (adminUser) {
            try {
                const user = JSON.parse(adminUser);
                setAdminName(
                    user.name ||
                    user.username ||
                    user.email ||
                    "Admin"
                );
            } catch {
                setAdminName("Admin");
            }
        }
    }, []);

    return (
        <div className="admin-layout">
            {/* ================= MOBILE HEADER ================= */}
            <div className="mobile-header">
                <div className="mobile-logo">
                    <div className="mobile-logo-box">A</div>
                    <div>
                        <h3>ADMIN</h3>
                        <span>LOGIN PANEL</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="mobile-menu"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle navigation"
                >
                    {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* ================= OVERLAY ================= */}
            {sidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ================= SIDEBAR (LEFT) ================= */}
            <aside
                className={
                    sidebarOpen
                        ? "admin-sidebar open"
                        : "admin-sidebar"
                }
            >
                {/* Logo */}
                <div className="admin-logo">
                    <div><h2 style={{ padding: "10px" }}>ADMIN</h2></div>
                    <div>
                        <h6 style={{ padding: "10px" }}>{adminName || "ADMIN"}</h6>
                        <span style={{ padding: "10px" }}>LOGIN PANEL</span>
                    </div>
                </div>

                {/* Menu Title */}
                <div className="menu-title">MAIN MENU</div>

                {/* Menu */}
                <div className="admin-menu">
                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/dashboard"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/dashboard")}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/allproducts"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/allproducts")}
                    >
                        <Package size={18} />
                        <span>All Products</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/addproduct"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/addproduct")}
                    >
                        <Plus size={18} />
                        <span>Add Product</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/orders"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/orders")}
                    >
                        <ShoppingBag size={18} />
                        <span>Orders</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/customers"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/customers")}
                    >
                        <Users size={18} />
                        <span>Customers</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/accessrequest")}
                    >
                        <Users size={18} />
                        <span>AccessRequest</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname.toLowerCase() === "/admin/analytics"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/analytics")}
                    >
                        <BarChart3 size={18} />
                        <span>Analytics</span>
                    </button>

                    <button
                        type="button"
                        className={
                            location.pathname === "/admin/settings"
                                ? "menu-item active"
                                : "menu-item"
                        }
                        onClick={() => go("/admin/settings")}
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                </div>

                {/* Bottom */}
                <div className="admin-bottom">
                    <button type="button" className="logout-button" onClick={logout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                    <small>ADMIN PANEL • 2026</small>
                </div>
            </aside>

            {/* ================= RIGHT SIDE CONTENT ================= */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;