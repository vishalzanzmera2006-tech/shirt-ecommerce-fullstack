import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "../../Redux/cartSlice";
import Login from "../../assets/Login-Signup Page/Login.jpg";
import "./AuthStyles.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="atelier-auth-page-wrapper">
            <div className="atelier-auth-container">
                {/* Visual Left Side */}
                <div className="atelier-auth-visual-side">
                    <img
                        src={Login}
                        alt="Tailoring Brand"
                        className="atelier-auth-bg-img"
                    />
                    <div className="atelier-auth-visual-overlay" />
                    <div className="atelier-auth-visual-content">
                        <span className="atelier-auth-tag">THE ATELIER GUILD</span>
                        <h2>Precision Tailoring, <em>Curated for You.</em></h2>
                        <p>Access your personalized size blueprint, bespoke shirt orders, and private collection preview access.</p>
                        <div className="atelier-auth-guarantee">
                            <ShieldCheck size={14} />
                            <span>Complimentary alterations on first tailored order.</span>
                        </div>
                    </div>
                </div>

                {/* Form Right Side */}
                <div className="atelier-auth-form-side">
                    <div className="atelier-auth-form-header">
                        <span className="atelier-auth-brand-kicker">CREST &amp; COLLAR</span>
                        <h1 className="atelier-auth-title">Welcome Back</h1>
                        <p className="atelier-auth-subtitle">Enter your details to access your account.</p>
                    </div>

                    <Formik
                        initialValues={{ email: "", password: "" }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.email) errors.email = "Email is required";
                            if (!values.password) errors.password = "Password is required";
                            return errors;
                        }}
                        onSubmit={async (values) => {
                            try {
                                const res = await axios.post("https://shirt-backend-33gt.onrender.com/user/login", values);

                                const token = res.data.token;
                                const user = res.data.user;

                                localStorage.setItem("token", token);
                                localStorage.setItem("user", JSON.stringify(user));

                                try {
                                    const cartRes = await axios.get("https://shirt-backend-33gt.onrender.com/cart", {
                                        headers: { token: token },
                                    });
                                    dispatch(setCart(cartRes.data.data || []));
                                } catch (cartErr) {
                                    console.error("Cart sync error on login:", cartErr);
                                }

                                window.dispatchEvent(new Event("userLogin"));
                                toast.success(`Welcome back, ${user?.fname || user?.name || "Patron"}`);

                                navigate("/");
                            } catch (error) {
                                console.error("Login Error:", error);
                                toast.error(
                                    error.response?.data?.message ||
                                    "Unable to sign in. Please verify your credentials."
                                );
                            }
                        }}
                    >
                        <Form className="atelier-auth-form-body">
                            <div className="atelier-input-group">
                                <label>EMAIL ADDRESS</label>
                                <div className="atelier-input-wrapper">
                                    <Mail size={16} className="atelier-input-icon" />
                                    <Field type="email" name="email" placeholder="youremail@gmail.com" />
                                </div>
                                <ErrorMessage name="email" component="span" className="atelier-error-msg" />
                            </div>

                            <div className="atelier-input-group">
                                <div className="atelier-label-row">
                                    <label>PASSWORD</label>
                                    <Link to="/forgot-password" className="atelier-forgot-link">Forgot?</Link>
                                </div>
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

                            <button type="submit" className="atelier-auth-submit-btn">
                                <span>SIGN IN</span>
                                <ArrowRight size={15} />
                            </button>
                        </Form>
                    </Formik>

                    <div className="atelier-auth-switch-link">
                        <span>Don't have an account? </span>
                        <Link to="/signup">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}