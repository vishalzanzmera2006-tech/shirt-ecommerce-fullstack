import React from "react";
import { Sparkles, Scissors, RefreshCw, Truck } from "lucide-react";
import "./TrustPillars.css";

const TrustPillars = () => {
  return (
    <section className="trust-pillars-bar">
      <div className="trust-pillars-container">

        <div className="trust-pillar-item">
          <div className="pillar-icon">
            <Sparkles size={20} strokeWidth={1.4} />
          </div>

          <div className="pillar-text">
            <h4>100% GIZA & LINEN</h4>
            <p>Long-staple natural fibers</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="pillar-icon">
            <Scissors size={20} strokeWidth={1.4} />
          </div>

          <div className="pillar-text">
            <h4>BESPOKE TAILORING</h4>
            <p>Single-needle precision finish</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="pillar-icon">
            <RefreshCw size={20} strokeWidth={1.4} />
          </div>

          <div className="pillar-text">
            <h4>EASY 7-DAY EXCHANGE</h4>
            <p>Hassle-free doorstep pickup</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="pillar-icon">
            <Truck size={20} strokeWidth={1.4} />
          </div>

          <div className="pillar-text">
            <h4>COMPLIMENTARY SHIPPING</h4>
            <p>On all prepaid orders</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustPillars;