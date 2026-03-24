interface SectionLabelProps {
  label: string;
  href?: string;
  seeAllLabel?: string;
  accentColor?: string;
  color?: string; // inline hex color
}

export default function SectionLabel({
  label,
  href,
  seeAllLabel = 'See All →',
  accentColor,
  color = '#FF007A',
}: SectionLabelProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{ background: color }}
          aria-hidden="true"
        />
        <h2 className="font-bebas text-xl text-white tracking-wide">{label}</h2>
      </div>
      {href && (
        <a href={href} className="text-xs font-medium text-gray-400 hover:text-white transition-colors">
          {seeAllLabel}
        </a>
      )}
    </div>
  );
}
