import Image from "next/image";
import Reveal from "./Reveal";

// TODO: Legal review needed before launch.
// These are past employer/partner brand names included as experience signals,
// not direct client relationships , "We've worked with" is deliberately looser
// than "Our clients" for that reason. Options before going live:
//   1. Get explicit written sign-off from a contact at each brand, OR
//   2. Replace with current client logos (with permission), OR
//   3. Tighten the framing copy further if still ambiguous.
const LOGOS = [
  { name: "eBay",       src: "/ebay.svg"   },
  { name: "99designs",  src: "/99.svg"     },
  { name: "Envato",     src: "/envato.svg" },
  { name: "Cover-More", src: "/cm.svg"     },
];

export default function PressLogos() {
  return (
    <section className="press-logos" data-screen-label="Press logos">
      <div className="wrap">
        <Reveal as="p" className="press-logos-label">Brands we&apos;ve made money for</Reveal>
        <div className="press-logos-row">
          {LOGOS.map(({ name, src }) => (
            <span className="press-logo" key={name}>
              <Image src={src} alt={name} width={120} height={40} style={{ objectFit: "contain", height: 32, width: "auto" }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
