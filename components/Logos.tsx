// TODO: Legal review needed before launch.
// These are past employer/partner brand names included as experience signals.
// Options before going live:
//   1. Get explicit written sign-off from a contact at each brand, OR
//   2. Replace with current client logos (with permission), OR
//   3. Change the framing copy to "Experience built with teams at" to be
//      more accurate about the nature of the relationship.

const LOGOS = ["eBay", "99designs", "Vistaprint", "Envato", "Cover-More"];

export default function Logos() {
  return (
    <section className="logos">
      <div className="wrap">
        <p className="logos-label">
          Trusted by growing &amp; enterprise businesses
        </p>
        <div className="logo-row">
          {LOGOS.map((name) => (
            <span className="logo" key={name}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
