import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import SignUp from "../../assets/Login-Signup Page/SignUp.jpg";
import "./AuthStyles.css";

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="atelier-auth-page-wrapper">
            <div className="atelier-auth-container">
                {/* Left Side Visual */}
                <div className="atelier-auth-visual-side">
                    <img
                        src={SignUp}
                        alt="Bespoke Fabric"
                        className="atelier-auth-bg-img"
                    />
                    <div className="atelier-auth-visual-overlay" />
                    <div className="atelier-auth-visual-content">
                        <span className="atelier-auth-tag">ATELIER PATRONAGE</span>
                        <h2>
                            Handcrafted Luxury, <em>Made to Order.</em>
                        </h2>
                        <p>
                            Create your account to unlock private access to seasonal collections and bespoke tailoring.
                        </p>
                        <div className="atelier-auth-guarantee">
                            <Sparkles size={14} />
                            <span>Complimentary alterations on your first order.</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="atelier-auth-form-side">
                    <div className="atelier-auth-form-header">
                        <span className="atelier-auth-brand-kicker">CREST &amp; COLLAR</span>
                        <h1 className="atelier-auth-title">Create Account</h1>
                        <p className="atelier-auth-subtitle">Join our patronage to access your private account.</p>
                    </div>

                    <Formik
                        initialValues={{
                            fname: "",
                            phone: "",
                            email: "",
                            password: "",
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.fname) errors.fname = "Full name is required";
                            if (!values.phone) errors.phone = "Phone number is required";
                            if (!values.email) errors.email = "Email address is required";
                            if (!values.password) errors.password = "Password is required";
                            else if (values.password.length < 6) errors.password = "Password must be at least 6 characters";
                            return errors;
                        }}
                        onSubmit={async (values) => {
                            try {
                                const res = await axios.post(
                                    "http://localhost:3000/user/signup",
                                    values
                                );
                                localStorage.setItem("token", res.data.token);
                                localStorage.setItem(
                                    "user",
                                    JSON.stringify(res.data.data)
                                );
                                window.dispatchEvent(new Event("userLogin"));
                                toast.success("Welcome to Crest & Collar Website. Account Created Successfully.");
                                navigate("/");
                            } catch (error) {
                                console.error("Signup Error:", error);
                                toast.error(
                                    error.response?.data?.message ||
                                    "Unable to complete registration. Please verify your details."
                                );
                            }
                        }}
                    >
                        <Form className="atelier-auth-form-body">
                            {/* Full Name */}
                            <div className="atelier-input-group">
                                <label>FULL NAME</label>
                                <div className="atelier-input-wrapper">
                                    <User size={16} className="atelier-input-icon" />
                                    <Field type="text" name="fname" placeholder="Aarav Mehta" />
                                </div>
                                <ErrorMessage name="fname" component="span" className="atelier-error-msg" />
                            </div>

                            {/* Phone */}
                            <div className="atelier-input-group">
                                <label>PHONE NUMBER</label>
                                <div className="atelier-input-wrapper">
                                    <Phone size={16} className="atelier-input-icon" />
                                    <Field type="tel" name="phone" placeholder="9876543210" />
                                </div>
                                <ErrorMessage name="phone" component="span" className="atelier-error-msg" />
                            </div>

                            {/* Email */}
                            <div className="atelier-input-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="atelier-input-wrapper">
                                    <Mail size={16} className="atelier-input-icon" />
                                    <Field type="email" name="email" placeholder="youremail@domain.com" />
                                </div>
                                <ErrorMessage name="email" component="span" className="atelier-error-msg" />
                            </div>

                            {/* Password */}
                            <div className="atelier-input-group">
                                <label>PASSWORD</label>
                                <div className="atelier-input-wrapper">
                                    <Lock size={16} className="atelier-input-icon" />
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="atelier-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <ErrorMessage name="password" component="span" className="atelier-error-msg" />
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="atelier-auth-submit-btn">
                                <span>CREATE ACCOUNT</span>
                                <ArrowRight size={15} />
                            </button>
                        </Form>
                    </Formik>

                    <div className="atelier-auth-switch-link">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}