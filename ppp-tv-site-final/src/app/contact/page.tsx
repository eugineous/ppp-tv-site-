import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with PPP TV Kenya.',
};

const CONTACT_CARDS = [
  {
    title: 'General Enquiries',
    detail: 'info@ppptv.co.ke',
    icon: '✉️',
    href: 'mailto:info@ppptv.co.ke',
  },
  {
    title: 'Advertising',
    detail: 'ads@ppptv.co.ke',
    icon: '📢',
    href: 'mailto:ads@ppptv.co.ke',
  },
  {
    title: 'News Tips',
    detail: 'news@ppptv.co.ke',
    icon: '📰',
    href: 'mailto:news@ppptv.co.ke',
  },
  {
    title: 'Nairobi Studio',
    detail: 'Nairobi, Kenya',
    icon: '📍',
    href: 'https://maps.google.com/?q=Nairobi,Kenya',
  },
];

const SOCIALS = [
  { label: 'YouTube', href: 'https://www.youtube.com/@PPPTVKENYA', color: 'text-red-400' },
  { label: 'Instagram', href: 'https://www.instagram.com/ppptv_kenya', color: 'text-pink-400' },
  { label: 'Twitter / X', href: 'https://twitter.com/ppptv_kenya', color: 'text-sky-400' },
  { label: 'Facebook', href: 'https://www.facebook.com/ppptv.kenya', color: 'text-blue-400' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ppptv_kenya', color: 'text-white' },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Contact Us</h1>
      <p className="text-gray-400 text-sm mb-8">We&apos;d love to hear from you.</p>

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 lg:mb-0">
          {CONTACT_CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-[#111] rounded-xl p-6 hover:ring-1 hover:ring-brand-pink/50 transition-all"
            >
              <span className="text-3xl mb-3 block" aria-hidden="true">{card.icon}</span>
              <p className="font-semibold text-white group-hover:text-brand-pink transition-colors">{card.title}</p>
              <p className="text-sm text-gray-400 mt-1">{card.detail}</p>
            </a>
          ))}
        </div>

        {/* Socials sidebar */}
        <aside aria-label="Social media links">
          <div className="bg-[#111] rounded-xl p-6">
            <h2 className="font-bebas text-xl text-white tracking-wide mb-4">Follow Us</h2>
            <ul className="space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm font-medium ${s.color} hover:opacity-80 transition-opacity`}
                  >
                    {s.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
