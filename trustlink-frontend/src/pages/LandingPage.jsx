import React from "react";
import Navbar from "./LandingLayout/Navbar";
import HeroSection from "./LandingLayout/HeroSection";
import AboutSection from "./LandingLayout/AboutSection";
import SolutionSection from "./LandingLayout/SolutionSection";
import FeaturesSection from "./LandingLayout/FeaturesSection";
import FAQSection from "./LandingLayout/FAQSection";
import CTASection from "./LandingLayout/CTASection";
import Footer from "./LandingLayout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <SolutionSection />
        <FeaturesSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}