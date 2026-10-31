import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { toast } from "sonner"; // 👈 Added Sonner Toast
import "./AddProduct.css";

const AddProduct = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    const handleRemoveImage = (indexToRemove, setFieldValue) => {
        const updatedImages = images.filter((_, index) => index !== indexToRemove);
        setImages(updatedImages);
        setFieldValue("mainimage", updatedImages[0] || null);
        setFieldValue("previewimages", updatedImages.slice(1));
        toast.success("Image removed from selection");
    };

    return (
        <div className="add-product">
            <div className="add-header">
                <div>
                    <span>PRODUCT MANAGEMENT</span>
                    <h1>Add Product</h1>
                </div>
                <p>Create a new bespoke shirt for Crest &amp; Collar</p>
            </div>

            <Formik
                initialValues={{
                    name: "",
                    category: "",
                    salePrice: "",
                    originalPrice: "",
                    discount: "",
                    badge: "",
                    mainimage: null,
                    previewimages: [],
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    description: "",
                    isBestSeller: false,
                    isNewArrival: false,
                }}
                onSubmit={async (values, { resetForm }) => {
                    if (!values.mainimage && images.length === 0) {
                        toast.error("Please upload at least one cover image for the garment");
                        return;
                    }

                    if (values.sizes.length === 0) {
                        toast.error("Please select at least one available size");
                        return;
                    }

                    try {
                        const formData = new FormData();

                        formData.append("name", values.name);
                        formData.append("category", values.category);
                        formData.append("fabric", values.category);

                        let originalPrice = Number(values.originalPrice) || 0;
                        let discount = Number(values.discount) || 0;
                        let salePrice = originalPrice;

                        if (originalPrice > 0 && discount > 0) {
                            salePrice = originalPrice - (originalPrice * discount) / 100;
                        }
                        salePrice = Number(salePrice.toFixed(2));

                        if (originalPrice > 0) {
                            formData.append("originalPrice", originalPrice);
                        }

                        if (originalPrice > 0 && discount > 0) {
                            formData.append("salePrice", salePrice);
                            formData.append("discount", `${discount}% OFF`);
                        }

                        formData.append("badge", values.badge || "");

                        const sizeOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
                        const cleanSortedSizes = [...values.sizes].sort(
                            (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
                        );
                        formData.append("sizes", JSON.stringify(cleanSortedSizes));

                        formData.append("description", values.description || "");
                        formData.append("isBestSeller", values.isBestSeller);
                        formData.append("isNewArrival", values.isNewArrival);

                        if (values.mainimage) {
                            formData.append("mainimage", values.mainimage);
                        }

                        values.previewimages.forEach((img) => {
                            formData.append("previewimages", img);
                        });

                        const token = localStorage.getItem("adminToken");

                        await axios.post(
                            "http://localhost:3000/shirt/create",
                            formData,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    token: token,
                                },
                            }
                        );

                        toast.success("Product has been added successfully!");
                        resetForm();
                        setImages([]);
                        navigate("/admin/allproducts");
                    } catch (error) {
                        console.error("Add Product Error:", error);
                        toast.error(
                            error.response?.data?.message ||
                            "Failed to commission product. Please verify fields and try again."
                        );
                    }
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form className="product-form">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h2>Basic Information</h2>
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Product Name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Pure White Royal Oxford Shirt"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category</label>
                                    <Field as="select" name="category" required>
                                        <option value="">Select Category</option>
                                        <option value="Casual">Casual Shirts</option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Egyptian Giza">Egyptian Giza</option>
                                        <option value="Formal">Formal</option>
                                        <option value="Linen">Linen</option>
                                        <option value="Oxford">Oxford</option>
                                        <option value="Slim Fit">Slim Fit</option>
                                    </Field>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Discount <span className="optional-tag">(Optional)</span>
                                    </label>
                                    <Field
                                        type="number"
                                        name="discount"
                                        placeholder="e.g. 20"
                                        min="0"
                                        max="100"
                                    />
                                    <small>Enter discount percentage only</small>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="form-section">
                            <h2>Pricing</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Original Price / MRP</label>
                                    <Field
                                        type="number"
                                        name="originalPrice"
                                        placeholder="1999"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product Images */}
                        <div className="form-section">
                            <h2>Product Images (Slider / Scroll Images)</h2>
                            <div className="image-upload">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(event) => {
                                        const newFiles = Array.from(event.target.files);
                                        if (newFiles.length === 0) return;
                                        const combinedList = [...images, ...newFiles];
                                        setImages(combinedList);
                                        setFieldValue("mainimage", combinedList[0]);
                                        setFieldValue("previewimages", combinedList.slice(1));
                                        toast.success(`${newFiles.length} image(s) staged`);
                                    }}
                                />
                                <strong>Choose Product Images (Select multiple)</strong>
                                <span>
                                    Image 1 = Card Cover | Other Images = Card Slider/Scroll
                                </span>
                            </div>

                            {images.length > 0 && (
                                <div className="image-preview">
                                    {images.map((image, index) => (
                                        <div className="preview-box" key={index}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                            />
                                            <span className="badge-tag">
                                                {index === 0 ? "Cover (Card)" : `Slide ${index + 1}`}
                                            </span>
                                            <button
                                                type="button"
                                                className="remove-img-btn"
                                                onClick={() => handleRemoveImage(index, setFieldValue)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-group full">
                            <label>Description</label>
                            <Field
                                as="textarea"
                                name="description"
                                placeholder="Enter product description"
                                rows="5"
                            />
                        </div>

                        {/* Available Sizes */}
                        <div className="form-section">
                            <h2>Available Sizes</h2>
                            <div className="size-box">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <label key={size}>
                                        <input
                                            type="checkbox"
                                            checked={values.sizes.includes(size)}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setFieldValue("sizes", Array.from(new Set([...values.sizes, size])));
                                                } else {
                                                    setFieldValue("sizes", values.sizes.filter((item) => item !== size));
                                                }
                                            }}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Product Badge */}
                        <div className="form-section">
                            <h2>Product Badge</h2>
                            <div className="badge-options">
                                <label>
                                    <Field type="radio" name="badge" value="" /> None
                                </label>
                                <label>
                                    <Field type="radio" name="badge" value="BEST SELLER" /> Best Seller
                                </label>
                                <label>
                                    <Field type="radio" name="badge" value="TRENDING" /> Trending
                                </label>
                                <label>
                                    <Field type="radio" name="badge" value="NEW ARRIVAL" /> New Arrival
                                </label>
                            </div>
                        </div>

                        {/* Product Sections */}
                        <div className="form-section">
                            <h2>Product Sections</h2>
                            <div className="section-options">
                                <h5>[By Default False...]</h5>
                                <label>
                                    <Field type="checkbox" name="isBestSeller" />
                                    <div>
                                        <strong>Best Seller</strong>
                                        <small>Show in Best Sellers Section</small>
                                    </div>
                                </label>
                                <label>
                                    <Field type="checkbox" name="isNewArrival" />
                                    <div>
                                        <strong>New Arrival</strong>
                                        <small>Show in New Arrivals Section</small>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => {
                                    setImages([]);
                                    navigate("/admin/allproducts");
                                }}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="add-product-btn">
                                Add Product
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProduct;