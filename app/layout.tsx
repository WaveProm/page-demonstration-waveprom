import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaveProm",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body className="selection:bg-gray-900/80 selection:text-white">
        {children}
      </body>
    </html>
  );
}
