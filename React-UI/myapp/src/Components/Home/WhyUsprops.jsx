import React from "react";

const WhyUsprops = ({ feature }) => {
    return (
        <div className="why-item">

            <span className="why-number">
                {feature.number}
            </span>

            <h3>
                {feature.title}
            </h3>

            <p>
                {feature.text}
            </p>

        </div>
    );
};

export default WhyUsprops;