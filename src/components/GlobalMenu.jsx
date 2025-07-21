"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MenuLink from "@/components/MenuLink";
import AnimatedLink from "@/components/AnimatedLink";
import CloseButton from "@/components/CloseButton";
import CheckerboardGrid from "@/components/CheckerboardGrid";
import ToggleNav from "@/components/ToggleNav";

export default function GlobalMenu() {
  const navRef = useRef(null);
  const menuIconContainerRef = useRef(null);
  const menuContainerRef = useRef(null);
  const menuIconTl = useRef(null);
  const menuAnimTl = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      if (menuIconContainerRef.current) {
        menuIconTl.current = gsap
          .timeline({ paused: true })
          .to(menuIconContainerRef.current.querySelector(".t-l"), {
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            duration: 0.1,
            ease: "power4.inOut",
          })
          .to(
            menuIconContainerRef.current.querySelector(".t-r"),
            {
              top: "50%",
              right: "50%",
              x: "50%",
              y: "-50%",
              duration: 0.1,
              ease: "power4.out",
            },
            "-=0.05"
          ) // Adjusted overlap slightly, delay: -0.1 is like starting at the same time as prev ends.
          .to(
            menuIconContainerRef.current.querySelector(".b-l"),
            {
              bottom: "50%",
              left: "50%",
              x: "-50%",
              y: "50%",
              duration: 0.1,
              ease: "power4.inOut",
            },
            "-=0.05"
          )
          .to(
            menuIconContainerRef.current.querySelector(".b-r"),
            {
              bottom: "50%",
              right: "50%",
              x: "50%",
              y: "50%",
              duration: 0.1,
              ease: "power4.out",
            },
            "-=0.05"
          )
          .to(
            menuIconContainerRef.current.querySelectorAll(".menu-dots"),
            {
              scale: 2.4,
              backgroundColor: "#E13A15",
              duration: 0.2,
              stagger: 0.05,
              ease: "power4.out",
            },
            "-=0.05"
          ); // Relative position to the start of the last .to()
      } else {
        console.warn(
          "GSAP: menuIconContainerRef.current is not available for menuIconTl setup."
        );
      }

      // ---- TIMELINE FOR MAIN MENU APPEARANCE ----
      if (menuContainerRef.current) {
        // Check if the ref is populated
        menuAnimTl.current = gsap
          .timeline({ paused: true })
          .fromTo(
            menuContainerRef.current,
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" },
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              duration: 0.5,
              ease: "expo.inOut",
            }
          )
          .fromTo(
            ".m-link",
            {
              x: "-80%",
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: "power4.out",
            }
          )
          .fromTo(
            ".lower-links .a-link",
            {
              x: "-80%",
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.05,
              ease: "power4.out",
            }
          )
          .to(".r-img-cont", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.3,
            delay: -0.6,
            ease: "expo.inOut",
          });
      } else {
        console.warn(
          "GSAP: menuContainerRef.current is not available for menuAnimTl setup."
        );
      }

      // Cleanup function
      return () => {
        menuIconTl.current?.kill();
        menuAnimTl.current?.kill();
      };
    },
    {
      // scope: navRef, // You can provide a scope for all animations within this useGSAP
      dependencies: [], // Add any state/props that, if changed, should re-run this GSAP setup
    }
  );

  // 3. Event Handlers using contextSafe
  const handleMouseEnterIcon = contextSafe(() => {
    if (menuIconTl.current) {
      menuIconTl.current.play();
    }
  });

  const handleMouseLeaveIcon = contextSafe(() => {
    // Renamed for clarity
    if (menuIconTl.current) {
      menuIconTl.current.reverse();
    }
  });

  const handleMenuClick = contextSafe(() => {
    if (menuAnimTl.current) {
      if (
        menuAnimTl.current.progress() === 0 ||
        menuAnimTl.current.reversed()
      ) {
        menuAnimTl.current.play();
      } else {
        menuAnimTl.current.reverse();
      }
    }
  });

  // Handler for the CloseButton in the menu
  const handleCloseMenu = contextSafe(() => {
    if (menuAnimTl.current) {
      menuAnimTl.current.reverse();
    }
  });
  return (
    <>
      <div className="menu" ref={menuContainerRef}>
        <div className="left-wrapper">
          <div className="upper-links">
            <div className="link-container">
              <MenuLink
                href="/"
                text="Home"
                textColor={"#542922"}
                strokeColor="#FBDDD7"
                lastColor={"#FBDDD7"}
                activeColor={"#FBDDD7"}
              />
              <MenuLink
                href="#"
                text="Contact"
                textColor={"#542922"}
                strokeColor="#FBDDD7"
                lastColor={"#FBDDD7"}
                activeColor={"#FBDDD7"}
              />
              <MenuLink
                href="/journal"
                text="Journal"
                textColor={"#542922"}
                strokeColor="#FBDDD7"
                lastColor={"#FBDDD7"}
                activeColor={"#FBDDD7"}
              />
              <MenuLink
                href="#"
                text="OSP"
                textColor={"#542922"}
                strokeColor="#FBDDD7"
                lastColor={"#FBDDD7"}
                activeColor={"#FBDDD7"}
              />
            </div>
          </div>
          <div className="lower-links">
            <AnimatedLink
              textColor="rgba(238, 236, 224, 0.8)"
              text="Facebook"
              lastColor="#eeece0"
              strokeColor="#eeece0"
              href="#"
            />
            <AnimatedLink
              textColor="rgba(238, 236, 224, 0.8)"
              text="Instagram"
              lastColor="#eeece0"
              strokeColor="#eeece0"
              href="#"
            />
            <AnimatedLink
              textColor="rgba(238, 236, 224, 0.8)"
              text="Linkedin"
              lastColor="#eeece0"
              strokeColor="#eeece0"
              href="#"
            />
            <AnimatedLink
              textColor="rgba(238, 236, 224, 0.8)"
              text="Tiktok"
              lastColor="#eeece0"
              strokeColor="#eeece0"
              href="#"
            />
            <AnimatedLink
              textColor="rgba(238, 236, 224, 0.8)"
              text="X"
              lastColor="#eeece0"
              strokeColor="#eeece0"
              href="#"
            />
          </div>
        </div>
        <CloseButton text="Close" onClick={handleCloseMenu} />
        <div className="right-wrapper">
          <CheckerboardGrid />
          <div className="r-img-cont">
            <img src="hand.png" alt="grumpy 3d mascot guy" />
          </div>
        </div>
      </div>
      <nav ref={navRef}>
        <div className="nav-left">
          <h2>
            <svg
              width="115"
              height="26"
              viewBox="0 0 115 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M37.2775 6.16893C41.9964 6.16893 45.0062 9.03268 45.0062 13.8773V14.9781H32.8689C32.994 17.8419 34.4826 19.9194 37.4326 19.9194C39.9145 19.9194 41.4058 18.6916 41.9011 16.6776H45.0661C44.4755 19.6986 42.2413 22.4989 37.4925 22.4989C32.4008 22.4989 29.7012 18.8489 29.7012 14.1587C29.7012 9.09338 32.7736 6.16617 37.2748 6.16617L37.2775 6.16893ZM41.8712 12.8703C41.6861 10.1942 39.9145 8.68506 37.3074 8.68506C34.8854 8.68506 33.0866 10.1942 32.8689 12.8703H41.8712Z"
                  fill="black"
                />
                <path
                  d="M58.7873 22.1844H52.3322C50.8109 22.1844 50.0653 21.4285 50.0653 19.8862V9.28098H46.5901V6.48069H50.0653V1.72984H53.2629V6.48069H58.1668V9.28098H53.2629V19.3814H58.7873V22.1817V22.1844Z"
                  fill="black"
                />
                <path
                  d="M88.9891 6.16893C93.893 6.16893 97.3083 9.50446 97.3083 14.3188C97.3083 19.1331 93.893 22.5017 88.9891 22.5017C84.0852 22.5017 80.6399 19.1662 80.6399 14.3188C80.6399 9.47135 84.0552 6.16893 88.9891 6.16893ZM88.9891 19.6986C92.2493 19.6986 94.0808 17.3701 94.0808 14.3188C94.0808 11.2674 92.2493 8.96923 88.9891 8.96923C85.7289 8.96923 83.8375 11.2978 83.8375 14.3188C83.8375 17.3398 85.6989 19.6986 88.9891 19.6986Z"
                  fill="black"
                />
                <path
                  d="M115 6.48345L110.281 22.1872H103.608L98.8269 6.48345H102.054L106.523 21.3043H107.391L111.83 6.48345H114.995H115Z"
                  fill="black"
                />
                <path
                  d="M71.5449 6.16895C75.1453 6.16895 77.4746 8.37051 77.4746 12.9033V19.3955H79.3037V22.1846H77.4746V22.1875H74.2773V13.3447C74.2773 10.197 73.1288 8.97173 70.5518 8.97168C67.4467 8.97168 65.3047 11.2706 65.3047 15.5166V22.1875H62.1074V9.27246H60.2754V6.4834H65.3047V8.96875L64.7471 11.0469H65.6152C66.2357 8.21347 68.1922 6.16895 71.5449 6.16895Z"
                  fill="black"
                />
                <path
                  d="M13.5908 21.2715H14.4912L19.6455 0H26.2256V19.3955H28.1309V22.1846H21.1426V19.3955H22.9062V4.37305L23.4961 0.910156H22.5957L17.3193 22.1816H10.7383L5.45898 0.913086H4.55859L5.14941 4.37598V19.3955H6.98828V22.1846H5.14941V22.1875H1.8291V22.1846H0V19.3955H1.8291V0H8.43945L13.5908 21.2715Z"
                  fill="black"
                />
                <path
                  d="M88.9592 23.5059C87.6012 23.5059 86.499 24.6233 86.499 26H91.4166C91.4166 24.6233 90.3144 23.5059 88.9564 23.5059H88.9592Z"
                  fill="black"
                />
              </g>
            </svg>
          </h2>
          <ToggleNav />
        </div>
        <div
          className="menu-icon"
          onMouseEnter={handleMouseEnterIcon}
          onMouseLeave={handleMouseLeaveIcon}
          onClick={handleMenuClick}
          ref={menuIconContainerRef}
        >
          <div className="t-l menu-dots"></div>
          <div className="t-r menu-dots"></div>
          <div className="b-l menu-dots"></div>
          <div className="b-r menu-dots"></div>
        </div>
      </nav>
    </>
  );
}
