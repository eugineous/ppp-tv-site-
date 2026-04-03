import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ?? '';
const SITE_URL = 'https://ppp-tv-site-final.vercel.app';

function escapeXml(str: string): string {
  return (str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return (html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 100);
    const category = searchParams.get('category') ?? '';
    const since = searchParams.get('since') ?? ''; // ISO timestamp — only return articles newer than this

    // Build Supabase query
    let query = `${SUPABASE_URL}/rest/v1/articles?order=published_at.desc&limit=${limit}&select=slug,rewritten_title,original_title,rewritten_excerpt,rewritten_body,category,image_url,source_name,source_url,published_at,pptv_verdict,tags`;
    if (category) query += `&category=eq.${encodeURIComponent(category)}`;
    if (since) query += `&published_at=gt.${encodeURIComponent(since)}`;

    const res = await fetch(query, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      cache: 'no-store',
    });

    if (!res.ok) return new NextResponse('Failed to fetch articles', { status: 502 });

    const articles = await res.json() as Array<{
      slug: string;
      rewritten_title: string;
      original_title: string;
      rewritten_excerpt: string;
      rewritten_body: string;
      category: string;
      image_url: string;
      source_name: string;
      source_url: string;
      published_at: string;
      pptv_verdict: string;
      tags: string[];
    }>;

    const items = articles.map((a) => {
      const title = a.rewritten_title || a.original_title || '';
      const link = `${SITE_URL}/news/${a.slug}`;
      const desc = stripHtml(a.rewritten_excerpt ?? a.rewritten_body ?? '').slice(0, 500);
      const pubDate = new Date(a.published_at).toUTCString();
      const imageUrl = a.image_url ?? '';
      const tags = Array.isArray(a.tags) ? a.tags : [];
      const verdict = a.pptv_verdict ?? '';

      return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description><![CDATA[${desc}${verdict ? `\n\n🔥 PPP TV Verdict: ${verdict}` : ''}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${a.category ?? 'Entertainment'}]]></category>
      <source url="${escapeXml(SITE_URL)}">PPP TV Kenya</source>
      ${a.source_url ? `<comments>${escapeXml(a.source_url)}</comments>` : ''}
      ${imageUrl ? `<enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0"/>` : ''}
      ${imageUrl ? `<media:content url="${escapeXml(imageUrl)}" medium="image"/>` : ''}
      ${tags.map(t => `<dc:subject><![CDATA[${t}]]></dc:subject>`).join('\n      ')}
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PPP TV Kenya — Entertainment, Sports &amp; Technology</title>
    <link>${SITE_URL}</link>
    <description>Kenya's #1 entertainment platform — celebrity, music, sports, tech and lifestyle news. Auto-updated every 5 minutes.</description>
    <language>en-ke</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>5</ttl>
    <atom:link href="${SITE_URL}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://pub-8244b5f99b024cda91b74e1131378a14.r2.dev/LOGOS/PPPtv Logo-2.png</url>
      <title>PPP TV Kenya</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new NextResponse(`RSS error: ${String(err)}`, { status: 500 });
  }
}
