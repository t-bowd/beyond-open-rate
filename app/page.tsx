import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Services from "@/components/Services";
import GuaranteeBand from "@/components/GuaranteeBand";
import Results from "@/components/Results";
import LeadMagnet from "@/components/LeadMagnet";
import Process from "@/components/Process";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import { JsonLd, faqSchema } from "@/lib/jsonld";
import { faqs } from "@/lib/content";

export default function Page() {
  return (
    <>
      <Hero />
      <Logos />
      <Services />
      <Results />
      <LeadMagnet />
      <GuaranteeBand />
      <Process />
      <Testimonial />
      <Faq />
      <Contact />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
