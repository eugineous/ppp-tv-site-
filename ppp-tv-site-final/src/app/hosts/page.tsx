import Link from 'next/link';
import type { Metadata } from 'next';
import { hosts } from '@/data/hosts';

export const metadata: Metadata = {
  title: 'Hosts',
  description: 'Meet the PPP TV Kenya on-air talent — anchors, DJs and presenters.',
};

const ACCENT_COLORS = ['#FF007A', '#BF00FF', '#00CFFF', '#FF6B00', '#00FF94', '#FFE600'];

export default function HostsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">Our Hosts</h1>
      <p className="text-gray-500 text-sm mb-10">The faces and voices of PPP TV Kenya.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {hosts.map((host, i) => {
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
          return (
            <Link
              key={host.slug}
              href={`/hosts/${host.slug}`}
              className="group text-center transition-transform hover:scale-[1.03]"
              style={{ background: '#111' }}
            >
              <div className="h-1 w-full" style={{ background: accent }} />
              <div className="p-5">
                <div
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
                >
                  <span className="font-bebas text-2xl text-white">{host.initials}</span>
                </div>
                <p className="font-bold text-white text-sm group-hover:opacity-80 transition-opacity leading-tight">
                  {host.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: accent }}>{host.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
