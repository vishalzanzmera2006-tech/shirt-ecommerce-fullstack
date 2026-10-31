import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Package,
  SlidersHorizontal,
  MapPin,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchModal from "./SearchModal";
import BrandAnimation from "../BrandAnimation/BrandAnimation";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCart } from "../../Redux/cartSlice";
import { setWishlist } from "../../Redux/wishlistSlice";
import axios from "axios";

import "./Navbar.css";

const navItems = [
  {
    name: "New In",
    path: "/newin",
    highlight: true,
  },
  {
    name: "Best In",
    path: "/bestin",
    highlight: true,
  },
  {
    name: "Shirts",
    mega: true,
    banner: {
      title: "Oxford Edit",
      tag: "Signature '26",
      image:
        "https://png.pngtree.com/png-clipart/20240713/original/pngtree-stack-of-shirts-isolated-png-image_15546987.png",
      link: "/shirts/oxford",
    },
    categories: [
      {
        title: "By Occasion",
        links: [
          { name: "Formal Shirts", slug: "formal" },
          { name: "Casual Shirts", slug: "casual" },
        ],
      },
      {
        title: "By Fabric",
        links: [
          { name: "Egyptian Giza", slug: "egyptian-giza" },
          { name: "Pure Linen", slug: "linen" },
          { name: "Classic Cotton", slug: "cotton" },
          { name: "Royal Oxford", slug: "oxford" },
        ],
      },
      {
        title: "By Fit",
        links: [
          { name: "Tailored Slim Fit", slug: "slim-fit" },
          { name: "All Shirts", slug: "all" },
        ],
      },
    ],
  },
  {
    name: "About Us",
    path: "/aboutus",
  },
  {
    name: "Journal",
    path: "/journal",
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux: Cart & Wishlist counts
  const cartItems = useSelector((state) => state.cart?.items) || [];
  const wishlistItems = useSelector((state) => state.wishlist?.items) || [];

  const cartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + Number(item?.quantity || 1), 0)
    : 0;
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  // Local UI States
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountHover, setAccountHover] = useState(false);

  // User Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Sync Wishlist
  const getWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setWishlist([]));
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/wishlist", {
        headers: { token },
      });
      dispatch(setWishlist(res.data?.data || []));
    } catch (error) {
      console.error("Wishlist Fetch Error:", error);
      toast.error("Unable to sync wishlist");
      dispatch(setWishlist([]));
    }
  };

  // Sync Cart
  const getCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(setCart([]));
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/cart", {
        headers: { token },
      });
      dispatch(setCart(res.data?.data || []));
    } catch (error) {
      console.error("Cart fetch error:", error);
      toast.error("Unable to sync shopping bag");
      dispatch(setCart([]));
    }
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auth sync
  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUsername(
            userData.fname ||
            userData.name ||
            userData.username ||
            userData.email?.split("@")[0] ||
            "Client"
          );
          setUserEmail(userData.email || "");
          getCart();
          getWishlist();
        } catch {
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setUserEmail("");
        dispatch(clearCart());
        dispatch(setWishlist([]));
      }
    };

    checkUser();
    window.addEventListener("userLogin", checkUser);
    window.addEventListener("userLogout", checkUser);

    return () => {
      window.removeEventListener("userLogin", checkUser);
      window.removeEventListener("userLogout", checkUser);
    };
  }, [dispatch]);

  // Lock mobile body scroll
  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenu]);

  // Navigation router
  const go = (path) => {
    if (path) navigate(path);
    setActiveMenu(null);
    setMobileMenu(false);
    setAccountHover(false);
  };

  // Logout handler

  const handleLogout = () => {
    toast.success("Successfully logged out. Until next time.");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    setUserEmail("");
    setAccountHover(false);
    setMobileMenu(false);
    dispatch(clearCart());
    dispatch(setWishlist([]));
    window.dispatchEvent(new Event("userLogout"));
    if (window.location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <>
      <header
        className={`navbar-header ${scrolled ? "scrolled" : ""}`}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Top Announcement Bar */}
        <div className="announcement-bar">
          <Sparkles size={11} className="announcement-icon" />
          <span>Complimentary Express Logistics on Orders Over ₹5,000</span>
        </div>

        {/* Main Navbar */}
        <div className="navbar-container">
          {/* Mobile Hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Navigation"
          >
            {mobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Brand Logo */}
          <motion.div
            className="brand-logo"
            onClick={() => go("/")}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* 1. Large screen / Desktop: Show BrandAnimation */}
            <div className="brand-desktop-animation">
              <BrandAnimation />
            </div>

            {/* 2. Small screen / Mobile: Show Clean Minimal Static Logo */}
            <div className="brand-mobile-static">
              <span className="mobile-brand-title">CREST &amp; COLLAR</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <div
                className={`nav-item ${activeMenu === item.name ? "is-active" : ""}`}
                key={item.name}
                onMouseEnter={() => setActiveMenu(item.mega ? item.name : null)}
              >
                <button
                  type="button"
                  className={`nav-link-btn ${item.highlight ? "highlight-pill" : ""}`}
                  onClick={() => {
                    if (item.mega) {
                      setActiveMenu(activeMenu === item.name ? null : item.name);
                    } else {
                      go(item.path);
                    }
                  }}
                >
                  <span>{item.name}</span>
                  {item.mega && (
                    <ChevronDown
                      size={13}
                      className={`chevron-icon ${activeMenu === item.name ? "rotate" : ""}`}
                    />
                  )}
                </button>
              </div>
            ))}
          </nav>

          {/* Action Bar */}
          <div className="nav-actions">
            {/* Search */}
            <button
              type="button"
              className="action-btn"
              aria-label="Search Garments"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} strokeWidth={1.4} />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              className="action-btn badge-btn"
              aria-label="Saved Wishlist"
              onClick={() => go("/wishlist")}
            >
              <Heart size={19} strokeWidth={1.4} />
              {wishlistCount > 0 && (
                <span className="action-counter">{wishlistCount}</span>
              )}
            </button>

            {/* Account Profile Trigger */}
            <div
              className="account-menu-wrapper"
              onMouseEnter={() => setAccountHover(true)}
              onMouseLeave={() => setAccountHover(false)}
            >
              <button
                type="button"
                className={`action-btn account-trigger-btn ${accountHover ? "active" : ""
                  } ${isLoggedIn ? "logged-in-pill" : ""}`}
                onClick={() => go(isLoggedIn ? "/account" : "/login")}
                aria-label="Account Profile"
              >
                <User size={19} strokeWidth={1.4} />
              </button>

              {/* Account Dropdown Menu */}
              {accountHover && (
                <div className="account-dropdown-menu">
                  {isLoggedIn ? (
                    <>
                      <div className="google-profile-header">
                        <div className="google-avatar-wrapper">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=0f172a&textColor=ffffff`}
                            alt={username}
                            className="google-avatar-img"
                          />
                        </div>
                        <div className="google-info-col">
                          <span className="google-user-name">{username}</span>
                          {userEmail && (
                            <span className="google-user-sub">{userEmail}</span>
                          )}
                        </div>
                      </div>

                      <div className="dropdown-links-list">
                        <button
                          type="button"
                          className="dropdown-link-item"
                          onClick={() => go("/myorder")}
                        >
                          <Package size={15} />
                          <span>My Orders &amp; Tracking</span>
                        </button>
                        <button
                          type="button"
                          className="dropdown-link-item"
                          onClick={() => go("/account")}
                        >
                          <SlidersHorizontal size={15} />
                          <span>Account Settings</span>
                        </button>
                        <button
                          type="button"
                          className="dropdown-link-item"
                          onClick={() => go("/account/addresses")}
                        >
                          <MapPin size={15} />
                          <span>Saved Addresses</span>
                        </button>
                      </div>

                      <div className="dropdown-logout-bar">
                        <button
                          type="button"
                          className="dropdown-logout-btn"
                          onClick={handleLogout}
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="dropdown-auth-header">
                      <span className="dropdown-welcome">
                        Welcome to Crest &amp; Collar
                      </span>
                      <p className="dropdown-subtext">
                        Log in to access your bespoke orders, track deliveries, and view your saved articles.
                      </p>
                      <button
                        type="button"
                        className="dropdown-login-btn"
                        onClick={() => go("/login")}
                      >
                        <span>Login / Sign In</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag */}
            <button
              type="button"
              className="action-btn badge-btn"
              aria-label="Shopping Bag"
              onClick={() => go("/cart")}
            >
              <ShoppingBag size={19} strokeWidth={1.4} />
              {cartCount > 0 && (
                <span className="action-counter">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              className="mega-menu-wrapper"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {navItems
                .filter((item) => item.name === activeMenu && item.mega)
                .map((menu) => (
                  <div className="mega-menu-content" key={menu.name}>
                    <div className="mega-columns-grid">
                      {menu.categories.map((cat) => (
                        <div className="mega-col" key={cat.title}>
                          <h4 className="mega-col-title">{cat.title}</h4>
                          <ul className="mega-links-list">
                            {cat.links.map((linkItem) => {
                              const label =
                                typeof linkItem === "string"
                                  ? linkItem
                                  : linkItem.name;
                              const slug =
                                typeof linkItem === "string"
                                  ? linkItem
                                    .toLowerCase()
                                    .replace(/100%|\//g, "")
                                    .trim()
                                    .replace(/[\s&]+/g, "-")
                                  : linkItem.slug;

                              const targetPath = `/shirts/${slug}`;

                              return (
                                <li key={label}>
                                  <a
                                    href={targetPath}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      go(targetPath);
                                    }}
                                  >
                                    {label}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Editorial Banner Card */}
                    {menu.banner && (
                      <div
                        className="mega-banner-card"
                        onClick={() => go(menu.banner.link)}
                      >
                        <div className="mega-banner-image-wrapper">
                          <img
                            src={menu.banner.image}
                            alt={menu.banner.title}
                          />
                        </div>
                        <div className="mega-banner-meta">
                          <span className="banner-tag">{menu.banner.tag}</span>
                          <h3>{menu.banner.title}</h3>
                          <span className="banner-link-action">
                            Discover Capsule
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenu && (
            <>
              <motion.div
                className="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenu(false)}
              />

              <motion.div
                className="mobile-drawer"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mobile-drawer-header">
                  <span className="drawer-title">CREST &amp; COLLAR</span>
                  <button
                    type="button"
                    onClick={() => setMobileMenu(false)}
                    className="drawer-close-btn"
                    aria-label="Close menu"
                  >
                    <X size={19} />
                  </button>
                </div>

                <div className="mobile-drawer-body">
                  {navItems.map((item) => (
                    <div className="mobile-nav-block" key={item.name}>
                      <button
                        type="button"
                        className="mobile-nav-heading-btn"
                        onClick={() => {
                          if (item.mega) {
                            setActiveMenu(
                              activeMenu === item.name ? null : item.name
                            );
                          } else {
                            go(item.path);
                          }
                        }}
                      >
                        <span>{item.name}</span>
                        {item.mega && (
                          <ChevronDown
                            size={15}
                            className={`chevron ${activeMenu === item.name ? "rotate" : ""
                              }`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {item.mega && activeMenu === item.name && (
                          <motion.div
                            className="mobile-accordion-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.categories.map((cat) => (
                              <div
                                className="mobile-category-block"
                                key={cat.title}
                              >
                                <h5>{cat.title}</h5>
                                <ul>
                                  {cat.links.map((linkItem) => {
                                    const label =
                                      typeof linkItem === "string"
                                        ? linkItem
                                        : linkItem.name;
                                    const slug =
                                      typeof linkItem === "string"
                                        ? linkItem
                                          .toLowerCase()
                                          .replace(/100%|\//g, "")
                                          .trim()
                                          .replace(/[\s&]+/g, "-")
                                        : linkItem.slug;

                                    const targetPath = `/shirts/${slug}`;

                                    return (
                                      <li key={label}>
                                        <button
                                          type="button"
                                          className="mobile-category-link"
                                          onClick={() => go(targetPath)}
                                        >
                                          {label}
                                        </button>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mobile-drawer-footer">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      className="footer-quick-link danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="footer-quick-link"
                      onClick={() => go("/login")}
                    >
                      <User size={14} />
                      <span>Sign In</span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="footer-quick-link"
                    onClick={() => go("/wishlist")}
                  >
                    <Heart size={14} />
                    <span>Saved ({wishlistCount})</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Interactive Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;