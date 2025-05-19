// components/InteractiveDotsGrid.js
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin"; // Import InertiaPlugin
import styles from "./InteractiveDotsGrid.module.css"; // Import CSS Modules

// Register GSAP plugins
gsap.registerPlugin(InertiaPlugin);

const InteractiveDotsGrid = () => {
  const sectionRef = useRef(null);
  const dotsContainerRef = useRef(null);
  // To store dot elements and their centers, not as state because GSAP manipulates them directly
  const dotElementsRef = useRef([]);
  const dotCentersRef = useRef([]);

  // Store last mouse move data using refs to avoid re-renders
  const lastMouseTimeRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const lastMouseYRef = useRef(0);

  useEffect(() => {
    const container = dotsContainerRef.current;
    if (!container) return;

    const colors = { base: "#2C3878", active: "#C0C6E8" };
    const threshold = 150;
    const speedThreshold = 100;
    // const shockRadius = 250; // Not used in provided JS, but was in comment
    // const shockPower = 5;    // Not used in provided JS
    const maxSpeed = 5000;
    const centerHole = true; // Configuration for the hole in the middle

    const buildGrid = () => {
      if (!container) return;
      container.innerHTML = ""; // Clear previous dots
      dotElementsRef.current = [];
      dotCentersRef.current = [];

      // Ensure container is laid out to get correct computed styles and dimensions
      requestAnimationFrame(() => {
        if (!container) return;
        const style = window.getComputedStyle(container);
        // Use parent's font-size if dotsContainer itself doesn't have one set by 'em' units
        const baseFontSizeElement = container.parentElement || container;
        const parentStyle = window.getComputedStyle(baseFontSizeElement);

        // 'em' units for dot size and gap are relative to the font-size of the container
        // If 'font-size: 1vw' is on .sectionResource, 1em for .dot means 1vw.
        const dotPx = parseFloat(parentStyle.fontSize); // This should resolve to the 1vw value in pixels
        const gapPx = dotPx * 2; // 2em gap

        const contW = container.clientWidth;
        const contH = container.clientHeight;

        if (dotPx === 0 || contW === 0 || contH === 0) {
          console.warn("Dots grid: Dimensions not ready or dot size is zero.", {
            dotPx,
            contW,
            contH,
          });
          return; // Avoid division by zero or incorrect layout
        }

        const cols = Math.floor((contW + gapPx) / (dotPx + gapPx));
        const rows = Math.floor((contH + gapPx) / (dotPx + gapPx));
        const total = cols * rows;

        const holeCols = centerHole ? (cols % 2 === 0 ? 4 : 5) : 0;
        const holeRows = centerHole ? (rows % 2 === 0 ? 4 : 5) : 0;
        const startCol = Math.floor((cols - holeCols) / 2); // Ensure integer for start
        const startRow = Math.floor((rows - holeRows) / 2); // Ensure integer for start

        for (let i = 0; i < total; i++) {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const isHole =
            centerHole &&
            row >= startRow &&
            row < startRow + holeRows &&
            col >= startCol &&
            col < startCol + holeCols;

          const d = document.createElement("div");
          d.className = styles.dot; // Use CSS Module class

          if (isHole) {
            d.style.visibility = "hidden";
            d._isHole = true;
          } else {
            gsap.set(d, { x: 0, y: 0, backgroundColor: colors.base });
            d._inertiaApplied = false;
          }
          container.appendChild(d);
          dotElementsRef.current.push(d);
        }

        // Calculate dot centers after they are appended and rendered
        requestAnimationFrame(() => {
          dotCentersRef.current = dotElementsRef.current
            .filter((d) => !d._isHole)
            .map((d) => {
              const r = d.getBoundingClientRect();
              return {
                el: d,
                x: r.left + window.scrollX + r.width / 2,
                y: r.top + window.scrollY + r.height / 2,
              };
            });
        });
      });
    };

    buildGrid(); // Initial build
    window.addEventListener("resize", buildGrid);

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = now - lastMouseTimeRef.current || 16; // Ensure dt is not 0
      let dx = e.pageX - lastMouseXRef.current;
      let dy = e.pageY - lastMouseYRef.current;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      lastMouseTimeRef.current = now;
      lastMouseXRef.current = e.pageX;
      lastMouseYRef.current = e.pageY;

      requestAnimationFrame(() => {
        // Debounce with rAF
        dotCentersRef.current.forEach(({ el, x, y }) => {
          if (el._isHole) return;
          const dist = Math.hypot(x - e.pageX, y - e.pageY);
          const t = Math.max(0, 1 - dist / threshold);
          const col = gsap.utils.interpolate(colors.base, colors.active, t);
          gsap.set(el, { backgroundColor: col });

          if (
            speed > speedThreshold &&
            dist < threshold &&
            !el._inertiaApplied
          ) {
            el._inertiaApplied = true;
            const pushX = x - e.pageX + vx * 0.005; // Adjusted push factor a bit
            const pushY = y - e.pageY + vy * 0.005;

            gsap.to(el, {
              inertia: { x: pushX, y: pushY, resistance: 750 },
              duration: 0.5, // Give inertia a bit of time
              onComplete() {
                gsap.to(el, {
                  x: 0,
                  y: 0,
                  duration: 1.5,
                  ease: "elastic.out(1,0.75)",
                });
                el._inertiaApplied = false;
              },
            });
          }
        });
      });
    };

    // The original code for click was not present in the provided JS.
    // If you want to add it back:
    /*
    const handleClick = (e) => {
      const shockRadius = 250; // Define these if you use them
      const shockPower = 5;
      dotCentersRef.current.forEach(({ el, x, y }) => {
        if (el._isHole) return;
        const dist = Math.hypot(x - e.pageX, y - e.pageY);
        if (dist < shockRadius && !el._inertiaApplied) {
          el._inertiaApplied = true;
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX   = (x - e.pageX) * shockPower * falloff;
          const pushY   = (y - e.pageY) * shockPower * falloff;

          gsap.to(el, {
            inertia: { x: pushX, y: pushY, resistance: 750 },
            duration: 0.5,
            onComplete() {
              gsap.to(el, {
                x: 0,
                y: 0,
                duration: 1.5,
                ease: "elastic.out(1,0.75)"
              });
              el._inertiaApplied = false;
            }
          });
        }
      });
    };
    window.addEventListener("click", handleClick);
    */

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("click", handleClick); // If click is added
      if (container) {
        container.innerHTML = ""; // Clear dots on unmount
      }
      // Potentially kill GSAP animations if needed, though GSAP is good at self-management
      // dotElementsRef.current.forEach(dot => gsap.killTweensOf(dot));
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return (
    <>
      <section ref={sectionRef} className={styles.sectionResource}>
        <div className={styles.dotsWrap}>
          <div
            ref={dotsContainerRef}
            className={styles.dotsContainer}
            data-dots-container-init=""
          >
            {/* Dots will be dynamically inserted here by the useEffect hook */}
          </div>
        </div>
      </section>
    </>
  );
};

export default InteractiveDotsGrid;
