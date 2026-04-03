import { NextRequest, NextResponse } from 'next/server';
import { pushArticle } from '@/lib/pusher';

export async function POST(req: NextRequest) {
  const pushSecret = process.env.PUSH_SECRET;
  const auth = req.headers.get('authorization');

  if (!auth || auth !== `Bearer ${pushSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { article } = await req.json();
    const result = await pushArticle(article);

    if (result.ok) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: result.error });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
