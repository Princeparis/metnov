// components/CloseButton.jsx
"use client"; // If it has an onClick prop, it's interactive

import React, { useState } from "react";
import getCurrentBreakpoint from "@/utils/breakPoint";

// Simple X SVG Icon
const CloseIcon = ({
  size = 12,
  strokeWidth = 2.5,
  color = "currentColor",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "6px" }} // Space between icon and text
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CloseButton = ({ onClick, text = "CLOSE" }) => {
  return (
    <button
      onClick={onClick}
      className="close-button"
      aria-label={text || "Close"}
    >
      <CloseIcon size={12} strokeWidth={4} color="rgb(80, 80, 80)" />
      {text}
    </button>
  );
};

export default CloseButton;
