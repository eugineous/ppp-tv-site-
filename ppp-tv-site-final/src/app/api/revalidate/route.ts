import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const WORKER_SECRET = process.env.WORKER_SECRET ?? '';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (WORKER_SECRET && auth !== `Bearer ${WORKER_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { path?: string; tag?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const path = body.path ?? '/';
  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
