import React from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

export default function TeamCard({ data }) {
  const containerRef = useRef();
  const gradRef = useRef();
  const hoverAnime = useRef(null);
  const pathRef = useRef(null);
  const lineRef = useRef([]);
  const pRef = useRef(null);
  const { contextSafe } = useGSAP(
    () => {
      lineRef.current = [];
      let split = new SplitText(pRef.current, {
        type: "lines",
        mask: "lines",
        linesClass: "line++",
      });
      lineRef.current.push(...split.lines);
      if (pathRef.current) {
        gsap.set(pathRef.current, {
          drawSVG: "0%",
        });
      }
      if (containerRef.current) {
        hoverAnime.current = gsap
          .timeline({ paused: true })
          .to(".anime", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.4,
            ease: "expo4.out",
          })
          .to(
            ".p-footer",
            {
              y: 0,
              duration: 0.4,
              ease: "power4.out",
            },
            "-=0.2"
          )
          .to(".p-interact", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.3,
            delay: -0.4,
            ease: "expo4.out",
          })
          .to(
            pathRef.current,
            {
              drawSVG: "100%",
              duration: 0.5,
              ease: "expo4.out",
            },
            "-=0.3"
          )
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
        hoverAnime.current?.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [data.description, data.anime],
    }
  );
  useGSAP(
    () => {
      const animationProps = {
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        delay: id * 0.2,
      };
      gsap.fromTo(
        ".grad-overlay",
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        },
        {
          ...animationProps,
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 10%",
            end: `+=${containerRef.current.offsetHeight + 50}`,
            toggleActions: "play reset play none",
            markers: false,
          },
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [],
    }
  );
  const { id, name, description, image, link, alt, role, anime } = data;

  const gradients = [
    "linear-gradient(-135deg, var(--as3), var(--as9))",
    "linear-gradient(-135deg, var(--ap3), var(--ap9))",
    "linear-gradient(-135deg, var(--bl1), var(--bl6))",
  ];

  const handleMouseEnter = contextSafe(() => {
    if (hoverAnime.current) {
      hoverAnime.current.play();
    }
  });

  const handleMouseLeave = contextSafe(() => {
    if (hoverAnime.current) {
      hoverAnime.current.reverse();
    }
  });
  return (
    <div
      className="p-container"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="grad-overlay"
        style={{ background: gradients[id - 1] }}
        ref={gradRef}
      ></div>
      <div className="anime">
        <img src={anime} alt={alt} />
      </div>
      <div className="img">
        <img src={image} alt={alt} />
      </div>
      <div className="p-footer">
        <div className="p-texts">
          <div className="name-wrapper">
            <h4>{name}</h4>
            <h6>{role}</h6>
          </div>

          <p ref={pRef}>{description}</p>
        </div>
        <div className="p-interact">
          <a href={link} className="p-link">
            <svg
              width="54"
              height="54"
              viewBox="0 0 204 205"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                ref={pathRef}
                d="M2 2H202M202 2C202 2 202 232.038 202 202.356M202 2L2 202.356"
                stroke="#FDE9E4"
                strokeWidth="10"
                strokeLinecap="round"
                className="arrow-line"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
