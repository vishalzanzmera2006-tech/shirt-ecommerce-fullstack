import React, { useEffect, useState } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";

import Navbar from "./Components/Navbarr/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./Components/Home/Home";
import BackToTop from "./Components/BackToTop/BackToTop";
import SearchModal from "./Components/Navbarr/SearchModal";
import LoginPage from "./Components/Profile/LoginPage";
import SignupPage from "./Components/Profile/SignupPage";
import Cart from "./Components/AddToCart/Cart";
import Wishlist from "./Components/Wishlist/Wishlist";
import QuickView from "./Components/QuickView/QuickView";
import ProductDetails from "./Components/ProductDetails";
import NewIn from "./Components/NewIn/NewIn";
import ProductFilterBar from "./Components/ProductFilterBar";
import Checkout from "./Components/CheckOut/Checkout";
import OrderSuccess from "./Components/CheckOut/OrderSuccess";
import MyOrders from "./Components/MyOrders/MyOrders";
import AccountSettings from "./Components/Profile/AccountSettings";
import SavedAddresses from "./Components/Profile/SavedAddresses";
import Journal from "./Components/Journal/Journal";
import AboutUs from "./Components/AboutUs/AboutUs";
import ShirtCategory from "./Components/Shirts/ShirtCategory";
import BestIn from "./Components/BestIn/BestIn";
import BrandAnimation from "./Components/BrandAnimation/BrandAnimation";
import Preloader from "./Components/Preloader/Preloader";
import FloatingActions from "./Components/WhatsApp/FloatingActions";
import SizeGuideModal from "./Components/SizeGuideModal";
import ShirtsCategory from "./Components/ShirtsCategory";
import ScrollToTop  from "./Components/ScrollToTop"

gsap.registerPlugin(ScrollToPlugin);

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);


  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/cart" ||
    location.pathname === "/wishlist" ||
    location.pathname === "/ordersuccess" ||
    location.pathname === "/checkout" ||
    location.pathname === "/myorder";

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 768;

    if (isTouchDevice) return;

    let scrollPos = window.scrollY;

    const handleWheel = (e) => {
      e.preventDefault();

      scrollPos += e.deltaY;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollPos = Math.max(0, Math.min(scrollPos, maxScroll));

      gsap.to(window, {
        scrollTo: { y: scrollPos, autoKill: false },
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);



  //Loading

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("cc_preloaded");
    if (hasLoaded) {
      setLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("cc_preloaded", "true");
    setLoading(false);
  };

  return (
    <>
      {/* <Toaster position="top-center" richColors style={{ padding: "20px" }} /> */}
      <Toaster
        richColors
        position="top-center"
        duration={3000}
        style={{
          fontFamily: "inherit",
          fontSize: "13px",
          letterSpacing: "0.4px"
        }}
      />

      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <BackToTop />
      <FloatingActions />
      <Navbar />
      <ScrollToTop/>

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* NewIn */}
        <Route path="newin" element={<NewIn />} />

        {/* BestIn */}
        <Route path="bestin" element={<BestIn />} />

        {/* Shirts */}
        <Route path="/shirts/:subType" element={<ShirtCategory />} />

        {/* About Us */}
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="about" element={<AboutUs />} />

        {/* Journal */}
        <Route path="journal" element={<Journal />} />


        {/* Redux */}
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="quickview" element={<QuickView />} />

        {/* Login & Sign-up */}
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* ProductPage */}
        <Route path="productdetails" element={<ProductDetails />} />

        {/* Search */}
        <Route path="searchbar" element={<SearchModal />} />

        {/* Filter */}
        <Route path="productfilterbar" element={<ProductFilterBar />} />

        {/* CheckOut */}
        <Route path="checkout" element={<Checkout />} />
        <Route path="ordersuccess" element={<OrderSuccess />} />

        {/* My-Order & Account */}
        <Route path="myorder" element={<MyOrders />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="account/addresses" element={<SavedAddresses />} />

        {/* Brand Animation */}
        <Route path="logoanimation" element={<BrandAnimation />} />

        {/* SizeGuideModal */}
        <Route path="sizeguidemodal" element={<SizeGuideModal />} />

        <Route path="/shirts/:category" element={<ShirtsCategory/>} />
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;