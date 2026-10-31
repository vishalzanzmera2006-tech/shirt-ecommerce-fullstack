import React, { useState } from "react";
import { MapPin, Plus, Trash2, CheckCircle2, Building, Home } from "lucide-react";
import { toast } from "sonner";
import "./SavedAddresses.css";

const SavedAddresses = () => {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            tag: "Home",
            fullName: "Client Primary",
            phone: "9876543210",
            street: "702, Heritage Residency, City Light",
            city: "Surat",
            state: "Gujarat",
            pincode: "395007",
            isDefault: true,
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        tag: "Home",
        fullName: "",
        phone: "",
        street: "",
        city: "Surat",
        state: "Gujarat",
        pincode: "",
    });

    const handleAddAddress = (e) => {
        e.preventDefault();

        // Field Validations
        if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.pincode.trim()) {
            toast.error("Please complete all required dispatch fields");
            return;
        }

        if (formData.phone.trim().length < 10) {
            toast.error("Please provide a valid 10-digit contact number");
            return;
        }

        if (formData.pincode.trim().length !== 6) {
            toast.error("Please provide a valid 6-digit postal PIN code");
            return;
        }

        const newAddr = {
            id: Date.now(),
            ...formData,
            isDefault: addresses.length === 0,
        };

        setAddresses([...addresses, newAddr]);
        setShowForm(false);
        setFormData({
            tag: "Home",
            fullName: "",
            phone: "",
            street: "",
            city: "Surat",
            state: "Gujarat",
            pincode: "",
        });
        toast.success("Bespoke dispatch location added successfully");
    };

    const handleDelete = (id) => {
        const target = addresses.find((a) => a.id === id);

        // Safeguard default address deletion if multiple exist
        if (target?.isDefault && addresses.length > 1) {
            toast.error("Please designate another primary address before removing this one");
            return;
        }

        setAddresses(addresses.filter((a) => a.id !== id));
        toast.success("Delivery address removed from registry");
    };

    const handleSetDefault = (id) => {
        setAddresses(
            addresses.map((a) => ({
                ...a,
                isDefault: a.id === id,
            }))
        );
        toast.success("Primary dispatch destination updated");
    };

    return (
        <div className="saved-addr-container">
            <div className="saved-addr-header">
                <div>
                    <h1>Saved Addresses</h1>
                    <p>Manage your verified delivery locations for bespoke garment dispatches.</p>
                </div>
                {!showForm && (
                    <button
                        type="button"
                        className="add-address-trigger-btn"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={15} />
                        <span>ADD NEW ADDRESS</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="address-form-modal">
                    <div className="address-form-box">
                        <h3>Add Dispatch Address</h3>
                        <form onSubmit={handleAddAddress}>
                            <div className="addr-grid-inputs">
                                <div className="addr-group">
                                    <label>Address Tag</label>
                                    <select
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Office / Atelier">Office / Atelier</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="addr-group">
                                    <label>Recipient Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Aarav Mehta"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>

                                <div className="addr-group">
                                    <label>Contact Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="10-digit mobile"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="addr-group full">
                                    <label>Street Address &amp; Premise *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="House/Apartment no, building, street"
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    />
                                </div>

                                <div className="addr-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>

                                <div className="addr-group">
                                    <label>PIN Code *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="395007"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="addr-btn secondary"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="addr-btn primary">
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="addresses-list-grid">
                {addresses.map((addr) => (
                    <div
                        className={`address-card ${addr.isDefault ? "default-border" : ""}`}
                        key={addr.id}
                    >
                        <div className="addr-card-top">
                            <div className="addr-tag-pill">
                                {addr.tag === "Home" ? <Home size={12} /> : <Building size={12} />}
                                <span>{addr.tag}</span>
                            </div>
                            {addr.isDefault && (
                                <span className="default-pill">
                                    <CheckCircle2 size={11} />
                                    DEFAULT
                                </span>
                            )}
                        </div>

                        <h4 className="addr-name">{addr.fullName}</h4>
                        <p className="addr-text">{addr.street}</p>
                        <p className="addr-text">
                            {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="addr-phone">Phone: {addr.phone}</p>

                        <div className="addr-card-footer">
                            {!addr.isDefault && (
                                <button
                                    type="button"
                                    className="set-default-btn"
                                    onClick={() => handleSetDefault(addr.id)}
                                >
                                    Set as Default
                                </button>
                            )}
                            <button
                                type="button"
                                className="addr-delete-btn"
                                onClick={() => handleDelete(addr.id)}
                                title="Remove location"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedAddresses;