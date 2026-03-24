import { NextRequest, NextResponse } from 'next/server';

const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || auth !== `Bearer ${WORKER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${WORKER_BASE}/analytics`, {
      headers: { Authorization: `Bearer ${WORKER_SECRET}` },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch analytics.' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }
}
