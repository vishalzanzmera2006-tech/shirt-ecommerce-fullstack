import React from "react";
import { motion } from "framer-motion";
import "./ShopByCategories.css";
import ShopByCategoriesprops from "./ShopByCategoriesprops";

import formalShirt from "../../assets/LandingPage-image/FORMAL-category.jpg";
import casualShirt from "../../assets/LandingPage-image/CASUAL-category.jpg";
import linenShirt from "../../assets/LandingPage-image/LINEN-category.jpg";
import overshirt from "../../assets/LandingPage-image/OVERSHIRTS-category.jpg";

const categories = [
    {
        number: "01",
        title: "FORMAL",
        subtitle: "SHARP / REFINED",
        description:
            "Precision tailoring for a confident and sophisticated presence.",
        image: formalShirt,
        size: "large",
        link: "/shirts/formal",
    },
    {
        number: "02",
        title: "CASUAL",
        subtitle: "EFFORTLESS / EVERYDAY",
        description:
            "Relaxed silhouettes designed for effortless everyday style.",
        image: casualShirt,
        size: "small",
        link: "/shirts/casual",
    },
    {
        number: "03",
        title: "LINEN",
        subtitle: "LIGHT / NATURAL",
        description:
            "Breathable fabrics and timeless silhouettes made for warmer days.",
        image: linenShirt,
        size: "small",
        link: "/shirts/linen",
    },
    {
        number: "04",
        title: "OXFORDSHIRTS",
        subtitle: "LAYERED / MODERN",
        description:
            "A contemporary layer designed for modern everyday dressing.",
        image: overshirt,
        size: "wide",
        link: "/shirts/oxford",
    },
];

const ShopByCategories = () => {
    return (
        <section className="shop-categories">
            <div className="shop-categories-header">
                <motion.div
                    className="categories-title-area"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="categories-label">COLLECTIONS</span>

                    <h2>
                        Shop By Category
                    </h2>

                    <p className="categories-subtitle">
                        Explore our curated range of premium shirts designed for every occasion.
                    </p>
                </motion.div>
            </div>

            <div className="categories-grid">
                {categories.map((el, index) => (
                    <motion.div
                        key={el.number}
                        initial={{
                            opacity: 0,
                            y: 50,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.1,
                        }}
                    >
                        <ShopByCategoriesprops
                            title={el.title}
                            description={el.description}
                            image={el.image}
                            size={el.size}
                            link={el.link} 
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ShopByCategories;