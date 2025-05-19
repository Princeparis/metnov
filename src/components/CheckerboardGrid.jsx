// components/CheckerboardGrid.jsx
"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CheckerboardGrid = ({
  rows = 8,
  cols = 6,
  squareSize = 120, // Slightly smaller squares for an 8x8 can look elegant
  darkColor = "#843528", // Deepened base colors
  lightColor = "tranparent",
  highlightAccentColor = "tranparent", // A vibrant, warm gold/yellow
  waveSpeed = 2.2, // Seconds for one entire wave sequence (peak + return) for a square
  interWaveDelay = 0.8, // Seconds of pause between different wave patterns
}) => {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      if (!gridRef.current) return;
      const squares = Array.from(
        gridRef.current.querySelectorAll(".grid-square")
      );
      if (squares.length === 0) return;

      // Prepare squares: store original color and add helper classes
      squares.forEach((sq) => {
        const r = parseInt(sq.dataset.row);
        const c = parseInt(sq.dataset.col);
        const isDark = (r + c) % 2 === 0;
        sq.dataset.originalColor = isDark ? darkColor : lightColor;
        sq.style.backgroundColor = sq.dataset.originalColor; // Ensure initial color is set via style
        // sq.classList.toggle('dark-square', isDark); // Could use for more complex styling
        // sq.classList.toggle('light-square', !isDark);
      });

      let animationTimeoutId = null; // To manage the timeout for the next wave

      const playWaveAnimation = () => {
        // Randomly select a wave type for variety
        const waveTypes = [
          "diagonalTLBR",
          "diagonalBRTL",
          "rowScan",
          "columnScan",
          "centerOut",
          "edgesIn",
        ];
        const currentWaveType = gsap.utils.random(waveTypes);

        let staggerConfig = {};
        const baseStaggerAmount = waveSpeed * 0.5; // Total time for all staggers in this wave

        switch (currentWaveType) {
          case "diagonalTLBR": // Top-Left to Bottom-Right
            staggerConfig = {
              grid: [rows, cols],
              from: "start",
              each: 0.05,
              amount: baseStaggerAmount,
            };
            break;
          case "diagonalBRTL": // Bottom-Right to Top-Left
            staggerConfig = {
              grid: [rows, cols],
              from: "end",
              each: 0.05,
              amount: baseStaggerAmount,
            };
            break;
          case "rowScan":
            staggerConfig = {
              grid: [rows, cols],
              from: "start",
              axis: "y",
              each: 0.08,
              amount: baseStaggerAmount * 1.2,
            };
            break;
          case "columnScan":
            staggerConfig = {
              grid: [rows, cols],
              from: "start",
              axis: "x",
              each: 0.08,
              amount: baseStaggerAmount * 1.2,
            };
            break;
          case "centerOut":
            staggerConfig = {
              grid: [rows, cols],
              from: "center",
              each: 0.04,
              amount: baseStaggerAmount * 0.9,
            };
            break;
          case "edgesIn":
            staggerConfig = {
              grid: [rows, cols],
              from: "edges",
              each: 0.04,
              amount: baseStaggerAmount,
            };
            break;
          default:
            staggerConfig = {
              each: 0.05,
              from: "random",
              amount: baseStaggerAmount,
            };
        }

        const tl = gsap.timeline({
          onComplete: () => {
            // Schedule next wave after a delay
            if (animationTimeoutId) clearTimeout(animationTimeoutId); // Clear previous timeout if any
            animationTimeoutId = setTimeout(
              playWaveAnimation,
              interWaveDelay * 1000
            );
          },
        });

        // The animation for each square as the wave passes
        tl.to(
          squares,
          {
            keyframes: [
              {
                // State at the peak of the wave
                rotationX: (i, el) =>
                  (parseInt(el.dataset.row) % 2 === 0 ? 20 : -15) +
                  gsap.utils.random(-5, 5),
                rotationY: (i, el) =>
                  (parseInt(el.dataset.col) % 2 === 0 ? -15 : 20) +
                  gsap.utils.random(-5, 5),
                scale: 1.1,
                opacity: 0.95,
                zIndex: 1, // Bring forward
                backgroundColor: highlightAccentColor,
                duration: waveSpeed * 0.4, // Time to reach peak state
                ease: "sine.in",
              },
              {
                // Return to original state
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                opacity: 1,
                zIndex: 0,
                backgroundColor: (i, el) => el.dataset.originalColor,
                duration: waveSpeed * 0.6, // Time to return to normal
                ease: "sine.out",
              },
            ],
            stagger: staggerConfig, // Apply the chosen stagger configuration
          },
          0
        ); // Start this animation at the beginning of the timeline
      };

      // Initial call to start the animation loop
      playWaveAnimation();

      // Cleanup function for when the component unmounts
      return () => {
        if (animationTimeoutId) clearTimeout(animationTimeoutId);
        gsap.killTweensOf(squares); // Kill any active animations on the squares
      };
    },
    {
      dependencies: [
        rows,
        cols,
        squareSize,
        darkColor,
        lightColor,
        highlightAccentColor,
        waveSpeed,
        interWaveDelay,
      ],
    }
  ); // Dependencies for useGSAP

  // Render the square elements
  const renderSquares = () => {
    const squareElements = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        squareElements.push(
          <div
            key={`${r}-${c}`}
            className="grid-square"
            data-row={r}
            data-col={c}
            style={{
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              // Initial color set in useGSAP to avoid flash of unstyled content
              transformOrigin: "center center",
              willChange: "transform, opacity, background-color", // Performance hint
              backfaceVisibility: "hidden", // Helps with 3D transform rendering
            }}
          />
        );
      }
    }
    return squareElements;
  };

  const gridWidth = cols * squareSize;
  const gridHeight = rows * squareSize;

  // Outer container for perspective and overall styling
  return (
    <div
      style={{
        perspective: `${squareSize * rows * 2}px`, // Crucial for 3D effect depth
        background: "transparent", // Deeper shadow + subtle glow
        position: "absolute",
        top: 0,
        right: 0,
      }}
    >
      <div
        ref={gridRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${squareSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${squareSize}px)`,
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
          transformStyle: "preserve-3d", // Essential for 3D children
        }}
      >
        {renderSquares()}
      </div>
    </div>
  );
};

export default CheckerboardGrid;
