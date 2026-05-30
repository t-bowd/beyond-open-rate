import Hero from "@/components/Hero";
import Logos from "@/components/Logos";
import Services from "@/components/Services";
import Results from "@/components/Results";
import Process from "@/components/Process";
import Testimonial from "@/components/Testimonial";
import Faq from "@/components/Faq";
import CtaBand from "@/components/CtaBand";
import { JsonLd, faqSchema } from "@/lib/jsonld";
import { faqs } from "@/lib/content";

export default function Page() {
  return (
    <>
      <Hero />
      <Logos />
      <Services />
      <Results />
      <Process />
      <Testimonial />
      <Faq />
      <CtaBand />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
