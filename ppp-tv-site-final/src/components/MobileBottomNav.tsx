'use client';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/entertainment', label: 'Entertain', icon: '🎬' },
  { href: '/sports', label: 'Sports', icon: '⚽' },
  { href: '/trending', label: 'Trending', icon: '🔥' },
  { href: '/search', label: 'Search', icon: '🔍' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center"
      style={{
        background: 'rgba(0,0,0,0.98)',
        borderTop: '1px solid rgba(255,0,122,0.2)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(58px + env(safe-area-inset-bottom))',
      }}
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <a key={item.href} href={item.href}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '3px', height: '100%', textDecoration: 'none',
              color: active ? '#FF007A' : '#555', transition: 'color .15s',
              position: 'relative',
            }}
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <span style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: '#FF007A', borderRadius: '0 0 2px 2px' }} />
            )}
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '.05em', textTransform: 'uppercase' }}>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
