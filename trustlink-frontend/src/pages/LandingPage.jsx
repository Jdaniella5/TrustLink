import React from "react";
import Navbar from "./LandingLayout/Navbar";
import HeroSection from "./LandingLayout/HeroSection";
import Footer from "./LandingLayout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <HeroSection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}