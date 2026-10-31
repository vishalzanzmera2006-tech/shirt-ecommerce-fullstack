import React, { useEffect } from "react";
import { X, Ruler } from "lucide-react";
import "./SizeGuideModal.css";

const SizeGuideModal = ({ isOpen, onClose }) => {
    // ESC key close listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="sg-backdrop" onClick={onClose}>
            <div className="sg-drawer" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sg-header">
                    <div className="sg-title-wrap">
                        <Ruler size={18} />
                        <h3>Bespoke Size Guide</h3>
                    </div>
                    <button
                        type="button"
                        className="sg-close-btn"
                        onClick={onClose}
                        aria-label="Close size guide"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="sg-body">
                    <p className="sg-subtitle">
                        All Crest & Collar garments are tailored with a refined contemporary fit. Measurements are in inches.
                    </p>

                    {/* Measurement Table */}
                    <div className="sg-table-wrapper">
                        <table className="sg-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    <th>Chest</th>
                                    <th>Shoulder</th>
                                    <th>Length</th>
                                    <th>Sleeve</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>S</strong></td>
                                    <td>38"</td>
                                    <td>17.5"</td>
                                    <td>29"</td>
                                    <td>24.5"</td>
                                </tr>
                                <tr>
                                    <td><strong>M</strong></td>
                                    <td>40"</td>
                                    <td>18.2"</td>
                                    <td>29.5"</td>
                                    <td>25"</td>
                                </tr>
                                <tr>
                                    <td><strong>L</strong></td>
                                    <td>42"</td>
                                    <td>19.0"</td>
                                    <td>30"</td>
                                    <td>25.5"</td>
                                </tr>
                                <tr>
                                    <td><strong>XL</strong></td>
                                    <td>44"</td>
                                    <td>19.8"</td>
                                    <td>30.5"</td>
                                    <td>26"</td>
                                </tr>
                                <tr>
                                    <td><strong>XXL</strong></td>
                                    <td>46"</td>
                                    <td>20.6"</td>
                                    <td>31"</td>
                                    <td>26.5"</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Fitting Advice */}
                    <div className="sg-advice-box">
                        <h4>Fit Architect’s Note</h4>
                        <p>
                            If you prefer a relaxed silhouette or intend to layer over knitwear, we recommend selecting one size above your standard measurement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuideModal;