import React from "react";
import { useNavigate } from "react-router-dom";

import lookbook1 from "../../assets/Lookbook1.jpg";
import lookbook2 from "../../assets/Lookbook2.jpg";
import lookbook3 from "../../assets/Lookbook3.jpg";
import lookbook4 from "../../assets/Lookbook4.jpg";

import "./Lookbook.css";

const looks = [
    {
        id: "01",
        title: "THE MODERN CLASSIC",
        category: "FORMAL EDIT",
        description: "Sharp tailoring with a timeless attitude.",
        image:
            lookbook1,
        link: "/shirts/formal",
    },
    {
        id: "02",
        title: "WEEKEND NOIR",
        category: "CASUAL EDIT",
        description: "Relaxed layers built for effortless evenings.",
        image:
            lookbook2,
        link: "/shirts/casual",
    },
    {
        id: "03",
        title: "SUMMER FORM",
        category: "LINEN EDIT",
        description: "Natural textures and effortless silhouettes.",
        image:
            lookbook3,
        link: "/shirts/linen",
    },
    {
        id: "04",
        title: "URBAN LAYER",
        category: "OVERSHIRT EDIT",
        description: "Contemporary layering for modern city life.",
        image:
            lookbook4,
        link: "/shirts/all",
    },
];

const Lookbook = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (path) {
            navigate(path);
            window.scrollTo(0, 0);
        }
    };

    return (
        <section className="lookbook">
            {/* HEADER */}
            <div className="lookbook-header">
                <span className="lookbook-number">LOOKBOOK</span>
                <h2>Crest &amp; Collar</h2>
                <p>
                    Explore our latest editorial looks and discover new ways to wear the collection.
                </p>
            </div>

            {/* GRID */}
            <div className="lookbook-grid">
                {
                    looks.map((look) => (
                        <div
                            className="lookbook-card"
                            key={look.id}
                            onClick={() => handleNavigate(look.link)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className="lookbook-image">
                                <img
                                    src={look.image}
                                    alt={look.title}
                                    loading="lazy"
                                />
                                <button
                                    type="button"
                                    className="lookbook-arrow"
                                    aria-label={`View ${look.title}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigate(look.link);
                                    }}
                                >
                                    →
                                </button>
                            </div>

                            <div className="lookbook-info">
                                <span>{look.category}</span>
                                <h3>{look.title}</h3>
                                <p>{look.description}</p>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};

export default Lookbook;