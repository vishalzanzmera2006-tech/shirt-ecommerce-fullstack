import React, { useEffect, useState } from "react";
import "./Preloader.css";

const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [exit, setExit] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);

                    setTimeout(() => {
                        setExit(true);
                    }, 400);

                    return 100;
                }

                return prev + 2;
            });
        }, 35);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={`cc-preloader ${exit ? "cc-preloader--exit" : ""}`}>

            <div className="cc-preloader__center">

                {/* CC Logo */}
                <div className="cc-logo-mark">

                    <div className="cc-ring cc-ring--outer"></div>

                    <div className="cc-ring cc-ring--inner"></div>

                    <div className="cc-monogram">
                        <span>C</span>
                        <span>C</span>
                    </div>

                </div>

                {/* Brand */}
                <div className="cc-line"></div>

                <div className="cc-brand">
                    CREST <span>&</span> COLLAR
                </div>

                {/* Progress */}
                <div className="cc-progress-number">
                    {progress}%
                </div>

                {/* Progress Line */}
                <div className="cc-progress-line">
                    <div
                        className="cc-progress-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

            </div>

        </div>
    );
};

export default Preloader;
