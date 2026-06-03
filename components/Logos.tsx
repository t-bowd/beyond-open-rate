// TODO: Legal review needed before launch.
// These are past employer/partner brand names included as experience signals.
// Options before going live:
//   1. Get explicit written sign-off from a contact at each brand, OR
//   2. Replace with current client logos (with permission), OR
//   3. Change the framing copy to "Experience built with teams at" to be
//      more accurate about the nature of the relationship.

import Image from "next/image";

const LOGOS = [
  { name: "eBay",      src: "/ebay.svg"   },
  { name: "99designs", src: "/99.svg"     },
  { name: "Envato",    src: "/envato.svg" },
  { name: "Cover-More",src: "/cm.svg"     },
];

export default function Logos() {
  return (
    <section className="logos">
      <div className="wrap">
        <p className="logos-label">
          Trusted by growing &amp; enterprise businesses
        </p>
        <div className="logo-row">
          {LOGOS.map(({ name, src }) => (
            <span className="logo" key={name}>
              <Image src={src} alt={name} width={120} height={40} style={{ objectFit: "contain", height: 32, width: "auto" }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
