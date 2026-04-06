import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import AboutSection from "@/components/home/AboutSection";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import PartnersSection from "@/components/home/PartnersSection";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
      setContentReady(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
    setTimeout(() => setContentReady(true), 100);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(!showSplash || contentReady) && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col"
          >
            <Header />
            <main className="flex-1">
              <HeroSection />
              <PartnersSection />
              <FeaturedCourses />
              <AboutSection />
              <HowItWorks />
              <Testimonials />
              <FAQSection />
              <CTASection />
              {/* Important Notice / Accreditation Status Disclaimer */}
              <section
                className="my-8 mx-auto max-w-7xl rounded-xl bg-yellow-100 border border-yellow-300 px-6 py-5 flex items-center justify-center shadow-md"
                aria-label="Accreditation Status"
              >
                <div className="w-full text-center">
                  <div className="font-heading text-lg md:text-xl font-bold text-yellow-900 mb-2">
                    Important Notice
                  </div>
                  <div className="font-bold text-yellow-900 text-base md:text-lg">
                    Pending Approval IACET – International Accreditors for Ongoing Education & Training
                  </div>
                </div>
              </section>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
