import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./(main)/components/header";
import RegisterModal from "./(main)/components/auth/RegisterModal";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Globetrotter Challenge",
  description:
    "Test your geography knowledge with cryptic clues about famous destinations around the world!",
  keywords: "geography, travel, quiz, game, destinations, challenge",
  authors: [{ name: "Globetrotter Team" }],
  openGraph: {
    title: "Globetrotter Challenge",
    description: "The Ultimate Travel Guessing Game",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body
        className={`${poppins.className} antialiased text-gray-800 bg-gray-50`}
      >
        <Header />
        <RegisterModal />
        <main className="pt-16">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
