// components/InteractiveGrid.js
"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./InteractiveGrid.module.css";

gsap.registerPlugin(ScrollTrigger);

const InteractiveGrid = () => {
  const sectionRef = useRef(null);
  const gridContainerRef = useRef(null);

  console.log("DEBUG: InteractiveGrid component RENDER START");

  const baseItemSize = 25;
  const baseGap = 5;

  const [gridDimensions, setGridDimensions] = useState({
    cols: 0,
    rows: 0,
    itemSize: 0,
    gap: 0,
  });
  const [gridItems, setGridItems] = useState([]);
  console.log("DEBUG: Initial gridItems state:", gridItems);

  const calculateGrid = useCallback(() => {
    console.log("DEBUG: calculateGrid CALLED");
    if (!gridContainerRef.current) {
      console.warn(
        "DEBUG: calculateGrid - gridContainerRef.current is NULL at call time."
      );
      // Attempt to use sectionRef if gridContainerRef is somehow not ready, though it should be.
      const containerNode = gridContainerRef.current || sectionRef.current;
      if (!containerNode) {
        console.error(
          "DEBUG: calculateGrid - NEITHER gridContainerRef NOR sectionRef is available."
        );
        return;
      }
      // This part is tricky, as gridContainerRef is what has the grid display property.
      // For now, we'll stick to assuming gridContainerRef becomes available.
    }

    // Defer if dimensions are not ready
    if (
      gridContainerRef.current &&
      (gridContainerRef.current.clientWidth === 0 ||
        gridContainerRef.current.clientHeight === 0)
    ) {
      console.warn(
        "DEBUG: calculateGrid - Container dimensions are ZERO. Will retry shortly or on resize."
      );
      // Request another frame, hoping layout is complete.
      requestAnimationFrame(calculateGrid);
      return;
    }

    const containerWidth = gridContainerRef.current.clientWidth;
    const containerHeight = gridContainerRef.current.clientHeight;
    console.log(
      "DEBUG: gridContainerRef dimensions for calc:",
      containerWidth,
      "x",
      containerHeight
    );

    const scaleFactor = Math.min(1, containerWidth / 1200);
    const currentItemSize = Math.max(15, baseItemSize * scaleFactor);
    const currentGap = Math.max(3, baseGap * scaleFactor);

    const cols = Math.floor(containerWidth / (currentItemSize + currentGap));
    const rows = Math.floor(containerHeight / (currentItemSize + currentGap));

    console.log(
      "DEBUG: Calculated Grid Dims - Cols:",
      cols,
      "Rows:",
      rows,
      "ItemSize:",
      currentItemSize,
      "Gap:",
      currentGap
    );

    if (cols > 0 && rows > 0) {
      if (gridDimensions.cols !== cols || gridDimensions.rows !== rows) {
        // Only update if changed
        setGridDimensions({
          cols,
          rows,
          itemSize: currentItemSize,
          gap: currentGap,
        });
        const newItems = Array.from({ length: cols * rows }, (_, id) => ({
          id: `item-${id}`,
        }));
        console.log(
          "DEBUG: Setting newItems state with",
          newItems.length,
          "items."
        );
        setGridItems(newItems);
      }
    } else {
      console.warn("DEBUG: Calculated zero cols or rows. Clearing items.");
      if (gridItems.length > 0) {
        // Only update if changed
        setGridDimensions({
          cols: 0,
          rows: 0,
          itemSize: currentItemSize,
          gap: currentGap,
        });
        setGridItems([]);
      }
    }
  }, [
    baseItemSize,
    baseGap,
    gridDimensions.cols,
    gridDimensions.rows,
    gridItems.length,
  ]); // Added dependencies

  useEffect(() => {
    console.log("DEBUG: useEffect for calculateGrid MOUNT/RESIZE setup");
    // calculateGrid might be called multiple times due to rAF, let's ensure it's stable
    // The main trigger for calculateGrid should be when the component mounts and when it resizes.
    // The rAF in calculateGrid itself is a self-retry if dimensions are 0.

    // Call it once after mount to ensure dimensions are likely available
    const initTimeout = setTimeout(() => {
      if (gridContainerRef.current) {
        // Ensure ref is available
        calculateGrid();
      } else {
        console.warn(
          "DEBUG: gridContainerRef not available for initial calculateGrid in useEffect timeout"
        );
      }
    }, 100); // Increased delay for layout to be absolutely sure

    window.addEventListener("resize", calculateGrid);
    return () => {
      console.log("DEBUG: useEffect for calculateGrid CLEANUP");
      clearTimeout(initTimeout);
      window.removeEventListener("resize", calculateGrid);
    };
  }, [calculateGrid]); // calculateGrid is memoized

  useGSAP(
    () => {
      console.log(
        "DEBUG: useGSAP CALLBACK START. Current gridItems.length:",
        gridItems.length
      );

      if (!sectionRef.current || !gridContainerRef.current) {
        console.error(
          "DEBUG ERROR: sectionRef or gridContainerRef is NULL in useGSAP!"
        );
        return;
      }

      // Get items rendered by React. These should have the initial styles from the CSS module.
      const items = gsap.utils.toArray(gridContainerRef.current.children);
      console.log(`DEBUG: CSS Module class for gridItem: '${styles.gridItem}'`);
      console.log(
        "DEBUG: GSAP found items via toArray(children):",
        items.length
      );

      if (items.length === 0) {
        // This is okay if gridItems is also empty and calculateGrid hasn't populated it yet.
        // The dependency array on useGSAP ([gridItems]) will re-run this when items are ready.
        console.warn(
          "DEBUG: useGSAP - No items found in gridContainerRef.current.children. Waiting for gridItems update."
        );
        return;
      }
      console.log(
        "DEBUG: useGSAP - Items found. Proceeding with animation setup."
      );

      // Force section to be visible for debugging GSAP animations
      gsap.set(sectionRef.current, {
        opacity: 1,
        visibility: "visible",
        border: "2px dashed red",
      });

      // --- Test basic animation on items found ---
      // The items should ALREADY have opacity: 0 and scale: 0.5 from the CSS module.
      // So we just need a .to() animation.
      const entranceTl = gsap.timeline({
        // Temporarily remove ScrollTrigger to test on-load animation
        delay: 0.5, // Delay to see the initial state if any
        onStart: () => console.log("DEBUG: Entrance timeline STARTING"),
        onComplete: () =>
          console.log(
            "DEBUG: Entrance timeline COMPLETE. Items should be visible."
          ),
      });

      entranceTl.to(items, {
        opacity: 1,
        scale: 1,
        y: 0, // Ensure y is reset if it was part of a 'from' state
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: { each: 0.02, from: "center", grid: "auto" },
      });

      console.log("DEBUG: GSAP animation setup complete in useGSAP.");
    },
    { scope: sectionRef, dependencies: [gridItems] }
  ); // Re-run when gridItems changes

  console.log(
    "DEBUG: InteractiveGrid component RENDER END. gridItems to render:",
    gridItems.length
  );

  return (
    <section ref={sectionRef} className={styles.gridSection}>
      {" "}
      {/* No inline border here, CSS will handle if needed */}
      <div
        ref={gridContainerRef}
        className={styles.gridContainer}
        style={{
          gridTemplateColumns: `repeat(${gridDimensions.cols || 0}, ${
            gridDimensions.itemSize || 0
          }px)`, // Default to 0 if not calculated
          gridTemplateRows: `repeat(${gridDimensions.rows || 0}, ${
            gridDimensions.itemSize || 0
          }px)`,
          gap: `${gridDimensions.gap || 0}px`,
          border: "2px dashed blue", // DEBUG: See grid container bounds
        }}
      >
        {gridItems.map((item) => (
          <div key={item.id} className={styles.gridItem} /> // NO INLINE STYLES HERE - rely on CSS module
        ))}
      </div>
    </section>
  );
};

export default InteractiveGrid;
