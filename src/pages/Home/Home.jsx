import Navbar from "../../components/layout/Navbar";
import Hero from "../sections/Hero";
import StatsStrip from "../sections/StatsStrip";
import Features from "../sections/Features";
import HowItWorks from "../sections/HowItWorks";
import Showcase from "../sections/Showcase";
import Testimonial from "../sections/Testimonial";
import CtaBanner from "../sections/CtaBanner";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsStrip />
      <div className="stitch-divider" />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonial />
      <CtaBanner />
      <Footer />
    </div>
  );
}