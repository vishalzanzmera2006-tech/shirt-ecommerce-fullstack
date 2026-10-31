import React from "react";
import WhyUsprops from "./WhyUsprops";
import "./WhyUs.css";

const features = [
    {
        number: "01",
        title: "PREMIUM FABRICS",
        text: "Long-staple 100% Giza cotton and French linen curated for breathability and lasting softness.",
    },
    {
        number: "02",
        title: "PRECISION FIT",
        text: "Architectural silhouettes engineered with Italian interlinings to maintain confident structure.",
    },
    {
        number: "03",
        title: "TIMELESS DESIGN",
        text: "Refined wardrobe essentials created to stay modern, versatile, and sharp season after season.",
    },
    {
        number: "04",
        title: "BESPOKE ACCENTS",
        text: "Mother-of-pearl hardware and 18-SPI single-needle stitching for lasting garment longevity.",
    },
];

const WhyUs = () => {
    return (
        <section className="why-us">

            <div className="why-header">
                <h2>
                    Why Us.
                </h2>

                <p>
                    Every piece reflects our commitment to exceptional fabrics,
                    precise construction and timeless style.
                </p>
            </div>

            <div className="why-features">
                {
                    features.map((feature) => (
                        <WhyUsprops
                            key={feature.number}
                            feature={feature}
                        />
                    ))}
            </div>

        </section>
    );
};

export default WhyUs;