import type { Metadata } from "next";
import SmoothScroll from "@/components/smooth-scroll/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaveProm",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        {/* On the root, so the first wheel of the first screen already has
            the weight: every dive on the site is read off this scroll. */}
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
