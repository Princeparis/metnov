import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(SplitText, ScrollTrigger);

import styles from "./MenuLink.module.css";

export default function MenuLink({
  href,
  text,
  containerStyle,
  activeColor,
  strokeColor = "#e13a15",
  lastColor,
  textColor,
  animateOnScroll = false,
  delay = 0,
  //   pathname,
}) {
  const animeLinkRef = useRef(null);
  const { contextSafe } = useGSAP({
    scope: animeLinkRef,
    revertOnUpdate: true,
  });
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleMouseOver = contextSafe(() => {
    const tl = gsap.timeline();
    tl.to(".strip", {
      y: "-78%",
      duration: 0.5,
      ease: "power4.in",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    const outTl = gsap.timeline();
    outTl.to(".strip", {
      y: "0%",
      duration: 0.5,
      ease: "power4.out",
    });
  });

  return (
    <a
      href={href}
      className={`${styles.animatedMenuLink} m-link`}
      style={{ containerStyle }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      ref={animeLinkRef}
    >
      <div className={styles.textsCon}>
        <div className={`${styles.textStrip} strip`}>
          <p
            className={`${styles.paragraph} link-text`}
            style={{ color: `${isActive ? activeColor : textColor}` }}
          >
            {text}
          </p>
          <p
            className={`${styles.paragraph} link-text`}
            style={{ color: `${isActive ? activeColor : textColor}` }}
          >
            {text}
          </p>
          <p
            className={`${styles.paragraph} link-text`}
            style={{ color: `${isActive ? activeColor : textColor}` }}
          >
            {text}
          </p>
          <p
            className={`${styles.paragraph} link-text`}
            style={{ color: `${isActive ? activeColor : lastColor}` }}
          >
            {text}
          </p>
          <p
            className={`${styles.paragraph} link-text`}
            style={{ color: `${isActive ? activeColor : lastColor}` }}
          >
            {text}
          </p>
        </div>
      </div>
    </a>
  );
}
