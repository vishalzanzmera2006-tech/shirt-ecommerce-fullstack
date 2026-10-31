import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

import heroImg1 from "../../assets/Carouselimg1.jpg";
import heroImg2 from "../../assets/Carouselimg2.jpg";
import heroImg3 from "../../assets/Carouselimg3.jpg";
import heroImg4 from "../../assets/Carouselimg4.jpg";

const slides = [
  {
    id: 1,
    tag: "THE CORE HERO // FORMAL EDIT",
    title: "THE MASTERPIECE WHITE",
    subtitle: "100% Giza Cotton • French Cutaway Collar",
    description:
      "Crafted with 2-ply combed organic cotton for unyielding structure, crispness, and timeless corporate command.",
    cta: "SHOP BUSINESS CLASSICS",
    image:
      heroImg1,
    link: "/shirts/formal",
  },
  {
    id: 2,
    tag: "RESORT & CASUAL // SUMMER EDIT",
    title: "NORMANDY PURE LINEN",
    subtitle: "Breathable European Flax • Pre-Washed Softness",
    description:
      "Airy, relaxed silhouettes with an open camp collar engineered for coastal breezes and effortless weekend styling.",
    cta: "EXPLORE RESORT CAPSULE",
    image:
      heroImg2,
    link: "/shirts/linen",
  },
  {
    id: 3,
    tag: "BLACK LABEL // EVENING SERIES",
    title: "MONOCHROME NOIR",
    subtitle: "High-Lustre Satin Twill • Concealed Placket",
    description:
      "A deep pitch-black statement piece designed with smoked mother-of-pearl buttons for commanding night affairs.",
    cta: "DISCOVER EVENING WEAR",
    image:
      heroImg3,
    link: "/newin",
  },
  {
    id: 4,
    tag: "ATELIER CRAFTSMANSHIP // PRECISION",
    title: "TAILORED TO PERFECTION",
    subtitle: "Single-Needle Stitching • Mother of Pearl Finishes",
    description:
      "Every seam, collar point, and cuff is calculated to perfection for unparalleled longevity and drape.",
    cta: "EXPLORE OUR CRAFT",
    image:
      heroImg4,
    link: "/aboutus",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6500);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="full-hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="carousel-bg"
          style={{
            backgroundImage: `url(${slide.image})`,
          }}
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 1,
          }}
        >
          <div className="carousel-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="carousel-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="carousel-text-box"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -15,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <span className="carousel-tag">
              {slide.tag}
            </span>

            <h1 className="carousel-title">
              {slide.title}
            </h1>

            <p className="carousel-sub">
              {slide.subtitle}
            </p>

            <p className="carousel-desc">
              {slide.description}
            </p>

            <button
              type="button"
              className="carousel-cta-btn"
              onClick={() => navigate(slide.link)}
            >
              <span>{slide.cta}</span>
              <ArrowRight size={15} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        className="carousel-arrow prev"
        onClick={prevSlide}
        aria-label="Previous"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        className="carousel-arrow next"
        onClick={nextSlide}
        aria-label="Next"
      >
        <ChevronRight size={22} />
      </button>

      <div className="carousel-dots">
        {slides.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
          >
            <span className="dot-label">
              0{index + 1}
            </span>

            <span className="dot-line">
              {index === current && (
                <motion.span
                  className="dot-fill"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 6.5,
                    ease: "linear",
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;