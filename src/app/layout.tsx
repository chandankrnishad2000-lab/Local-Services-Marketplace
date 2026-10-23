import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Space_Grotesk, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BootstrapClient from "@/components/BootstrapClient";
import { AuthProvider } from "@/contexts/AuthContext";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Local Services",
  description: "A modern marketplace for local services",
  icons: {
    icon: "/images/localpulse-logo.png",
    apple: "/images/localpulse-logo.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${fraunces.variable}`}>
      <body>
        <BootstrapClient />
        <AuthProvider>
          <div className="page">
            <Header />
            <main className="main">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
