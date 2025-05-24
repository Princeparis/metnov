import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AnimatedLink from "./AnimatedLink";
import { contain } from "three/src/extras/TextureUtils";

export default function ToggleNav() {
  const container = useRef();
  const { contextSafe } = useGSAP({
    scope: container,
  });
  const handleClick = contextSafe(() => {
    gsap.set(".a-link", {
      pointerEvents: "none",
      y: "-200%",
    });
    container.current.classList.toggle("active");
    const tl = gsap.timeline();
    if (container.current.classList.contains("active")) {
      tl.to(".toggle-button", {
        rotate: "45deg",
        duration: 0.2,
        delay: -0.5,
        ease: "power4.out",
      })
        .to(".nav-links", {
          width: "fit-content",
          scaleX: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power4.out",
        })
        .fromTo(
          ".a-link",
          {
            y: "-200%",
            opacity: 0,
            pointerEvents: "none",
          },
          {
            opacity: 1,
            pointerEvents: "all",
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power4.out",
          }
        );
    } else {
      const tl = gsap.timeline();
      tl.to(".a-link", {
        pointerEvents: "none",
        y: "200%",
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power4.out",
      })
        .to(".nav-links", {
          width: 0,
          scaleX: 0,
          duration: 0.2,
          ease: "power4.out",
        })
        .to(".toggle-button", {
          rotate: "0deg",
          duration: 0.2,
          ease: "power4.out",
        });
    }
  });
  return (
    <div ref={container} className="nav-toggle">
      <button className="toggle-button" onClick={handleClick}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 9H20V11H11V20H9V11H0V9H9V0H11V9Z" fill="#141413" />
        </svg>
      </button>
      <div className="nav-links">
        <AnimatedLink href="#about" text="About" />
        <AnimatedLink href="#investors" text="Investors" />
        <AnimatedLink href="#projects" text="Projects" />
        <AnimatedLink href="#contact" text="Talk to us" />
        <AnimatedLink href="#nerds" text="Team" />
      </div>
    </div>
  );
}
