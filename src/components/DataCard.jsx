"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function DataCard({
  title,
  description,
  data,
  iconSize,
  children,
}) {
  const containerRef = useRef(null);
  const bodyRef = useRef(null);
  const btnRef = useRef(null);
  const lineRef = useRef([]);
  const paraRef = useRef(null);
  const tl = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { contextSafe } = useGSAP(
    () => {
      lineRef.current = [];
      let split = new SplitText(paraRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line++",
      });
      lineRef.current.push(...split.lines);
      gsap.set(bodyRef.current, {
        height: "auto",
        display: "flex",
        overflow: "hidden",
      });
      tl.current = gsap
        .timeline({ paused: true })
        .to(btnRef.current, {
          rotate: 45,
          duration: 0.4,
          ease: "expo.inOut",
        })
        .from(bodyRef.current, {
          height: 0,
          display: "none",
          duration: 0.4,
          ease: "expo.inOut",
        })
        .from(lineRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "expo4.out",
        });

      return () => {
        tl.current?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [title, description],
    }
  );

  const handleClick = contextSafe(() => {
    setIsOpen(!isOpen);
    if (isOpen) {
      tl.current.reverse();
    }

    if (!isOpen) {
      tl.current.play();
    }
  });
  return (
    <div className="data-card" ref={containerRef}>
      <div className="header">
        <div className="data-number">
          <h6>{title}</h6>
          <h4>{data}</h4>
        </div>
        <button className="icon-cont" ref={btnRef} onClick={handleClick}>
          <svg
            width={iconSize ? iconSize : "32"}
            height={iconSize ? iconSize : "32"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V11H6C5.44771 11 5 11.4477 5 12C5 12.5523 5.44771 13 6 13H11V18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18V13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H13V6Z"
              fill="#DFE2F3"
            />
          </svg>
        </button>
      </div>
      <div className="body" ref={bodyRef}>
        <p className="content" ref={paraRef}>
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}
