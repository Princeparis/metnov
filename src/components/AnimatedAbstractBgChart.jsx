// components/AnimatedAbstractBgChart.js
"use client"; // For Next.js App Router

import React, { useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./AnimatedAbstractBgChart.module.css";

gsap.registerPlugin(ScrollTrigger); // Register ScrollTrigger plugin globally

const AnimatedAbstractBgChart = () => {
  const containerRef = useRef(null); // Ref for the main container and ScrollTrigger target

  // Internal SVG coordinate system dimensions
  const svgWidth = 1000;
  const svgHeight = 750; // Proportional to the 75vh target height

  // Memoized generation of abstract "data" for bars and lines
  const numBars = useMemo(() => Math.floor(25 + Math.random() * 15), []); // 25-40 bars
  const barData = useMemo(
    () =>
      Array.from({ length: numBars }, (_, i) => ({
        id: `bar-${i}`,
        value: (0.15 + Math.random() * 0.75) * svgHeight, // Bar height: 15% to 90% of svgHeight
      })),
    [numBars, svgHeight]
  ); // svgHeight is a dependency

  const numGridLines = useMemo(() => Math.floor(4 + Math.random() * 4), []); // 4-8 horizontal grid lines

  // Calculate bar width and spacing based on the number of bars
  const barWidth = (svgWidth / numBars) * 0.5; // Bars take 50% of their allocated space
  const barSpacingTotal = (svgWidth / numBars) * 0.5; // Spacing takes the other 50%

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Ensure container starts visible if ScrollTrigger is going to manage its opacity
      gsap.set(containerRef.current, { opacity: 1 });

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%", // Animation begins when top of container is 85% from viewport top
          end: "bottom 15%", // Animation is complete when bottom of container is 15% from viewport top
          scrub: 1.5, // Smooth scrubbing effect
          // markers: process.env.NODE_ENV === 'development', // Show markers only in development
          onEnter: () =>
            gsap.to(containerRef.current, { opacity: 1, duration: 0.3 }), // Fade in when entering
          onLeave: () =>
            gsap.to(containerRef.current, { opacity: 0.2, duration: 1 }), // Tone down when leaving
          onEnterBack: () =>
            gsap.to(containerRef.current, { opacity: 1, duration: 0.3 }), // Fade back in
          onLeaveBack: () =>
            gsap.to(containerRef.current, { opacity: 0.2, duration: 1 }), // Tone down when scrolling up past it
        },
      });

      // --- Phase 1: Animate Grid Lines ---
      const gridLines = containerRef.current.querySelectorAll(
        `.${styles.gridLine}`
      );
      if (gridLines.length > 0) {
        masterTimeline.to(
          gridLines,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 1, // Duration relative to the scrub range
            ease: "power1.inOut",
            stagger: 0.1,
          },
          "startEffect"
        ); // Timeline label
      }

      // --- Phase 2: Animate Bar Groups (for unified "3D" bar animation) ---
      const barGroups = containerRef.current.querySelectorAll(
        `.${styles.barGroup}`
      );
      if (barGroups.length > 0) {
        masterTimeline.fromTo(
          barGroups,
          {
            // Use fromTo for explicit start and end states
            scaleY: 0,
            opacity: 0,
            // transformOrigin: 'bottom center' // Already set in CSS
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.8, // Duration relative to scrub range
            ease: "circ.out",
            stagger: {
              each: 0.02,
              from: "random", // Animate bars in a random order
            },
          },
          "startEffect+=0.25"
        ); // Start slightly after grid lines begin drawing
      }
    },
    { scope: containerRef, dependencies: [barData, numGridLines] }
  ); // Re-run if memoized data changes

  return (
    <div ref={containerRef} className={styles.bgChartContainer}>
      <svg
        className={styles.bgChartSvg}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid slice" // Ensures SVG content fills container, may crop
      >
        {/* Define gradients for the "3D" bar effect */}
        <defs>
          <linearGradient
            id="abstractBarGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(255,255,255,0.25)" }} />
            <stop
              offset="30%"
              style={{ stopColor: "rgba(255,255,255,0.15)" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.05)" }}
            />
          </linearGradient>
          <linearGradient
            id="abstractBarHighlightGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(255,255,255,0.3)" }} />
            <stop offset="50%" style={{ stopColor: "rgba(255,255,255,0.1)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.3)" }}
            />
          </linearGradient>
        </defs>

        {/* Group for Grid Lines */}
        <g className="grid-lines-group">
          {Array.from({ length: numGridLines }).map((_, i) => {
            // Randomize Y position slightly for a more abstract, less uniform look
            const yPos =
              (i + 0.5) * (svgHeight / numGridLines) +
              (Math.random() - 0.5) * ((svgHeight / numGridLines) * 0.25);
            return (
              <line
                key={`grid-line-${i}`}
                className={styles.gridLine}
                x1={0}
                y1={yPos}
                x2={svgWidth}
                y2={yPos}
              />
            );
          })}
        </g>

        {/* Group for Bars */}
        <g className="bars-group">
          {barData.map((d, i) => {
            const x = i * (barWidth + barSpacingTotal) + barSpacingTotal / 2;
            const barFinalHeight = d.value;
            const yPosWhenFull = svgHeight - barFinalHeight;
            const highlightHeight = Math.min(
              barFinalHeight * 0.15,
              svgHeight * 0.025
            ); // Highlight is 15% of bar or max 2.5% of chart height

            return (
              <g key={d.id} className={styles.barGroup}>
                {/* Main bar body with vertical gradient */}
                <rect
                  className={styles.bar}
                  x={x}
                  y={yPosWhenFull}
                  width={barWidth}
                  height={barFinalHeight}
                  fill="url(#abstractBarGradient)"
                />
                {/* "Top Highlight" strip */}
                <rect
                  className={styles.barHighlight}
                  x={x}
                  y={yPosWhenFull} // Positioned at the top of the main bar
                  width={barWidth}
                  height={highlightHeight}
                  fill="url(#abstractBarHighlightGradient)"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default AnimatedAbstractBgChart;
