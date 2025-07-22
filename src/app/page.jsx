"use client";
import Copy from "@/components/Copy";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Intercom from "@intercom/messenger-js-sdk";
import AnimatedLink from "@/components/AnimatedLink";
import ToggleNav from "@/components/ToggleNav";
import MenuLink from "@/components/MenuLink";
import HoverCard from "@/components/HoverCard";
import { useEffect, useRef, useState } from "react"; // useEffect might not be needed if all GSAP is in useGSAP
import CheckerboardGrid from "@/components/CheckerboardGrid";
import CloseButton from "@/components/CloseButton";
import TeamCard from "@/components/TeamCard";
import DataCard from "@/components/DataCard";
import Footer from "@/components/Footer";

import data from "@/utils/teamData";
import BtnCta from "@/components/BtnCta";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Home() {
  // 1. Refs Initialization: All refs should be initialized with null.
  const navRef = useRef(null);
  const menuIconContainerRef = useRef(null);
  const menuContainerRef = useRef(null);
  const menuIconTl = useRef(null);
  const menuAnimTl = useRef(null);
  const brandContainerRef = useRef(null);
  const loaderContRef = useRef(null);
  const progressContRef = useRef(null);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const loaderTl = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // setIsLoading(false); // Loader's onLoadingComplete will handle this if used directly
    }, 6000); // Estimated time for loader animation + a bit more
    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      if (
        !loaderContRef.current ||
        !progressContRef.current ||
        !progressRef.current ||
        !counterRef.current
      ) {
        console.error;
        return;
      }
      if (isLoading) {
        loaderTl.current = gsap
          .timeline()
          .fromTo(
            progressRef.current,
            {
              width: "0%",
              opacity: 0,
            },
            {
              width: "20%",
              opacity: 1,
              duration: 0.4,
              ease: "expo4.out",
            }
          )
          .set(
            counterRef.current,
            {
              textContent: "20%",
              duration: 0.3,
              ease: "expo4.out",
            },
            "-=0.4"
          )
          .to(".logo-path", {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "power4.in",
          })
          .fromTo(
            progressRef.current,
            {
              width: "20%",
            },
            {
              width: "40%",
              duration: 0.4,
              ease: "expo4.out",
            },
            "-=0.5"
          )
          .set(
            counterRef.current,
            {
              textContent: "40%",
              duration: 0.3,
              ease: "expo4.out",
            },
            "-=0.4"
          )
          .fromTo(
            progressRef.current,
            {
              width: "40%",
            },
            {
              width: "60%",
              duration: 0.4,
              ease: "expo4.out",
            }
          )
          .set(
            counterRef.current,
            {
              textContent: "60%",
              duration: 0.3,
              ease: "expo4.out",
            },
            "-=0.4"
          )
          .fromTo(
            progressRef.current,
            {
              width: "60%",
            },
            {
              width: "80%",
              duration: 0.4,
              ease: "expo4.out",
            }
          )
          .set(
            counterRef.current,
            {
              textContent: "80%",
              duration: 0.3,
              ease: "expo4.out",
            },
            "-=0.4"
          )
          .fromTo(
            progressRef.current,
            {
              width: "80%",
            },
            {
              width: "100%",
              duration: 0.4,
              ease: "expo4.out",
            }
          )
          .set(
            counterRef.current,
            {
              textContent: "100%",
              duration: 0.4,
              ease: "expo4.out",
            },
            "-=0.4"
          )
          .to(counterRef.current, {
            x: "60px",
            opacity: 0,
            duration: 0.3,
            ease: "expo4.out",
          })
          .to(progressContRef.current, {
            height: "100svh",
            duration: 0.5,
            ease: "expo4.out",
          })
          .to(
            ".logo-path",
            {
              fill: "var(--off-white)",
              duration: 0.3,
              stagger: 0.05,
            },
            "-=0.4"
          )
          .to(loaderContRef.current, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.5,
            delay: 0.3,
            ease: "expo4.inOut",
            onComplete: () => {
              setIsLoading(false);
            },
          });
      } else if (!isLoading) {
        return;
      }
    },
    {
      dependencies: [isLoading],
    }
  );

  const handleLoadingComplete = () => {
    console.log("Loader finished!");
    setIsLoading(false);
  };

  Intercom({
    app_id: "nmh84ne2",
  });

  // The rest of your component (return statement with JSX) follows...
  return (
    <>
      <div className="loader" ref={loaderContRef}>
        <div className="progress-cont" ref={progressContRef}>
          <div className="progress" ref={progressRef}>
            <p className="counter" ref={counterRef}>
              0%
            </p>
          </div>
        </div>
        <div className="logo">
          <svg
            width="115"
            height="26"
            viewBox="0 0 115 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M13.5908 21.2715H14.4912L19.6455 0H26.2256V19.3955H28.1309V22.1846H21.1426V19.3955H22.9062V4.37305L23.4961 0.910156H22.5957L17.3193 22.1816H10.7383L5.45898 0.913086H4.55859L5.14941 4.37598V19.3955H6.98828V22.1846H5.14941V22.1875H1.8291V22.1846H0V19.3955H1.8291V0H8.43945L13.5908 21.2715Z"
                fill="black"
                className="logo-path logo-m"
              />
              <path
                d="M37.2775 6.16893C41.9964 6.16893 45.0062 9.03268 45.0062 13.8773V14.9781H32.8689C32.994 17.8419 34.4826 19.9194 37.4326 19.9194C39.9145 19.9194 41.4058 18.6916 41.9011 16.6776H45.0661C44.4755 19.6986 42.2413 22.4989 37.4925 22.4989C32.4008 22.4989 29.7012 18.8489 29.7012 14.1587C29.7012 9.09338 32.7736 6.16617 37.2748 6.16617L37.2775 6.16893ZM41.8712 12.8703C41.6861 10.1942 39.9145 8.68506 37.3074 8.68506C34.8854 8.68506 33.0866 10.1942 32.8689 12.8703H41.8712Z"
                fill="black"
                className="logo-path logo-e"
              />
              <path
                d="M58.7873 22.1844H52.3322C50.8109 22.1844 50.0653 21.4285 50.0653 19.8862V9.28098H46.5901V6.48069H50.0653V1.72984H53.2629V6.48069H58.1668V9.28098H53.2629V19.3814H58.7873V22.1817V22.1844Z"
                fill="black"
                className="logo-path logo-t"
              />
              <path
                d="M71.5449 6.16895C75.1453 6.16895 77.4746 8.37051 77.4746 12.9033V19.3955H79.3037V22.1846H77.4746V22.1875H74.2773V13.3447C74.2773 10.197 73.1288 8.97173 70.5518 8.97168C67.4467 8.97168 65.3047 11.2706 65.3047 15.5166V22.1875H62.1074V9.27246H60.2754V6.4834H65.3047V8.96875L64.7471 11.0469H65.6152C66.2357 8.21347 68.1922 6.16895 71.5449 6.16895Z"
                fill="black"
                className="logo-path logo-n"
              />
              <path
                d="M88.9891 6.16893C93.893 6.16893 97.3083 9.50446 97.3083 14.3188C97.3083 19.1331 93.893 22.5017 88.9891 22.5017C84.0852 22.5017 80.6399 19.1662 80.6399 14.3188C80.6399 9.47135 84.0552 6.16893 88.9891 6.16893ZM88.9891 19.6986C92.2493 19.6986 94.0808 17.3701 94.0808 14.3188C94.0808 11.2674 92.2493 8.96923 88.9891 8.96923C85.7289 8.96923 83.8375 11.2978 83.8375 14.3188C83.8375 17.3398 85.6989 19.6986 88.9891 19.6986Z"
                fill="black"
                className="logo-path path-o"
              />
              <path
                d="M115 6.48345L110.281 22.1872H103.608L98.8269 6.48345H102.054L106.523 21.3043H107.391L111.83 6.48345H114.995H115Z"
                fill="black"
                className="logo-path logo-v"
              />

              <path
                d="M88.9592 23.5059C87.6012 23.5059 86.499 24.6233 86.499 26H91.4166C91.4166 24.6233 90.3144 23.5059 88.9564 23.5059H88.9592Z"
                fill="black"
                className="logo-path logo-accent"
              />
            </g>
          </svg>
        </div>
      </div>
      <main>
        <section className="hero">
          <div className="hero-img">
            <img src={"hero.jpg"} alt={"Image of life in ocean"} />
          </div>
          <div className="hero-text">
            <h1>
              <span>
                Infinite/
                <br />
              </span>
              <span className="indented">Innovation*</span>
            </h1>
          </div>
        </section>
        <section className="about" id="about">
          <div className="about-text">
            <h2>About</h2>
            <Copy>
              <p>
                We are a team of experienced innovators and technical idealist
                committed to redefining technological solutions. We design and
                build forward-thinking digital solutions that drive economic
                growth, expand access to essential services, and empower
                individuals globally.
              </p>
            </Copy>
          </div>
          <div className="brand-container" ref={brandContainerRef}>
            <HoverCard
              title={"Mission"}
              content="Our mission is to impact our world by integrating advanced AI into innovative technology solutions. We are committed to reimagining what technology can do, innovate boldly, create intelligent tools that drive progress, solve real-world challenges, and improve lives for people everywhere."
              img={"mission.webp"}
              alt={
                "Avatar of a boy pressing phone, as he receives money from his friend"
              }
              classes={"mission"}
            />
            <HoverCard
              title={"Vision"}
              content="Our vision is to lead the way in creating AI technologies that make life better for people everywhere. We aim to develop intelligent solutions that solve real problems, open up new opportunities, and create lasting benefits for communities around the world."
              img={"vision.webp"}
              alt={"Avatar of a boy holding a binocular"}
              classes={"vision"}
            />
            <div className="brand brochure">
              <Copy>
                <h4>
                  Download our business brochure to get more information about
                  our business.
                </h4>
              </Copy>
              <div>
                <a href="brochure.pdf" download className="download-link">
                  <svg
                    width="204"
                    height="205"
                    viewBox="0 0 204 205"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2H202M202 2C202 2 202 232.038 202 202.356M202 2L2 202.356"
                      stroke="#5C4F4D"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="projects" id="projects">
          <div className="stripe">
            <div className="film film-1">
              <div className="img">
                <img src="pivotablue-new.webp" alt="pivota screen mock" />
              </div>
              <div className="p-content">
                <h2>Pivota</h2>
                <Copy>
                  <p>
                    Pivota is a next-generation social commerce platform
                    designed to connect communities and unlock new opportunities
                    through smart technology.
                  </p>
                </Copy>
              </div>
            </div>
          </div>
        </section>
        <section className="nerds" id="nerds">
          <div className="nerds-content">
            <h2>Nerds</h2>
            <Copy>
              <p>
                These are the minds that brought the vision to life, we work
                innovatively to serve as many people as we can in the regions of
                the world where we are operational.
              </p>
            </Copy>
          </div>
          <div className="profiles">
            {data.map((person) => {
              return (
                <TeamCard data={person} key={person.id} target={"_blank"} />
              );
            })}
          </div>
        </section>
        <section className="investors" id="investors">
          <div className="data-cards">
            <DataCard
              title={"Initial Market Cap"}
              description="Africa’s stock markets collectively represent a capital pool
                    of over $1.3 trillion, reflecting the continent’s growing
                    economic influence and investment potential."
              data={"$1.3T"}
            />
            <DataCard
              title={"Market Size"}
              description="Africa’s total addressable market for digital
                    services-including commerce, payments, and
                    communication-exceeds $2 trillion, indicating the
                    continent’s vast and rapidly growing digital economy."
              data={"1.56b"}
            />
            <DataCard
              title={"Accessible Market %"}
              description="With digital adoption accelerating, roughly 38% of Africa’s
                    market is already accessible to innovative solutions, and
                    this share is expanding every year."
              data={"38%"}
            />
          </div>
          <div className="light-container">
            <svg
              width="982"
              height="982"
              viewBox="0 0 982 982"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="light orbs" clipPath="url(#clip0_491_17)">
                <path
                  id="half orb 2"
                  d="M491 491C219.831 491 0 710.831 0 982H982C982 710.831 762.169 491 491 491Z"
                  fill="url(#paint0_radial_491_17)"
                />
                <path
                  id="half orb 1"
                  d="M491 491C762.169 491 982 271.169 982 0H0C0 271.169 219.831 491 491 491Z"
                  fill="url(#paint1_radial_491_17)"
                />
                <path
                  id="orb small 2"
                  d="M883.8 589.2C938.034 589.2 982 545.234 982 491C982 436.766 938.034 392.8 883.8 392.8C829.565 392.8 785.6 436.766 785.6 491C785.6 545.234 829.565 589.2 883.8 589.2Z"
                  fill="url(#paint2_radial_491_17)"
                />
                <path
                  id="orb small 1"
                  d="M98.2 589.2C152.434 589.2 196.4 545.234 196.4 491C196.4 436.766 152.434 392.8 98.2 392.8C43.9656 392.8 0 436.766 0 491C0 545.234 43.9656 589.2 98.2 589.2Z"
                  fill="url(#paint3_radial_491_17)"
                />
              </g>
              <defs>
                <radialGradient
                  id="paint0_radial_491_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(498.542 678.218) scale(1104.46)"
                >
                  <stop stopColor="#DFE2F3" stopOpacity="0" />
                  <stop offset="1" stopColor="#DFE2F3" />
                </radialGradient>
                <radialGradient
                  id="paint1_radial_491_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(491 245.5) scale(1311.82)"
                >
                  <stop stopColor="#DFE2F3" stopOpacity="0" />
                  <stop offset="1" stopColor="#DFE2F3" />
                </radialGradient>
                <radialGradient
                  id="paint2_radial_491_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(883.8 491) scale(255.477)"
                >
                  <stop stopColor="#DFE2F3" stopOpacity="0" />
                  <stop offset="1" stopColor="#DFE2F3" />
                </radialGradient>
                <radialGradient
                  id="paint3_radial_491_17"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(98.2 491) scale(403.749)"
                >
                  <stop stopColor="#DFE2F3" stopOpacity="0" />
                  <stop offset="1" stopColor="#DFE2F3" />
                </radialGradient>
                <clipPath id="clip0_491_17">
                  <rect width="982" height="982" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="investor-note">
            <h2 className="investor-title">Investors</h2>
            <Copy>
              <p>
                We are currently at the pre-seed stage and welcome investors who
                share our vision and ambition. By partnering with us, you can
                play a key role in accelerating our growth and shaping the
                future of digital innovation in Africa. If our journey resonates
                with you, we invite you to review our investment proposal and
                connect with our team.
              </p>
            </Copy>
          </div>
        </section>
        <section className="contact" id="contact">
          <div className="details">
            <Copy>
              <h2>You want to read more about us ?</h2>
            </Copy>
            <div className="dt-stack">
              <Copy delay={0.7}>
                <p>
                  If you’re an investor looking for your next breakout
                  opportunity, our story—and the numbers behind it—are just a
                  click away. Download the pitch deck below, explore the vision,
                  and let’s start a conversation about where we can go
                  together..
                </p>
              </Copy>
              <BtnCta text={"Download Deck"} link={"#"} bg={"var(--ap11)"} />
            </div>
          </div>
        </section>
      </main>
      <section className="scroll-help"></section>
      <Footer />
    </>
  );
}
