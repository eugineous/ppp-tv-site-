interface SectionLabelProps {
  label: string;
  href?: string;
  seeAllLabel?: string;
  accentColor?: string; // Tailwind bg class e.g. 'bg-pink-500'
}

export default function SectionLabel({
  label,
  href,
  seeAllLabel = 'See All →',
  accentColor = 'bg-brand-pink',
}: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className={`w-1 h-6 rounded-full ${accentColor}`} aria-hidden="true" />
        <h2 className="font-bebas text-xl text-white tracking-wide">{label}</h2>
      </div>
      {href && (
        <a
          href={href}
          className="text-xs font-medium text-gray-400 hover:text-brand-pink transition-colors"
        >
          {seeAllLabel}
        </a>
      )}
    </div>
  );
}
