import { Geist, Geist_Mono } from "next/font/google";
import { ReactLenis } from "lenis/react";
import localFont from "next/font/local";

import "./globals.css";
import GlobalMenu from "@/components/GlobalMenu";

const machinaFont = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMachina-InktrapRegular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMachina-InktrapMedium.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMachina-InktrapUltrabold.woff2",
      weight: "1000",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMachina-InktrapLightItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPNeueMachina-InktrapMediumItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPNeueMachina-InktrapUltraboldItalic.woff2",
      weight: "1000",
      style: "italic",
    },
    // Add other weights/styles for PrimaryFont if available
  ],
  variable: "--font-machina", // CSS variable for this font
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"], // Fallback for primary font
});

const montrealFont = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontreal-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-Bold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/PPNeueMontreal-BoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-montreal", // CSS variable for this font
  display: "swap",
  fallback: ["Helvetica", "sans-serif"], // Fallback for secondary font (e.g., a serif)
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Metnov | We are an infinitely innovative tech brand",
  description: "We are an infinitely innovative brand",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${machinaFont.variable} ${montrealFont.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" sizes="180x180" />
      </head>
      <ReactLenis root>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <GlobalMenu />
          {children}
        </body>
      </ReactLenis>
    </html>
  );
}
