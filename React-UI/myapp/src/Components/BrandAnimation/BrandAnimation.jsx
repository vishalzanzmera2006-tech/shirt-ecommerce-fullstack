import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./BrandAnimation.css";

const BrandAnimation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 4s Full name -> 3.5s Monogram (C & C)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsCollapsed((prev) => !prev);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  // GPU Spring Physics for Butter-Smooth Transitions
  const foldTransition = {
    duration: 0.85,
    ease: [0.16, 1, 0.3, 1], // Cubic-bezier for silky feel
  };

  return (
    <div className="ultra-brand-root" aria-label="Crest & Collar">
      {/* 1. Minimal Geometric Collar Crown */}
      <motion.div
        className="collar-apex"
        animate={{ scale: isCollapsed ? 1.1 : 1 }}
        transition={foldTransition}
      >
        <span className="apex-line left"></span>
        <span className="apex-diamond">◇</span>
        <span className="apex-line right"></span>
      </motion.div>

      {/* 2. Core Typography Stage */}
      <div className="brand-motion-viewport">
        {/* FIRST WORD: C + REST */}
        <div className="word-pack">
          <motion.span
            className="monogram-c"
            animate={{ scale: isCollapsed ? 1.16 : 1 }}
            transition={foldTransition}
          >
            C
          </motion.span>
          <motion.span
            className="fold-body"
            initial={false}
            animate={{
              width: isCollapsed ? 0 : "auto",
              opacity: isCollapsed ? 0 : 1,
              x: isCollapsed ? -6 : 0,
            }}
            transition={foldTransition}
          >
            REST
          </motion.span>
        </div>

        {/* AMPERSAND */}
        <motion.span
          className="brand-amp"
          animate={{
            margin: isCollapsed ? "0 10px" : "0 4px",
            scale: isCollapsed ? 1.15 : 1,
          }}
          transition={foldTransition}
        >
          &amp;
        </motion.span>

        {/* SECOND WORD: C + OLLAR */}
        <div className="word-pack">
          <motion.span
            className="monogram-c"
            animate={{ scale: isCollapsed ? 1.16 : 1 }}
            transition={foldTransition}
          >
            C
          </motion.span>
          <motion.span
            className="fold-body"
            initial={false}
            animate={{
              width: isCollapsed ? 0 : "auto",
              opacity: isCollapsed ? 0 : 1,
              x: isCollapsed ? -6 : 0,
            }}
            transition={foldTransition}
          >
            OLLAR
          </motion.span>
        </div>
      </div>

      {/* 3. Hairline Underline Tracker */}
      <motion.div
        className="hairline-under"
        animate={{ width: isCollapsed ? 64 : 180 }}
        transition={foldTransition}
      />
    </div>
  );
};

export default BrandAnimation;