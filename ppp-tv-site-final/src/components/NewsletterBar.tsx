'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterBar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message ?? 'You\'re subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <section className="bg-[#0d0d0d] border-t border-white/5 py-8 px-4" aria-label="Newsletter signup">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-bebas text-2xl text-white tracking-wide mb-1">
          Stay in the loop
        </p>
        <p className="text-sm text-gray-400 mb-4">
          Get the latest Kenya &amp; Africa news delivered to your inbox.
        </p>

        {status === 'success' ? (
          <p className="text-brand-pink font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="px-5 py-2.5 bg-brand-pink text-white text-sm font-semibold rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-400 text-sm mt-2">{message}</p>
        )}
      </div>
    </section>
  );
}
