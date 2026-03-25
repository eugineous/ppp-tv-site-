'use client';
import { useState, useEffect } from 'react';

const mainLinks = [
  { href: '/',             label: 'Home'          },
  { href: '/shows',        label: 'Shows'         },
  { href: '/news',         label: 'News'          },
  { href: '/politics',     label: 'Politics'      },
  { href: '/entertainment',label: 'Entertainment' },
  { href: '/sports',       label: 'Sports'        },
  { href: '/lifestyle',    label: 'Lifestyle'     },
  { href: '/technology',   label: 'Technology'    },
  { href: '/trending',     label: '🔥 Trending'   },
  { href: '/live',         label: '🔴 Live'       },
  { href: '/video',        label: 'Video'         },
  { href: '/schedule',     label: 'Schedule'      },
  { href: '/saved',        label: 'My List'       },
  { href: '/contact',      label: 'Contact'       },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="sm:hidden shrink-0 w-9 h-9 flex flex-col items-center justify-center gap-[5px] ml-auto"
      >
        <span className="block w-5 h-[2px] bg-white transition-all duration-200"
          style={{ transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
        <span className="block w-5 h-[2px] bg-white transition-all duration-200"
          style={{ opacity: open ? 0 : 1 }} />
        <span className="block w-5 h-[2px] bg-white transition-all duration-200"
          style={{ transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 sm:hidden" onClick={() => setOpen(false)} />
      )}

      <div
        className="fixed top-16 left-0 right-0 bottom-0 z-50 overflow-y-auto sm:hidden"
        style={{
          background: '#050505',
          borderTop: '2px solid #FF007A',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <nav className="px-4 py-4">
          <div className="mb-4">
            {mainLinks.map(l => (
              <a key={l.href} href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center h-12 text-sm font-black uppercase tracking-widest text-gray-200 hover:text-white hover:pl-2 transition-all"
                style={{ borderBottom: '1px solid #111' }}>
                {l.label}
              </a>
            ))}
          </div>
          <a href="/search" onClick={() => setOpen(false)}
            className="mt-4 flex items-center gap-2 w-full px-4 py-3 text-sm font-bold text-white uppercase tracking-widest"
            style={{ background: '#FF007A', borderRadius: '2px' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Search
          </a>
          <p className="text-[10px] text-gray-700 text-center mt-6 pb-4">PPP TV Kenya · StarTimes Channel 430</p>
        </nav>
      </div>
    </>
  );
}
