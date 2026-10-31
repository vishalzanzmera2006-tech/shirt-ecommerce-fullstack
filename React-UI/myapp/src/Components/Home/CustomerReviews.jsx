import React, { useEffect, useState } from "react";
import CustomerReviewsprops from "./CustomerReviewsprops";

import review1 from "../../assets/Review1.jpg"
import review2 from "../../assets/Review2.jpg"
import review3 from "../../assets/Review3.jpg"
import review4 from "../../assets/Review4.jpg"

import "./CustomerReviews.css";

const reviewsData = [
    {
        id: 1,
        clientName: "Kabir Mehra",
        profession: "Creative Director",
        city: "Mumbai",
        avatar:
            review1,
        shirtPurchased: "The Royal Oxford Twill (Optic White)",
        quote:
            "The cutaway collar stiffness is unmatched. It stays razor-sharp under my blazer throughout long workdays without curling.",
    },
    {
        id: 2,
        clientName: "Rohan Malhotra",
        profession: "Principal Architect",
        city: "New Delhi",
        avatar:
            review2,
        shirtPurchased: "Normandy Pure Linen (Sand Beige)",
        quote:
            "Arrived pre-softened with bio-wash. Phenomenal breathable slub texture and fluid drape for humid afternoons.",
    },
    {
        id: 3,
        clientName: "Aarav Singhania",
        profession: "Fintech Lead",
        city: "Bengaluru",
        avatar:
            review3,
        shirtPurchased: "Monochrome Noir Satin (Pitch Black)",
        quote:
            "The smoked mother-of-pearl buttons and clean single-needle stitching give it an exceptional bespoke evening presence.",
    },
    {
        id: 4,
        clientName: "Devansh Rao",
        profession: "Brand Strategist",
        city: "Hyderabad",
        avatar:
            review4,
        shirtPurchased: "Cuban Oversized (Sage Green)",
        quote:
            "Heavyweight cotton with structured drape. Fits true to size with a clean modern streetwear profile.",
    },
];

const CustomerReviews = () => {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrent((prev) =>
                prev === reviewsData.length - 1 ? 0 : prev + 1
            );

        }, 4000);

        return () => clearInterval(timer);

    }, []);

    return (
        <section className="customer-reviews-section">

            {/* HEADER */}

            <div className="reviews-header">

                <span className="reviews-kicker">
                    PATRON PORTRAITS
                </span>

                <h2 className="reviews-title">
                    Customers Reviews
                </h2>

                <p className="reviews-subtitle">
                    Real experiences from patrons who value precision tailoring.
                </p>

            </div>


            {/* SLIDER */}

            <div className="slider-viewport">

                <div
                    className="slider-track"
                    style={{
                        transform: `translateX(-${current * 100}%)`,
                    }}
                >

                    {reviewsData.map((item) => (

                        <div
                            className="slide-item"
                            key={item.id}
                        >

                            <CustomerReviewsprops
                                clientName={item.clientName}
                                profession={item.profession}
                                city={item.city}
                                avatar={item.avatar}
                                shirtPurchased={item.shirtPurchased}
                                quote={item.quote}
                            />

                        </div>

                    ))}

                </div>

            </div>


            {/* DOTS */}

            <div className="slider-dots">

                {reviewsData.map((item, index) => (

                    <button
                        key={item.id}
                        className={`dot ${index === current ? "active" : ""
                            }`}
                        onClick={() => setCurrent(index)}
                        aria-label={`Go to review ${index + 1}`}
                    />

                ))}

            </div>

        </section>
    );
};

export default CustomerReviews;