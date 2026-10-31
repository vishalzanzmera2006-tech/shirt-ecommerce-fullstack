import { useEffect } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const SmoothScroll = () => {

    useEffect(() => {

        // Mobile / Tablet = Default Scroll
        if (window.innerWidth <= 768) {
            return;
        }

        const handleWheel = (event) => {

            window.scrollTo({
                top: window.scrollY + event.deltaY,
                behavior: "smooth",
            });

        };

        window.addEventListener("wheel", handleWheel, {
            passive: true,
        });

        return () => {
            window.removeEventListener("wheel", handleWheel);
        };

    }, []);

    return null;
};

export default SmoothScroll;