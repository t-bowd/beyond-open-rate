type SectionSeamProps = {
  /** The CSS colour value (usually a var()) matching this section's own background — the wedge is filled with it so it reads as a diagonal bite taken out of the section above. */
  fill: string;
  flip?: boolean;
};

/* Renders as the first child of a section, poking up into the section
   above to blend the two together with a diagonal cut plus layered
   accent stripes crossing the seam — the transition device King Kong
   uses between sections, not a copy of their exact shapes/colours. */
export default function SectionSeam({ fill, flip = false }: SectionSeamProps) {
  return (
    <div
      className={`section-seam ${flip ? "section-seam-flip" : ""}`}
      style={{ "--seam-fill": fill } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="seam-wedge" />
      <span className="seam-stripe seam-stripe-a" />
      <span className="seam-stripe seam-stripe-b" />
      <span className="seam-stripe seam-stripe-c" />
    </div>
  );
}
