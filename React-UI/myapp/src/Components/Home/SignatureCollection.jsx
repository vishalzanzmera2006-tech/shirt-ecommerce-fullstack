import React from "react";
import "./SignatureCollection.css";

const collections = [
    {
        id: "01",
        title: "THE ESSENTIAL",
        subtitle: "TIMELESS / REFINED",
        description: "Clean silhouettes and timeless colors made for everyday elegance.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "02",
        title: "THE NOIR",
        subtitle: "DARK / STRUCTURED",
        description: "Bold black shirts crafted with a sharp modern attitude.",
        image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "03",
        title: "THE LINEN",
        subtitle: "NATURAL / LIGHT",
        description: "Relaxed linen silhouettes designed for effortless dressing.",
        image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=1200&auto=format&fit=crop",
    },
];

const SignatureCollection = () => {
    return (
        <section className="signature-collection">

            <div className="signature-header">

                <span className="signature-number">
                    04 / COLLECTION
                </span>

                <h2>
                    SIGNATURE
                    <span> COLLECTION</span>
                </h2>

                <p>
                    Our defining pieces. Carefully designed silhouettes,
                    premium fabrics and timeless character.
                </p>

            </div>


            <div className="signature-grid">

                {collections.map((collection) => (

                    <div
                        className="signature-card"
                        key={collection.id}
                    >

                        <div className="signature-image-box">

                            <img
                                src={collection.image}
                                alt={collection.title}
                            />

                            <span className="signature-id">
                                {collection.id}
                            </span>

                            <button className="signature-arrow">
                                →
                            </button>

                        </div>


                        <div className="signature-info">

                            <div>

                                <span className="signature-subtitle">
                                    {collection.subtitle}
                                </span>

                                <h3>
                                    {collection.title}
                                </h3>

                            </div>

                            <p>
                                {collection.description}
                            </p>

                        </div>

                    </div>

                ))}

            </div>


            <div className="signature-footer">

                <span>
                    DISCOVER THE SIGNATURE SERIES
                </span>

                <button>
                    EXPLORE COLLECTION →
                </button>

            </div>

        </section>
    );
};

export default SignatureCollection;