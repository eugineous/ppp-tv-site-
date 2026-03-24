'use client';
import { useState } from 'react';

export default function NewsletterBar() {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? 'done' : 'error');
      if (res.ok) setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="w-full py-8 px-4" style={{ background: '#0a0a0a', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        <div className="shrink-0 text-center sm:text-left">
          <p className="display text-white" style={{ fontSize: '1.3rem' }}>Stay in the Loop</p>
          <p className="text-gray-500 text-xs mt-0.5">Kenya entertainment news, straight to your inbox.</p>
        </div>
        {status === 'done' ? (
          <p className="text-sm font-bold text-[#10b981]">You&apos;re subscribed. Welcome to PPP TV!</p>
        ) : (
          <form onSubmit={submit} className="flex gap-2 flex-1 max-w-md w-full">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required
              className="flex-1 px-4 py-2.5 text-white text-sm focus:outline-none"
              style={{ background: '#141414', border: '1px solid #222' }} />
            <button type="submit" disabled={status === 'loading'}
              className="px-5 py-2.5 text-white font-bold text-xs uppercase tracking-widest transition-opacity hover:opacity-85 disabled:opacity-60 shrink-0 flex items-center gap-2"
              style={{ background: '#FF007A' }}>
              {status === 'loading' && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Subscribe
            </button>
          </form>
        )}
        {status === 'error' && <p className="text-xs text-red-400 mt-1">Something went wrong. Try again.</p>}
      </div>
    </div>
  );
}
