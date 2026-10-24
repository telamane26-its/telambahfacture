"use client";

import React, { useState, useEffect } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesBentoSection } from "@/components/landing/FeaturesBentoSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState<string>("accueil");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["fonctionnalites", "comment-ca-marche", "tarifs", "temoignages"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection("accueil");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1117] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-emerald-100 dark:selection:bg-emerald-950 selection:text-emerald-900 dark:selection:text-emerald-200">
      {/* 1. Sticky Navigation Header */}
      <LandingHeader activeSection={activeSection} />

      {/* 2. Main Content */}
      <main className="w-full pt-20 relative overflow-hidden flex-1">
        {/* Subtle Ambient Halos without inline styles */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] landing-ambient-halo -z-10" />
        <div className="pointer-events-none absolute top-40 right-10 w-96 h-96 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-full blur-3xl -z-10" />

        {/* Hero Section */}
        <HeroSection />

        {/* Problem Section */}
        <ProblemSection />

        {/* Bento Features Section */}
        <FeaturesBentoSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Final CTA Section */}
        <CtaSection />
      </main>

      {/* 3. Footer */}
      <LandingFooter />
    </div>
  );
}
