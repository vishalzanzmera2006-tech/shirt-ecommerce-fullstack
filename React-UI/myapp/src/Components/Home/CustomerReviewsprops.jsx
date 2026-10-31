import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";

const CustomerReviewsprops = ({
    clientName,
    profession,
    city,
    avatar,
    shirtPurchased,
    quote,
}) => {

    return (
        <div className="review-card">

            {/* IMAGE */}

            <div className="review-image-box">

                <img
                    src={avatar}
                    alt={clientName}
                    className="review-img"
                />

                <div className="verified-badge">
                    <ShieldCheck size={13} />
                    <span>Verified Patron</span>
                </div>

            </div>


            {/* CONTENT */}

            <div className="review-content">

                <div className="stars-row">

                    <Star size={13} fill="#111" stroke="#111" />
                    <Star size={13} fill="#111" stroke="#111" />
                    <Star size={13} fill="#111" stroke="#111" />
                    <Star size={13} fill="#111" stroke="#111" />
                    <Star size={13} fill="#111" stroke="#111" />

                </div>

                <Quote
                    size={24}
                    className="quote-icon"
                />

                <p className="review-text">
                    "{quote}"
                </p>

                <div className="review-shirt">
                    <span>PIECE:</span>
                    {shirtPurchased}
                </div>

                <div className="review-author">

                    <h4>
                        {clientName}
                    </h4>

                    <p>
                        {profession} — <em>{city}</em>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default CustomerReviewsprops;