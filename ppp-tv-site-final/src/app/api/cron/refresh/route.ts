import { NextRequest, NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/rss';

const CRON_SECRET = process.env.CRON_SECRET ?? '';
const WORKER_BASE = process.env.NEXT_PUBLIC_WORKER_URL ?? '';
const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  // Verify cron secret
  const auth = req.headers.get('authorization');
  if (CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const start = Date.now();

  try {
    // Fetch all RSS feeds in parallel
    const articles = await fetchAllFeeds();

    if (articles.length === 0) {
      return NextResponse.json({ message: 'No articles fetched.', saved: 0, skipped: 0 });
    }

    // POST to Worker in batches of 50
    const BATCH_SIZE = 50;
    let totalSaved = 0;
    let totalSkipped = 0;

    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const batch = articles.slice(i, i + BATCH_SIZE);
      try {
        const res = await fetch(`${WORKER_BASE}/articles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${WORKER_SECRET}`,
          },
          body: JSON.stringify(batch),
        });

        if (res.ok) {
          const data = await res.json();
          totalSaved += data.saved ?? 0;
          totalSkipped += data.skipped ?? 0;
        }
      } catch {
        // Continue with next batch on error
      }
    }

    const elapsed = Date.now() - start;
    return NextResponse.json({
      message: 'Cron refresh complete.',
      fetched: articles.length,
      saved: totalSaved,
      skipped: totalSkipped,
      elapsed: `${elapsed}ms`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Cron refresh failed.', detail: String(err) },
      { status: 500 }
    );
  }
}
