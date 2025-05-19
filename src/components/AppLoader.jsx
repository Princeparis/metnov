// components/AppLoader.jsx
"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const AppLoader = ({ onLoadingComplete }) => {
  return <div ref={mainContainerRef} style={styles.mainContainer}></div>;
};

export default AppLoader;
