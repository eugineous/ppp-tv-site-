import { NextRequest, NextResponse } from 'next/server';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || '';
const WORKER_SECRET = process.env.WORKER_SECRET || '';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  try {
    const res = await fetch(`${WORKER_URL}/comments?slug=${encodeURIComponent(slug)}`);
    const data = res.ok ? await res.json() : { comments: [] };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ comments: [] });
  }
}

export async function POST(req: NextRequest) {
  let body: { articleSlug?: string; authorName?: string; content?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { articleSlug, authorName, content } = body;
  if (!articleSlug || !authorName?.trim() || !content?.trim())
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (authorName.trim().length > 50)
    return NextResponse.json({ error: 'Name too long' }, { status: 400 });
  if (content.trim().length > 500)
    return NextResponse.json({ error: 'Comment too long' }, { status: 400 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  try {
    const res = await fetch(`${WORKER_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WORKER_SECRET}`,
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify({ articleSlug, authorName: authorName.trim(), content: content.trim() }),
    });

    if (res.status === 429) return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
    if (!res.ok) return NextResponse.json({ error: 'Failed to save' }, { status: 500 });

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
