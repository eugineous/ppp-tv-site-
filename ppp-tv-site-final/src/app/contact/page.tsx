import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with PPP TV Kenya.',
};

const CONTACT_CARDS = [
  { title: 'General Enquiries', detail: 'info@ppptv.co.ke', icon: '✉️', href: 'mailto:info@ppptv.co.ke', color: '#FF007A' },
  { title: 'Advertising',       detail: 'ads@ppptv.co.ke',  icon: '📢', href: 'mailto:ads@ppptv.co.ke',  color: '#BF00FF' },
  { title: 'News Tips',         detail: 'news@ppptv.co.ke', icon: '📰', href: 'mailto:news@ppptv.co.ke', color: '#00CFFF' },
  { title: 'Nairobi Studio',    detail: 'Nairobi, Kenya',   icon: '📍', href: 'https://maps.google.com/?q=Nairobi,Kenya', color: '#FF6B00' },
];

const SOCIALS = [
  { label: 'YouTube',    href: 'https://www.youtube.com/@PPPTVKENYA',       color: '#FF0000' },
  { label: 'Instagram',  href: 'https://www.instagram.com/ppptv_kenya',     color: '#FF007A' },
  { label: 'Twitter / X',href: 'https://twitter.com/ppptv_kenya',           color: '#00CFFF' },
  { label: 'Facebook',   href: 'https://www.facebook.com/ppptv.kenya',      color: '#1877F2' },
  { label: 'TikTok',     href: 'https://www.tiktok.com/@ppptv_kenya',       color: '#fff'    },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">Contact Us</h1>
      <p className="text-gray-500 text-sm mb-10">We&apos;d love to hear from you.</p>

      <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-8">
        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 lg:mb-0">
          {CONTACT_CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group transition-transform hover:scale-[1.02]"
              style={{ background: '#111', borderTop: `3px solid ${card.color}` }}
            >
              <div className="p-6">
                <span className="text-3xl mb-3 block" aria-hidden="true">{card.icon}</span>
                <p className="font-bold text-white group-hover:opacity-80 transition-opacity">{card.title}</p>
                <p className="text-sm text-gray-400 mt-1">{card.detail}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Socials sidebar */}
        <aside aria-label="Social media links">
          <div style={{ background: '#111', borderTop: '3px solid #FF007A' }}>
            <div className="p-6">
              <h2 className="font-bebas text-xl text-white tracking-wide mb-5">Follow Us</h2>
              <ul className="space-y-3">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold transition-opacity hover:opacity-70"
                      style={{ color: s.color }}
                    >
                      {s.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
