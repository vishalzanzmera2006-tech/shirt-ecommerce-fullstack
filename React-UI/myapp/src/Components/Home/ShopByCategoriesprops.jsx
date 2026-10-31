import React from "react";
import { useNavigate } from "react-router-dom";

const ShopByCategoriesprops = ({
    title,
    description,
    image,
    size,
    link,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (link) {
            navigate(link);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div
            className={`category-card ${size}`}
            onClick={handleClick}
            style={{ cursor: link ? "pointer" : "default" }}
        >
            <div className="category-image">
                <img
                    src={image}
                    alt={title}
                />
                <div className="category-overlay"></div>
            </div>

            <div className="category-content">
                <div className="category-text">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>

                <div className="category-arrow">
                    ↗
                </div>
            </div>
        </div>
    );
};

export default ShopByCategoriesprops;