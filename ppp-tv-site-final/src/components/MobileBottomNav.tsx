'use client';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',       label: 'Home',   icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { href: '/shows',  label: 'Shows',  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg> },
  { href: '/video',  label: 'Video',  icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { href: '/live',   label: 'Live',   icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="currentColor"/><path strokeLinecap="round" strokeLinejoin="round" d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.5 5.5a9 9 0 000 13M18.5 5.5a9 9 0 010 13"/></svg> },
  { href: '/search', label: 'Search', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{ background: '#050505', borderTop: '1px solid #1a1a1a', paddingBottom: 'env(safe-area-inset-bottom)', height: 'calc(56px + env(safe-area-inset-bottom))' }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <a key={item.href} href={item.href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
            style={{ color: active ? '#FF007A' : '#555' }}
            aria-current={active ? 'page' : undefined}>
            {item.icon}
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
