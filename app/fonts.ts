import { Manrope } from "next/font/google";
import localFont from "next/font/local";

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-heading",
});

export const liberationSans = localFont({
  src: [
    { path: "../public/fonts/LiberationSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/LiberationSans-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/LiberationSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/LiberationSans-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-body",
  display: "swap",
});
