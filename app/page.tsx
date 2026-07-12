import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Beyond Open Rate , Email marketing agency, Australia",
  description:
    "Your email program is either making you money or costing you money. We help Australian businesses find out which , and fix it. Free strategy session (worth $500).",
  alternates: { canonical: "https://www.beyondopenrate.com.au/" },
};

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
