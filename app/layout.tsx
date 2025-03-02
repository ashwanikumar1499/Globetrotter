import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
