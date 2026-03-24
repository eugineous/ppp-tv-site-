import type { Metadata } from 'next';
import { getStaffByDepartment } from '@/data/staff';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the PPP TV Kenya team — on-air talent and behind-the-scenes crew.',
};

export default function StaffPage() {
  const onAir = getStaffByDepartment('on-air');
  const behind = getStaffByDepartment('behind-the-scenes');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Our Team</h1>
      <p className="text-gray-400 text-sm mb-8">The people who make PPP TV Kenya happen every day.</p>

      {/* On-Air Talent */}
      <section className="mb-10" aria-label="On-air talent">
        <SectionLabel label="On-Air Talent" accentColor="bg-brand-pink" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {onAir.map((member) => (
            <div key={member.slug} className="bg-[#111] rounded-xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center flex-shrink-0">
                <span className="font-bebas text-xl text-white">{member.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-xs text-brand-pink mb-2">{member.role}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Behind the Scenes */}
      <section aria-label="Behind the scenes team">
        <SectionLabel label="Behind the Scenes" accentColor="bg-cyan-500" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {behind.map((member) => (
            <div key={member.slug} className="bg-[#111] rounded-xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="font-bebas text-xl text-white">{member.initials}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-xs text-cyan-400 mb-2">{member.role}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
