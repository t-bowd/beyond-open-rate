import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

type PageHeroProps = {
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  /** TODO: swap in real photography per page once available — falls back
      to a plain dark background (matching the homepage overlay tone). */
  image?: string;
};

export default function PageHero({ label, title, sub, actions, image }: PageHeroProps) {
  return (
    <section className="hero hero-photo" data-screen-label={label}>
      {image && (
        <Image src={image} alt="" fill priority className="hero-bg" style={{ objectFit: "cover" }} />
      )}
      <div className="hero-overlay" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Reveal as="h1">{title}</Reveal>
        {sub && <Reveal as="p" className="hero-sub">{sub}</Reveal>}
        {actions && <Reveal as="div" className="hero-actions">{actions}</Reveal>}
      </div>
    </section>
  );
}
