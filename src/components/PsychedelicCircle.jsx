// components/PsychedelicCircle.js
"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./PsychedelicCircle.module.css";

const PsychedelicCircle = () => {
  const containerRef = useRef(null); // Ref for the main div container
  const svgRef = useRef(null); // Ref for the SVG element
  const circleRef = useRef(null); // Ref for the circle element
  const gradientRef = useRef(null); // Ref for the radial gradient

  // Refs for quickTo functions for mouse interaction
  const fxRef = useRef(null);
  const fyRef = useRef(null);
  const gradRadiusRef = useRef(null);

  // Gradient stop refs if we animate individual stop colors
  const stop1Ref = useRef(null);
  const stop2Ref = useRef(null);
  const stop3Ref = useRef(null);

  useGSAP(
    () => {
      if (
        !circleRef.current ||
        !gradientRef.current ||
        !svgRef.current ||
        !stop1Ref.current ||
        !stop2Ref.current ||
        !stop3Ref.current
      ) {
        console.warn("PsychedelicCircle: Refs not ready for GSAP.");
        return;
      }

      const svg = svgRef.current;

      // --- Initial Gradient Animation ---
      const tl = gsap.timeline({ repeat: -1, yoyo: true });

      // Animate gradient stop colors for psychedelic effect
      tl.to(stop1Ref.current, {
        attr: { "stop-color": "#FF69B4" },
        duration: 3,
        ease: "sine.inOut",
      }) // Hot Pink
        .to(
          stop1Ref.current,
          {
            attr: { "stop-color": "#40E0D0" },
            duration: 4,
            ease: "sine.inOut",
          },
          "+=1"
        ) // Turquoise
        .to(
          stop1Ref.current,
          {
            attr: { "stop-color": "#76EEC6" },
            duration: 3,
            ease: "sine.inOut",
          },
          "+=1"
        ); // Aquamarine (initial)

      tl.to(
        stop2Ref.current,
        { attr: { "stop-color": "#DA70D6" }, duration: 4, ease: "sine.inOut" },
        0.5
      ) // Orchid
        .to(
          stop2Ref.current,
          {
            attr: { "stop-color": "#FFD700" },
            duration: 3,
            ease: "sine.inOut",
          },
          "+=1.5"
        ) // Gold
        .to(
          stop2Ref.current,
          {
            attr: { "stop-color": "#8A2BE2" },
            duration: 4,
            ease: "sine.inOut",
          },
          "+=1"
        ); // BlueViolet (initial)

      tl.to(
        stop3Ref.current,
        {
          attr: { "stop-color": "#00FFFF" },
          duration: 3.5,
          ease: "sine.inOut",
        },
        1
      ) // Aqua
        .to(
          stop3Ref.current,
          {
            attr: { "stop-color": "#ADFF2F" },
            duration: 4.5,
            ease: "sine.inOut",
          },
          "+=1"
        ) // GreenYellow
        .to(
          stop3Ref.current,
          {
            attr: { "stop-color": "#FF00FF" },
            duration: 3,
            ease: "sine.inOut",
          },
          "+=1.5"
        ); // Fuchsia (initial)

      // Animate gradient's focal point for a swirling effect
      tl.to(
        gradientRef.current,
        { attr: { fx: "0.3", fy: "0.7" }, duration: 5, ease: "power1.inOut" },
        0
      )
        .to(gradientRef.current, {
          attr: { fx: "0.7", fy: "0.3" },
          duration: 6,
          ease: "power1.inOut",
        })
        .to(gradientRef.current, {
          attr: { fx: "0.5", fy: "0.5" },
          duration: 4,
          ease: "power1.inOut",
        }); // Back to center

      // Animate gradient radius
      tl.to(
        gradientRef.current,
        { attr: { r: "0.7" }, duration: 4, ease: "sine.inOut" },
        0.2
      ).to(gradientRef.current, {
        attr: { r: "0.4" },
        duration: 5,
        ease: "sine.inOut",
      });

      // --- Mouse Interaction Setup ---
      // Use quickTo for smooth, performant updates of gradient attributes
      fxRef.current = gsap.quickTo(gradientRef.current, "attr.fx", {
        duration: 0.6,
        ease: "power2.out",
      });
      fyRef.current = gsap.quickTo(gradientRef.current, "attr.fy", {
        duration: 0.6,
        ease: "power2.out",
      });
      gradRadiusRef.current = gsap.quickTo(gradientRef.current, "attr.r", {
        duration: 0.8,
        ease: "power3.out",
      });

      const handleMouseMove = (event) => {
        if (!svg || !fxRef.current || !fyRef.current || !gradRadiusRef.current)
          return;

        const svgRect = svg.getBoundingClientRect();
        // Calculate mouse position as a percentage of SVG dimensions (0 to 1)
        // This is important because gradient fx, fy, r are usually in this range
        let mouseXPercent = (event.clientX - svgRect.left) / svgRect.width;
        let mouseYPercent = (event.clientY - svgRect.top) / svgRect.height;

        // Clamp values to avoid unexpected behavior if mouse is outside SVG
        mouseXPercent = gsap.utils.clamp(0, 1, mouseXPercent);
        mouseYPercent = gsap.utils.clamp(0, 1, mouseYPercent);

        // Make the focal point slightly offset from the mouse for a dynamic feel
        fxRef.current(mouseXPercent * 0.8 + 0.1); // Keep fx between 0.1 and 0.9
        fyRef.current(mouseYPercent * 0.8 + 0.1); // Keep fy between 0.1 and 0.9

        // Change gradient radius based on vertical mouse position (example)
        gradRadiusRef.current(0.3 + mouseYPercent * 0.4); // Radius from 0.3 to 0.7
      };

      const handleMouseLeave = () => {
        // Reset to a neutral or slowly animating state
        if (fxRef.current && fyRef.current && gradRadiusRef.current) {
          fxRef.current(0.5);
          fyRef.current(0.5);
          gradRadiusRef.current(0.5);
          // Or let the timeline animation take over fully without resetting to static values
        }
      };

      const currentContainer = containerRef.current; // Capture for cleanup
      currentContainer.addEventListener("mousemove", handleMouseMove);
      currentContainer.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        tl.kill(); // Kill timeline animations
        if (currentContainer) {
          currentContainer.removeEventListener("mousemove", handleMouseMove);
          currentContainer.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    },
    { scope: containerRef }
  ); // Scope to the main container

  // SVG viewBox settings for a large circle that will be clipped by the container
  // The circle's center (cx, cy) and radius (r) need to be set so its top part
  // creates the desired "hill" effect when the container has overflow:hidden.
  // Let viewBox width be 100, height can be larger to accommodate the circle.
  // For a 100vw width container, if circle radius is e.g., 70vw, cx=50vw.
  // The container has a certain vh height.
  // Let SVG viewBox be something like "0 0 100 100"
  // Circle cx="50", r="70". cy will be > 100 to push most of it down.
  // Example: container height is 40vh.
  // If SVG viewBox height is 100. Circle cy="100" would put its center at the bottom edge of viewBox.
  // If circle cy="120" and r="70", its top edge (120-70=50) would be at y=50 in viewBox.
  // The .psychedelicSvg CSS will be positioned with bottom:0.
  // The container div's height controls how much of this SVG is seen.

  const svgViewBoxHeight = 100; // Arbitrary internal units for SVG height
  const circleRadius = 10; // Radius in SVG units, larger than half the viewBox width
  const circleCenterY =
    svgViewBoxHeight +
    circleRadius -
    (parseFloat(styles.circleContainer?.height || "40vh") / 100) *
      svgViewBoxHeight *
      0.7; // Adjust this carefully
  // A simpler approach for cy:
  // Make the circle's top edge align with the top of where the SVG would be if it was fully visible,
  // then the container cuts it. If svg height is 150% of container height, and circle radius is large.
  // Let's try cy = radius + (containerHeight - desiredVisibleHillHeight)
  // Simpler: position the SVG and circle so the top part of the circle is at the top of the VISIBLE container area.
  // The .psychedelicSvg has bottom:0. So its coordinate system starts from its bottom.
  // For a hill effect, we want the circle center to be below the container's bottom.
  // If SVG height is dynamic based on content, make it large.
  // Let's make SVG height very large, and position circle relative to its bottom.

  return (
    <div ref={containerRef} className={styles.circleContainer}>
      <svg
        ref={svgRef}
        className={styles.psychedelicSvg}
        viewBox="0 0 100 150" // Width 100, Height 150 (taller than wide, to allow circle to extend down)
        preserveAspectRatio="xMidYMin slice" // Slice to fill width, top part of SVG visible
      >
        <defs>
          <radialGradient
            id="psychedelicGradient"
            ref={gradientRef}
            cx="0.5"
            cy="0.5"
            r="0.5"
            fx="0.5"
            fy="0.5" // Initial center focus and radius
          >
            {/* Define initial colors for the stops */}
            <stop
              ref={stop1Ref}
              offset="0%"
              stopColor="#76EEC6"
              stopOpacity="0.8"
            />{" "}
            {/* Aquamarine */}
            <stop
              ref={stop2Ref}
              offset="50%"
              stopColor="#8A2BE2"
              stopOpacity="0.7"
            />{" "}
            {/* BlueViolet */}
            <stop
              ref={stop3Ref}
              offset="100%"
              stopColor="#FF00FF"
              stopOpacity="0.6"
            />
            {/* Fuchsia */}
          </radialGradient>
        </defs>

        {/* The circle that forms the hill */}
        {/* cx=50 (center of 100 width viewBox).
            r needs to be large enough to span the width and have a curve. e.g. r=70
            cy needs to position it so its top arc creates the hill.
            If viewBox height is 150, cy=150 means center is at bottom of SVG.
            If r=70, top of circle is 150-70 = 80.
            The container has overflow:hidden and a specific CSS height.
            The SVG has bottom:0 in the container.
        */}
        <circle
          ref={circleRef}
          className={styles.interactiveCircle}
          cx="50" // Center of the 100-width viewBox
          cy="100" // Position its center lower in the 150-height viewBox
          // (150 total height - 40 (visible hill) - some_offset_to_make_it_rounder + radius_itself)
          // Let's try cy = 150 (bottom of SVG) - desiredVisibleArcHeight + radius
          // If desiredVisibleArcHeight is e.g. 30 (out of 150 SVG height units)
          // cy = 150 - 30 + 70 = 190 (this would push it too far down)
          // Better: cy such that top of circle is where we want it.
          // If svgpreserveAspectRatio="xMidYMin slice", top of SVG is visible.
          // We want the top segment of a circle.
          // Let cy be the radius, so its top is at y=0 of SVG, then shift SVG down.
          // CSS handles the container height. SVG has bottom:0.
          // If circle r="70", and cy="80" (in a 0-150 Y scale for SVG)
          // its top would be at 80-70=10.
          // Its bottom would be at 80+70=150.
          // This seems reasonable.
          r="70" // Radius
          fill="url(#psychedelicGradient)"
        />
      </svg>
    </div>
  );
};

export default PsychedelicCircle;
