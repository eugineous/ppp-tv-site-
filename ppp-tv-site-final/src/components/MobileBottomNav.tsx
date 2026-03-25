'use client';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/', label: 'Home',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  },
  {
    href: '/news', label: 'News',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>,
  },
  {
    href: '/live', label: '🔴 Live',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="currentColor"/><path strokeLinecap="round" strokeLinejoin="round" d="M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7"/></svg>,
  },
  {
    href: '/trending', label: 'Trending',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  },
  {
    href: '/people', label: 'People',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
  {
    href: '/search', label: 'Search',
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: 'rgba(0,0,0,0.97)',
        borderTop: '1px solid #1a1a1a',
        backdropFilter: 'blur(16px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(62px + env(safe-area-inset-bottom))',
      }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <a
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            style={{ color: active ? '#FF007A' : '#555' }}
            aria-current={active ? 'page' : undefined}
          >
            {item.icon}
            <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase' }}>
              {item.label}
            </span>
            {active && (
              <span style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom) + 2px)', width: '20px', height: '2px', background: '#FF007A', borderRadius: '999px' }} />
            )}
          </a>
        );
      })}
    </nav>
  );
}
