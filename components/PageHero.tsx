import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

// TODO: swap for per-page photography once it's picked — this is a
// placeholder stock shot standing in across every secondary-page hero.
const DEFAULT_IMAGE = "/pexels-yankrukov-7693745.jpg";

type PageHeroProps = {
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  /** Defaults to a placeholder stock photo — pass a specific image to override per page. */
  image?: string;
};

export default function PageHero({ label, title, sub, actions, image = DEFAULT_IMAGE }: PageHeroProps) {
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
