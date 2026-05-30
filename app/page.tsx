import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Services from "@/components/Services";
import Results from "@/components/Results";
import Process from "@/components/Process";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Logos />
        <Services />
        <Results />
        <Process />
        <Testimonial />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
