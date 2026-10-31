import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import "./BackToTop.css";

const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const height =
                document.documentElement.scrollHeight - window.innerHeight;

            const percentage = height
                ? (scrollTop / height) * 100
                : 0;

            setProgress(percentage);
            setVisible(scrollTop > 400);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            className={`back-to-top ${visible ? "show" : ""}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <svg className="progress-ring" viewBox="0 0 54 54">
                <circle
                    className="progress-bg"
                    cx="27"
                    cy="27"
                    r="24"
                />

                <circle
                    className="progress-bar"
                    cx="27"
                    cy="27"
                    r="24"
                    style={{
                        strokeDashoffset:
                            150.8 - (150.8 * progress) / 100,
                    }}
                />
            </svg>

            <span className="back-to-top-arrow">
                <ArrowUp size={17} />
            </span>

            <span className="back-to-top-text">
                TOP
            </span>
        </button>
    );
};

export default BackToTop;