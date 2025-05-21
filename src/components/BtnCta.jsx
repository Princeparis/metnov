"use client";
import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BtnCta({ text, link, bg }) {
  const ctaRef = useRef(null);
  const tlRef = useRef();
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const bgRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      tlRef.current = gsap
        .timeline({ paused: true })
        .to(bgRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.3,
          ease: "expo4.inOut",
        })
        .to(
          iconRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.2,
            ease: "power4.out",
          },
          "-=0.2"
        );
    },
    {
      scope: [ctaRef],
      dependencies: [text, link, bg],
    }
  );

  const handleMouseEnter = contextSafe(() => {
    if (tlRef.current) {
      tlRef.current.play();
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (tlRef.current) {
      tlRef.current.reverse();
    }
  });

  return (
    <Link
      href={link}
      className="btn-cta"
      ref={ctaRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p ref={textRef}>{text}</p>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={iconRef}
      >
        <path
          d="M18 17.4526H16V3.5077L1.70215 17.968L0.297852 16.5099L14.5635 2.08168H1V0.0322266H18V17.4526Z"
          fill="#E8F9D9"
        />
      </svg>

      <div
        className="btn-cta-bg"
        style={{ backgroundColor: bg }}
        ref={bgRef}
      ></div>
    </Link>
  );
}
