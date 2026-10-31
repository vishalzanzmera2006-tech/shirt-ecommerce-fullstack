import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    Image as ImageIcon,
    RotateCcw,
    X,
    UploadCloud,
    Filter,
} from "lucide-react";
import "./AllProducts.css";

const AllProducts = () => {
    const navigate = useNavigate();

    const [data, setdata] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newImages, setNewImages] = useState([]);

    const getCleanSizes = (rawSizes) => {
        if (!rawSizes) return [];
        let result = rawSizes;
        if (typeof result === "string") {
            try {
                result = JSON.parse(result);
            } catch {
                result = [result];
            }
        }
        if (Array.isArray(result)) {
            result = result.flatMap((item) => {
                if (typeof item === "string" && item.startsWith("[")) {
                    try {
                        return JSON.parse(item);
                    } catch {
                        return item;
                    }
                }
                return item;
            });
        }
        return Array.from(
            new Set((Array.isArray(result) ? result : []).map(String))
        );
    };

    const getData = async (showToast = false) => {
        try {
            setLoading(true);
            const res = await axios.get("https://shirt-backend-33gt.onrender.com/shirt/showAll");
            setdata(res.data.data || []);
            if (showToast) {
                toast.success("Inventory synchronized");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Unable to load products inventory");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        getData(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("adminToken");
        try {
            await axios.delete(`https://shirt-backend-33gt.onrender.com/shirt/delete?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    token: token,
                },
            });
            setdata((prev) => prev.filter((item) => item._id !== id));
            toast.success("Piece removed from Collections");
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    const handleOpenEdit = (product) => {
        setSelectedProduct(product);
        setNewImages([]);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditModalOpen(false);
        setSelectedProduct(null);
        setNewImages([]);
    };

    const filteredProducts = data.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const catMatch = item.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = nameMatch || catMatch;

        const matchesCategory =
            selectedCategory === "ALL" ||
            item.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="all-products-container">
            {/* HEADER */}
            <div className="all-products-header">
                <div>
                    <span>INVENTORY MANAGEMENT</span>
                    <h1>All Products ({data.length})</h1>
                </div>
                <div className="header-actions">
                    <button
                        type="button"
                        className={`refresh-btn ${isRefreshing ? "spinning" : ""}`}
                        onClick={handleRefresh}
                        title="Refresh Products"
                    >
                        <RotateCcw size={15} />
                        <span>Refresh</span>
                    </button>

                    <button
                        type="button"
                        className="add-new-btn"
                        onClick={() => navigate("/admin/addproduct")}
                    >
                        <Plus size={16} />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* SEARCH + FILTER */}
            <div className="table-toolbar">
                <div className="search-box">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="category-filter-box">
                    <Filter size={15} className="filter-icon" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="ALL">All Categories</option>
                        <option value="Casual">Casual Shirts</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Egyptian Giza">Egyptian Giza</option>
                        <option value="Formal">Formal</option>
                        <option value="Linen">Linen</option>
                        <option value="Oxford">Oxford</option>
                        <option value="Slim Fit">Slim Fit</option>
                    </select>
                </div>
            </div>

            {/* PRODUCT LIST */}
            {loading ? (
                <div className="empty-state-box">Loading inventory...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-state-box">
                    No products found matching your search and category filter.
                </div>
            ) : (
                <div className="horizontal-products-list">
                    {filteredProducts.map((product) => {
                        const coverImage =
                            product.mainimage ||
                            (Array.isArray(product.previewimages) && product.previewimages[0]);

                        const productCleanSizes = getCleanSizes(product.sizes);
                        const hasSalePrice =
                            product.salePrice !== undefined &&
                            product.salePrice !== null &&
                            product.salePrice !== "" &&
                            Number(product.salePrice) > 0;

                        const hasOriginalPrice =
                            product.originalPrice !== undefined &&
                            product.originalPrice !== null &&
                            product.originalPrice !== "" &&
                            Number(product.originalPrice) > 0;

                        return (
                            <div className="product-row-item" key={product._id}>
                                <div className="row-image-box">
                                    {coverImage ? (
                                        <img
                                            src={`https://shirt-backend-33gt.onrender.com/images/productimages/${coverImage}`}
                                            alt={product.name}
                                            className="row-img"
                                        />
                                    ) : (
                                        <div className="row-no-img">
                                            <ImageIcon size={22} />
                                        </div>
                                    )}
                                    {product.badge && (
                                        <span className="row-badge">{product.badge}</span>
                                    )}
                                </div>

                                <div className="row-main-details">
                                    <span className="row-category">
                                        {product.category || "General"}
                                    </span>
                                    <h3 className="row-title">{product.name}</h3>
                                    <small className="row-id">
                                        SKU: {product._id?.slice(-8)}
                                    </small>
                                </div>

                                <div className="row-pricing-box">
                                    <div className="price-line">
                                        {hasSalePrice ? (
                                            <>
                                                <span className="row-sale-price">
                                                    ₹{Number(product.salePrice).toLocaleString("en-IN")}
                                                </span>
                                                {hasOriginalPrice && (
                                                    <del className="row-original-price">
                                                        ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                                    </del>
                                                )}
                                            </>
                                        ) : (
                                            hasOriginalPrice && (
                                                <span className="row-sale-price">
                                                    ₹{Number(product.originalPrice).toLocaleString("en-IN")}
                                                </span>
                                            )
                                        )}
                                    </div>
                                    {product.discount && (
                                        <span className="row-discount-tag">{product.discount}</span>
                                    )}
                                </div>

                                <div className="row-sizes-box">
                                    <span className="meta-label">Sizes</span>
                                    <div className="size-chips-wrap">
                                        {productCleanSizes.length > 0 ? (
                                            productCleanSizes.map((s, idx) => (
                                                <span key={idx} className="row-size-chip">
                                                    {s}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="row-size-chip muted">None</span>
                                        )}
                                    </div>
                                </div>

                                <div className="row-flags-box">
                                    <span className="meta-label">Status</span>
                                    <div className="flag-chips-wrap">
                                        {product.isBestSeller && (
                                            <span className="status-chip best">Best Seller</span>
                                        )}
                                        {product.isNewArrival && (
                                            <span className="status-chip new">New</span>
                                        )}
                                        {!product.isBestSeller && !product.isNewArrival && (
                                            <span className="status-chip standard">Standard</span>
                                        )}
                                    </div>
                                </div>

                                <div className="row-actions">
                                    <button
                                        type="button"
                                        className="row-action-btn edit"
                                        title="Edit Product"
                                        onClick={() => handleOpenEdit(product)}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="row-action-btn delete"
                                        title="Delete Product"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* EDIT MODAL */}
            {editModalOpen && selectedProduct && (
                <div className="modal-backdrop" onClick={handleCloseModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <span>PRODUCT MANAGEMENT</span>
                                <h2>Edit Product</h2>
                            </div>
                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={handleCloseModal}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    name: selectedProduct.name || "",
                                    category: selectedProduct.category || "",
                                    salePrice: selectedProduct.salePrice ?? "",
                                    originalPrice: selectedProduct.originalPrice ?? "",
                                    discount: selectedProduct.discount || "",
                                    badge: selectedProduct.badge || "",
                                    sizes: getCleanSizes(selectedProduct.sizes),
                                    isBestSeller: Boolean(selectedProduct.isBestSeller),
                                    isNewArrival: Boolean(selectedProduct.isNewArrival),
                                    mainimage: null,
                                    previewimages: [],
                                    description: selectedProduct.description || "",
                                }}
                                onSubmit={async (values) => {
                                    try {
                                        const formData = new FormData();
                                        formData.append("name", values.name);
                                        formData.append("category", values.category);
                                        formData.append("fabric", values.category);
                                        formData.append("description", values.description || "");

                                        const originalPrice = Number(values.originalPrice || 0);
                                        let salePrice = Number(values.salePrice || 0);
                                        const discountText = values.discount || "";

                                        const discountMatch = discountText.match(/(\d+(\.\d+)?)\s*%/);
                                        if (originalPrice > 0 && discountMatch) {
                                            const discountPercent = Number(discountMatch[1]);
                                            const discountAmount = (originalPrice * discountPercent) / 100;
                                            salePrice = Math.round(originalPrice - discountAmount);
                                        }

                                        formData.append("salePrice", salePrice > 0 ? salePrice : 0);
                                        formData.append("originalPrice", originalPrice > 0 ? originalPrice : 0);
                                        formData.append("discount", discountText);
                                        formData.append("badge", values.badge || "");
                                        formData.append("sizes", JSON.stringify(Array.from(new Set(values.sizes))));
                                        formData.append("isBestSeller", values.isBestSeller);
                                        formData.append("isNewArrival", values.isNewArrival);

                                        if (values.mainimage) {
                                            formData.append("mainimage", values.mainimage);
                                        }

                                        values.previewimages.forEach((img) => {
                                            formData.append("previewimages", img);
                                        });

                                        const token = localStorage.getItem("adminToken");
                                        const res = await axios.patch(
                                            `https://shirt-backend-33gt.onrender.com/shirt/updateOne?id=${selectedProduct._id}`,
                                            formData,
                                            {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                    Authorization: `Bearer ${token}`,
                                                    token: token,
                                                },
                                            }
                                        );

                                        if (res.data?.data) {
                                            setdata((prev) =>
                                                prev.map((item) =>
                                                    item._id === selectedProduct._id ? res.data.data : item
                                                )
                                            );
                                        }

                                        toast.success("Product specifications updated successfully");
                                        handleCloseModal();
                                        await getData();
                                    } catch (error) {
                                        console.error("Update Error:", error);
                                        toast.error(error.response?.data?.message || "Failed to update product");
                                    }
                                }}
                            >
                                {({ setFieldValue, values }) => {
                                    const currentFormSizes = getCleanSizes(values.sizes);

                                    return (
                                        <Form className="modal-form">
                                            <div className="form-section">
                                                <h3>General Information</h3>
                                                <div className="form-grid">
                                                    <div className="form-group full">
                                                        <label>Product Name</label>
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter product name"
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
                                                            type="text"
                                                            name="discount"
                                                            placeholder="e.g. 20% OFF"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group full">
                                                <label>Description</label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    placeholder="Enter product description"
                                                    rows="5"
                                                />
                                            </div>

                                            <div className="form-section">
                                                <h3>Product Images (Main &amp; Hover Preview)</h3>
                                                <div className="current-images-container">
                                                    <div className="current-image-card">
                                                        {selectedProduct.mainimage ? (
                                                            <img
                                                                src={`https://shirt-backend-33gt.onrender.com/images/productimages/${selectedProduct.mainimage}`}
                                                                alt="Main Image"
                                                                className="current-preview-img"
                                                            />
                                                        ) : (
                                                            <div className="no-current-img">No Main Image</div>
                                                        )}
                                                        <span className="img-type-badge main-badge">
                                                            Main / Cover
                                                        </span>
                                                    </div>

                                                    {Array.isArray(selectedProduct.previewimages) &&
                                                        selectedProduct.previewimages.length > 0 ? (
                                                        selectedProduct.previewimages.map((imgName, index) => (
                                                            <div className="current-image-card" key={index}>
                                                                <img
                                                                    src={`https://shirt-backend-33gt.onrender.com/images/productimages/${imgName}`}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="current-preview-img"
                                                                />
                                                                <span className="img-type-badge hover-badge">
                                                                    {index === 0 ? "Hover View" : `Angle ${index + 1}`}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="current-image-card empty">
                                                            <div className="no-current-img">No Hover Images</div>
                                                            <span className="img-type-badge muted">Hover / Preview</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="image-upload">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            if (files.length === 0) return;
                                                            const combined = [...newImages, ...files];
                                                            setNewImages(combined);
                                                            setFieldValue("mainimage", combined[0]);
                                                            setFieldValue("previewimages", combined.slice(1));
                                                            toast.success(`${files.length} new image(s) attached`);
                                                        }}
                                                    />
                                                    <UploadCloud
                                                        size={22}
                                                        style={{ color: "#555", marginBottom: "4px" }}
                                                    />
                                                    <strong>Choose New Images (Optional)</strong>
                                                    <span>
                                                        Image 1 = New Main Cover | Others = Hover/Slider
                                                    </span>
                                                </div>

                                                {newImages.length > 0 && (
                                                    <div className="image-preview">
                                                        {newImages.map((image, index) => (
                                                            <div className="preview-box" key={index}>
                                                                <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt="Preview"
                                                                />
                                                                <span className="badge-tag">
                                                                    {index === 0 ? "New Main" : `Hover ${index}`}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="remove-img-btn"
                                                                    onClick={() => {
                                                                        const updated = newImages.filter((_, i) => i !== index);
                                                                        setNewImages(updated);
                                                                        setFieldValue("mainimage", updated[0] || null);
                                                                        setFieldValue("previewimages", updated.slice(1));
                                                                        toast.success("Image removed from update selection");
                                                                    }}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-section">
                                                <h3>Pricing (Optional)</h3>
                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label>
                                                            Sale Price <span className="optional-tag">(Optional)</span>
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            name="salePrice"
                                                            placeholder="1599"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>
                                                            Original Price <span className="optional-tag">(Optional)</span>
                                                        </label>
                                                        <Field
                                                            type="number"
                                                            name="originalPrice"
                                                            placeholder="1999"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-section">
                                                <h3>Available Sizes</h3>
                                                <div className="size-box">
                                                    {["S", "M", "L", "XL", "XXL"].map((size) => {
                                                        const isChecked = currentFormSizes.includes(size);
                                                        return (
                                                            <label
                                                                key={size}
                                                                className={isChecked ? "size-label-checked" : ""}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    name="sizes"
                                                                    value={size}
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setFieldValue("sizes", Array.from(new Set([...currentFormSizes, size])));
                                                                        } else {
                                                                            setFieldValue("sizes", currentFormSizes.filter((s) => s !== size));
                                                                        }
                                                                    }}
                                                                />
                                                                {size}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="form-section">
                                                <h3>Product Badge</h3>
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

                                            <div className="form-section">
                                                <h3>Section Visibility</h3>
                                                <div className="section-options">
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

                                            <div className="form-actions">
                                                <button
                                                    type="button"
                                                    className="cancel-btn"
                                                    onClick={handleCloseModal}
                                                >
                                                    Cancel
                                                </button>
                                                <button type="submit" className="add-product-btn">
                                                    Save Changes
                                                </button>
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllProducts;