import Link from 'next/link';
import type { Metadata } from 'next';
import { hosts } from '@/data/hosts';

export const metadata: Metadata = {
  title: 'Hosts',
  description: 'Meet the PPP TV Kenya on-air talent — anchors, DJs and presenters.',
};

export default function HostsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Our Hosts</h1>
      <p className="text-gray-400 text-sm mb-8">The faces and voices of PPP TV Kenya.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {hosts.map((host) => (
          <Link
            key={host.slug}
            href={`/hosts/${host.slug}`}
            className="group bg-[#111] rounded-xl p-5 text-center hover:ring-1 hover:ring-brand-pink/50 transition-all"
          >
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-full bg-${host.accentColor ?? 'brand-pink'}/20 flex items-center justify-center mx-auto mb-3`}>
              <span className="font-bebas text-2xl text-white">{host.initials}</span>
            </div>
            <p className="font-semibold text-white text-sm group-hover:text-brand-pink transition-colors leading-tight">
              {host.name}
            </p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{host.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
