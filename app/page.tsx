import Hero from "@/components/Hero";
import NarrativeLetter from "@/components/NarrativeLetter";
import SplitOffer from "@/components/SplitOffer";
import PressLogos from "@/components/PressLogos";
import Results from "@/components/Results";
import CaseStudiesWall from "@/components/CaseStudiesWall";
import Positioning from "@/components/Positioning";
import Testimonial from "@/components/Testimonial";
import GuaranteeBand from "@/components/GuaranteeBand";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Contact from "@/components/Contact";
import { JsonLd, faqSchema } from "@/lib/jsonld";
import { faqs } from "@/lib/content";

export default function Page() {
  return (
    <>
      <Hero />
      <NarrativeLetter />
      <SplitOffer />
      <PressLogos />
      <Results />
      <CaseStudiesWall />
      <Positioning />
      <Testimonial />
      <GuaranteeBand />
      <Faq />
      <FinalCta />
      <Contact />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
