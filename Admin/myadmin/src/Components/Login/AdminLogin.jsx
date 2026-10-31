import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import "./AdminLogin.css";

export default function AdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="simple-admin-wrapper">
            <div className="simple-admin-card">
                {/* Brand Header */}
                <div className="simple-admin-header">
                    <div className="simple-brand-icon">C&amp;C</div>
                    <h2>Admin Sign in</h2>
                    <p>Please enter your administrative credentials</p>
                </div>

                {/* Global Error Banner */}
                {errorMsg && <div className="simple-error-banner">{errorMsg}</div>}

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = "Email is required";
                        }
                        if (!values.password) {
                            errors.password = "Password is required";
                        }
                        return errors;
                    }}
                    onSubmit={async (values) => {
                        setErrorMsg("");
                        setLoading(true);
                        try {
                            const res = await axios.post("http://localhost:3000/admin/login", values);

                            // Save Tokens
                            localStorage.setItem("adminToken", res.data.token);
                            localStorage.setItem("adminUser", JSON.stringify(res.data.user || res.data.data));

                            toast.success("Welcome back, Administrator");
                            navigate("/admin/dashboard");
                        } catch (err) {
                            const message =
                                err.response?.data?.message ||
                                "Authentication failed. Invalid admin credentials.";
                            setErrorMsg(message);
                            toast.error(message);
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="simple-form">
                            {/* Email */}
                            <div className="simple-input-group">
                                <label>Email Address</label>
                                <div className="simple-field-wrapper">
                                    <Mail size={16} className="simple-icon" />
                                    <Field
                                        type="email"
                                        name="email"
                                        placeholder="admin@crestandcollar.com"
                                    />
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="span"
                                    className="simple-field-error"
                                />
                            </div>

                            {/* Password */}
                            <div className="simple-input-group">
                                <label>Password</label>
                                <div className="simple-field-wrapper">
                                    <Lock size={16} className="simple-icon" />
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="simple-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="span"
                                    className="simple-field-error"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="simple-submit-btn"
                                disabled={loading || isSubmitting}
                            >
                                <span>{loading ? "Signing in..." : "Sign in to Dashboard"}</span>
                                <ArrowRight size={15} />
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="simple-footer">
                    <span>&copy; Crest &amp; Collar Atelier &bull; Internal Console</span>
                </div>
            </div>
        </div>
    );
}