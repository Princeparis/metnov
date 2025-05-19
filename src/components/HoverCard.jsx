import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function HoverCard({ title, content, img, alt, classes }) {
  const brandAnimTl = useRef(null);
  const brandRef = useRef(null);
  const lineRef = useRef([]);
  const pRef = useRef(null);
  const contentRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      lineRef.current = [];
      let split = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line++",
      });
      lineRef.current.push(...split.lines);
      if (brandRef.current) {
        brandAnimTl.current = gsap
          .timeline({ paused: true })
          .to(contentRef.current, {
            y: 0,
            duration: 0.4,
            ease: "power4.out",
          })
          .from(
            lineRef.current,
            {
              y: "100%",
              opacity: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power4.out",
            },
            "-=0.2"
          );
      } else {
        console.warn(
          "GSAP: menuContainerRef.current is not available for menuAnimTl setup."
        );
      }

      return () => {
        brandAnimTl.current?.kill();
      };
    },
    {
      dependencies: [content],
    }
  );

  const handleMouseEnter = contextSafe(() => {
    if (brandAnimTl.current) {
      brandAnimTl.current.play();
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (brandAnimTl.current) {
      brandAnimTl.current.reverse();
    }
  });
  return (
    <div
      className={`brand ${classes}`}
      ref={brandRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3 className="brand-title">{title}</h3>
      <img src={img} alt={alt} />
      <div className="brand-content" ref={contentRef}>
        <p ref={pRef}>{content}</p>
      </div>
    </div>
  );
}
