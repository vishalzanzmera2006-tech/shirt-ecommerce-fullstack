import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "sonner";

import AdminLogin from "./Components/Login/AdminLogin";
import AdminPanel from "./Components/Admin-Panel/AdminPanel";

import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import AddProduct from "./Components/Pages/AddProduct/AddProduct";
import AllProducts from "./Components/Pages/AllProducts/AllProducts";
import Analytics from "./Components/Pages/Analytics/Analytics";
import Settings from "./Components/Pages/Settings/Settings";
import Customers from "./Components/Pages/Customers/Customers";
import Orders from "./Components/Pages/Orders/Orders";
import AccessRequests from "./Components/Pages/AccessRequests/AccessRequests";

export default function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            fontSize: "14px",
            letterSpacing: "0.3px",
            zIndex: 9999999
          }
        }}
      />

      <Routes>
        {/*Login */}
        <Route
          path="/"
          element={<AdminLogin />}
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={<AdminPanel />}
        >
          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* Add Product */}
          <Route
            path="addproduct"
            element={<AddProduct />}
          />

          {/* Orders */}
          <Route
            path="orders"
            element={<Orders />}
          />

          {/* Customers */}
          <Route
            path="customers"
            element={<Customers />}
          />

          {/* Customers Access Request */}
          <Route
            path="accessrequest"
            element={<AccessRequests/>}
          />

          {/* All Products */}
          <Route
            path="allproducts"
            element={<AllProducts />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<Analytics />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>

        {/* Admin Login Direct URL */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>

    </BrowserRouter>
  );
}