type AccentStripesProps = {
  corner?: "tr" | "bl";
  className?: string;
};

/* Decorative layered diagonal bars in shades of the brand accent —
   inspired by King Kong's cornered stripe clusters (not a copy), used
   to add depth to otherwise flat dark sections. Purely decorative. */
export default function AccentStripes({ corner = "tr", className = "" }: AccentStripesProps) {
  return (
    <div className={`accent-stripes accent-stripes-${corner} ${className}`} aria-hidden="true">
      <span className="accent-stripe accent-stripe-a" />
      <span className="accent-stripe accent-stripe-b" />
      <span className="accent-stripe accent-stripe-c" />
      <span className="accent-stripe accent-stripe-d" />
    </div>
  );
}
