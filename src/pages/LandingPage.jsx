import React from 'react';
import Navbar from '../components/Navbar/Navbar.jsx';
import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import Services from '../components/Services/Services.jsx';
import FeaturedCars from '../components/FeaturedCars/FeaturedCars.jsx';
import HowItWorks from '../components/HowItWorks/HowItWorks.jsx';
import Testimonials from '../components/Testimonials/Testimonials.jsx';
import CTA from '../components/CTA/CTA.jsx';
import Footer from '../components/Footer/Footer.jsx';

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <FeaturedCars />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default LandingPage;
