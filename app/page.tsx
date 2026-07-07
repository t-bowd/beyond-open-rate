import Hero from "@/components/Hero";
import NarrativeLetter from "@/components/NarrativeLetter";
import SplitOffer from "@/components/SplitOffer";
import PressLogos from "@/components/PressLogos";
import GrowFaster from "@/components/GrowFaster";
import Positioning from "@/components/Positioning";
import Testimonial from "@/components/Testimonial";
import GuaranteeBand from "@/components/GuaranteeBand";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import { JsonLd, faqSchema } from "@/lib/jsonld";
import { faqs } from "@/lib/content";

export default function Page() {
  return (
    <>
      <Hero />
      <NarrativeLetter />
      <SplitOffer />
      <PressLogos />
      <GrowFaster />
      <Positioning />
      <Testimonial />
      <GuaranteeBand />
      <Faq />
      <FinalCta />
      <JsonLd data={faqSchema(faqs)} />
    </>
  );
}
