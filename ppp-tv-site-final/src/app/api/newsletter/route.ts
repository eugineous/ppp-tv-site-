import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

// Simple in-memory rate limiter: 5 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  // Forward to Cloudflare Worker
  try {
    const res = await fetch(`${WORKER_BASE}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WORKER_SECRET}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: (data as { error?: string }).error ?? 'Subscription failed.' },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: 'You\'re subscribed! Welcome to PPP TV Kenya.' });
  } catch {
    return NextResponse.json({ error: 'Service unavailable. Please try again later.' }, { status: 503 });
  }
}
