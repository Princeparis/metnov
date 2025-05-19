// components/AnimatedWaves.js
"use client";

import React, { useRef } from "react"; // Removed useEffect
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"; // Import the hook
import styles from "./AnimatedWaves.module.css";

// GSAP plugins like InertiaPlugin, ScrollTrigger, etc., should still be registered globally if used,
// but for this component, we are only using GSAP core tweens and timelines.
// gsap.registerPlugin(InertiaPlugin); // Only if InertiaPlugin was actually used here

const AnimatedWaves = () => {
  const containerRef = useRef(null); // This will be our scope
  // We still need refs for dynamically created elements if we want to target them individually
  // and not rely solely on querySelectors within the scope.
  // For this pattern of iterating and creating distinct timelines, direct refs are clear.
  const waveRefs = useRef([]);

  // Wave configuration (remains the same)
  const waveConfigs = [
    {
      color: "rgba(108, 188, 255, 0.5)",
      yOffset: 0,
      duration: 10,
      scaleX: 1.05,
    },
    { color: "rgba(75, 140, 255, 0.4)", yOffset: 5, duration: 12, scaleX: 1.1 },
    {
      color: "rgba(120, 100, 220, 0.3)",
      yOffset: 10,
      duration: 15,
      scaleX: 1.0,
    },
    {
      color: "rgba(180, 140, 255, 0.25)",
      yOffset: 15,
      duration: 18,
      scaleX: 1.15,
    },
  ];

  // Reset waveRefs array on each render before JSX populates it,
  // to ensure it's clean if waveConfigs were to change (though they are static here).
  waveRefs.current = [];

  useGSAP(
    () => {
      // This function runs after the component renders and refs are set.
      // GSAP animations created here are automatically cleaned up.

      if (waveRefs.current.length === 0) return;

      waveRefs.current.forEach((waveEl, index) => {
        if (!waveEl) return; // Safety check
        const config = waveConfigs[index];

        gsap.set(waveEl, {
          y: `${config.yOffset}%`,
          opacity: 1,
        });

        const tl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          delay: index * 0.5,
        });

        tl.to(waveEl, {
          y: `-${10 + Math.random() * 15}%`,
          scaleX: config.scaleX + (Math.random() - 0.5) * 0.1,
          opacity: 0.8 + Math.random() * 0.2,
          duration: config.duration / 2 + (Math.random() - 0.5) * 2,
          ease: "sine.inOut",
        }).to(waveEl, {
          y: `${config.yOffset + Math.random() * 5}%`,
          scaleX: 1 + (Math.random() - 0.5) * 0.05,
          opacity: 0.7 + Math.random() * 0.2,
          duration: config.duration / 2 + (Math.random() - 0.5) * 2,
          ease: "sine.inOut",
        });
      });
    },
    { scope: containerRef, dependencies: [waveConfigs] }
  ); // Scope animations to containerRef.
  // Re-run if waveConfigs changes (though it's static here).

  return (
    <div ref={containerRef} className={styles.wavesContainer}>
      {waveConfigs.map((config, index) => (
        <div
          key={index}
          // Assign to the array of refs.
          // Note: waveRefs.current will be populated *after* the first render,
          // and useGSAP runs after that.
          ref={(el) => {
            if (el) waveRefs.current[index] = el;
          }}
          className={`${styles.waveLayer} ${styles.waveLayerDiv}`}
          style={{
            backgroundColor: config.color,
            zIndex: waveConfigs.length - index,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedWaves;
