const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  laptop: "(min-width: 1024px)",
};

// Function to get the current breakpoint name
export default function getCurrentBreakpoint() {
  if (typeof window === "undefined") {
    return null; // On the server, we don't know the breakpoint
  }
  if (window.matchMedia(breakpoints.mobile).matches) return "mobile";
  if (window.matchMedia(breakpoints.tablet).matches) return "tablet";
  if (window.matchMedia(breakpoints.laptop).matches) return "laptop";
  // Add checks for other breakpoints if you define more
  return "laptop"; // Default or fallback if screen is very large or no match
}
