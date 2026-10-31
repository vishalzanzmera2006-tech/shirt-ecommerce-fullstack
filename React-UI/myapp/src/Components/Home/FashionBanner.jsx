import React from "react";
import { useNavigate } from "react-router-dom";
import banner from "../../assets/Banner.webp"
import "./FashionBanner.css";

const FashionBanner = () => {
    const navigate = useNavigate();

    return (
        <section className="fashion-banner">
            <div className="fashion-banner-image">
                <img
                    src={banner}
                    alt="Atelier Fashion Banner"
                    loading="lazy"
                />
            </div>

        </section>
    );
};

export default FashionBanner;