/// <reference path="./types.d.ts" />

export interface Env {
  PPP_TV_KV: KVNamespace;
  WORKER_SECRET: string;
  VERCEL_URL?: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS_HEADERS)) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

function json(data: unknown, status = 200): Response {
  return cors(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }));
}

function isAuthed(req: Request, env: Env): boolean {
  return req.headers.get('Authorization') === `Bearer ${env.WORKER_SECRET}`;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  views?: number;
  trendingScore?: number;
}

async function getArticles(env: Env): Promise<Article[]> {
  const raw = await env.PPP_TV_KV.get('articles', 'json');
  return (raw as Article[] | null) ?? [];
}

async function saveArticles(env: Env, articles: Article[]): Promise<void> {
  await env.PPP_TV_KV.put('articles', JSON.stringify(articles));
}

function trendingScore(article: Article): number {
  const views = article.views ?? 0;
  const ageHours = (Date.now() - new Date(article.publishedAt).getTime()) / 3_600_000;
  return views / Math.pow(ageHours + 2, 1.5);
}

async function getViews(env: Env, slug: string): Promise<number> {
  const raw = await env.PPP_TV_KV.get(`views:${slug}`);
  return raw ? parseInt(raw, 10) : 0;
}

async function incrementViews(env: Env, slug: string): Promise<number> {
  const current = await getViews(env, slug);
  const next = current + 1;
  await env.PPP_TV_KV.put(`views:${slug}`, String(next));
  return next;
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function decodeXML(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#8216;|&#8217;|&#x2019;/g, "'")
    .replace(/&#8220;|&#8221;|&#x201C;|&#x201D;/g, '"')
    .replace(/&#8211;|&#x2013;/g, '–').replace(/&#8212;|&#x2014;/g, '—')
    .replace(/&#8230;|&#x2026;/g, '…').replace(/&#038;/g, '&')
    .replace(/&#\d+;/g, (m) => { try { return String.fromCharCode(parseInt(m.slice(2,-1),10)); } catch { return m; } })
    .replace(/\(tm\)/g, '™').replace(/\(r\)/g, '®').trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ── PROMOTIONAL CONTENT GUARDRAILS ────────────────────────────────────────────
// These run at THREE levels:
//   1. Title + excerpt scan  → reject whole article
//   2. Full body scan        → reject whole article if body is predominantly brand PR
//   3. Paragraph scan        → strip individual promo paragraphs from body

/**
 * Level 1 — Title/excerpt patterns that signal a promotional article.
 * Reject the whole article if ANY match.
 */
const PROMO_TITLE_PATTERNS: RegExp[] = [
  // Explicit ad labels
  /\b(sponsored|advertorial|advertisement|paid post|paid content|partner content|branded content|native ad|promoted|promotion)\b/i,
  // Press release / PR language
  /\b(press release|media release|official statement|for immediate release|pr newswire|business wire|globe newswire)\b/i,
  // Brand-as-author signals (e.g. "Written By Zaron Cosmetics")
  /\bwritten by\s+[A-Z][a-zA-Z\s]+(cosmetics?|beauty|brand|company|corp|ltd|inc|group|holdings?|enterprises?|solutions?|technologies?|services?)\b/i,
  // Product launch / brand push
  /\b(launches?|unveils?|introduces?|announces?|debuts?|rolls? out|now available|on sale now|buy now|shop now|order now|get yours?)\b.{0,60}\b(product|collection|range|line|model|edition|version|app|service|platform|solution)\b/i,
  // Giveaway / contest / promo
  /\b(win a|giveaway|contest|sweepstake|raffle|promo code|discount code|coupon|voucher|free gift|limited offer|exclusive deal|flash sale|special offer|up to \d+% off)\b/i,
  // Brand-centric puff pieces — brand hosts/sponsors/donates
  /\b(partners? with|in partnership with|powered by|brought to you by|supported by|presented by|in association with)\b/i,
  // Brand CSR / outreach stories written by the brand itself
  /\b(hosts?|sponsors?|donates?|gifts?|empowers?|supports?)\b.{0,80}\b(widows?|orphans?|community|women|youth|children|families)\b.{0,120}\b(cosmetics?|beauty|brand|company|corp|ltd|inc|group)\b/i,
  // Recruitment / corporate
  /\b(we.re hiring|join our team|career opportunity|job opening|apply now|vacancy)\b/i,
  // "The post appeared first on" — BellaNaija brand content signal
  /the post .{0,120} appeared first on/i,
];

/**
 * Level 2 — Full-body signals that the article is brand PR even if title looks neutral.
 * Count how many of these fire; if >= 3, reject the whole article.
 */
const PROMO_BODY_SIGNALS: RegExp[] = [
  // Brand as author / source
  /\bwritten by\s+[A-Z]/i,
  /\bthe post .{0,120} appeared first on\b/i,
  /\bthis (article|post|content|story) (is|was) (sponsored|paid|brought|supported|presented)\b/i,
  // CEO / founder quotes promoting their own brand
  /\b(founder|ceo|chief executive|managing director|president)\b.{0,120}\b(said|stated|noted|added|commented)\b.{0,200}\b(brand|company|product|mission|vision|commitment|initiative)\b/i,
  // Brand mission / purpose language
  /\b(our (mission|vision|commitment|purpose|belief|values?)|the brand.s (mission|vision|commitment|purpose))\b/i,
  // Brand CSR boilerplate
  /\b(remains? committed to|reinforcing (its|our) (mission|commitment|belief)|using (its|our) platform)\b/i,
  // Product / service availability
  /\b(available (now|online|at|from|in stores?)|purchase (at|from|online)|order (at|from|online))\b/i,
  // Explicit brand promotion
  /\b(leading (brand|company|manufacturer|provider|platform)|award.winning (brand|product|service))\b/i,
  // "The post appeared first on" footer
  /the post .{0,80} appeared first on .{0,80}\. read (today|now|more)/i,
];

/**
 * Level 3 — Paragraph-level patterns.
 * Strip matching paragraphs from the body; keep the article.
 */
const PROMO_PARA_PATTERNS: RegExp[] = [
  // Ad / sponsor disclosures
  /\b(this (article|post|content|story) (is|was) (sponsored|paid|brought|supported|presented)|sponsored by|advertisement|advertorial)\b/i,
  // CTA / sales language
  /\b(click here to (buy|order|shop|get|download|sign up|register|subscribe)|buy now|shop now|order now|get yours?|add to cart|limited (time|stock)|while stocks? last)\b/i,
  // Discount / promo codes
  /\b(use (code|promo|coupon|discount code)|promo code|coupon code|discount code|voucher code|get \d+% off|save \d+%|free shipping)\b/i,
  // Brand partnership disclosures
  /\b(in partnership with|powered by|brought to you by|supported by|presented by|in association with|affiliate (link|disclosure)|this post (contains?|includes?) affiliate)\b/i,
  // Product push paragraphs
  /\b(available (now|online|at|from|in stores?)|purchase (at|from|online)|order (at|from|online)|visit (our|the) (website|store|shop)|follow us (on|at)|subscribe (to|for) (our|the))\b/i,
  // Social media follow prompts
  /\b(follow (us|me|them) on (instagram|twitter|facebook|tiktok|youtube|x)|like (our|the) (page|account)|join (our|the) (community|group|channel))\b/i,
  // "The post appeared first on" footer lines
  /the post .{0,120} appeared first on/i,
  // Brand mission boilerplate
  /\b(remains? committed to|reinforcing (its|our) (mission|commitment)|using (its|our) platform and resources)\b/i,
  // CEO quote promoting brand
  /\b(founder|ceo|chief executive|managing director)\b.{0,60}\b(said|stated|noted|added)\b.{0,200}\b(brand|mission|commitment|initiative|empower)\b/i,
  // Written-by attribution lines
  /^written by\s+/i,
];

/** Level 1: reject if title/excerpt is promotional */
function isPromotional(title: string, excerpt: string): boolean {
  const combined = `${title} ${excerpt}`;
  return PROMO_TITLE_PATTERNS.some(r => r.test(combined));
}

/** Level 2: reject if article body is predominantly brand PR (>= 3 body signals) */
function isBodyPromotional(content: string): boolean {
  if (!content) return false;
  const text = stripHtml(content);
  const hits = PROMO_BODY_SIGNALS.filter(r => r.test(text)).length;
  return hits >= 3;
}

/** Level 3: strip promotional paragraphs from article body HTML */
function cleanPromotionalContent(html: string): string {
  if (!html) return html;
  return html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const text = stripHtml(inner).trim();
    if (PROMO_PARA_PATTERNS.some(r => r.test(text))) return '';
    return match;
  });
}

// ─────────────────────────────────────────────────────────────────────────────

/** Extract og:image, og:description, and article body from a page */
async function scrapeArticlePage(url: string): Promise<{ image: string; content: string; excerpt: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { image: '', content: '', excerpt: '' };
    const html = await res.text();

    // og:image — most reliable
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      ?? html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)?.[1]
      ?? '';

    // og:description
    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1]
      ?? '';

    // Article body — try common selectors via regex
    let articleHtml = '';
    const bodyPatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<div[^>]+class=["'][^"']*(?:article-body|post-content|entry-content|story-body|article-content|content-body)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]+class=["'][^"']*(?:article|post|story|content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ];
    for (const pat of bodyPatterns) {
      const m = html.match(pat);
      if (m?.[1] && m[1].length > 200) { articleHtml = m[1]; break; }
    }

    // Clean the article HTML — remove scripts, styles, nav, ads
    const cleanHtml = articleHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<aside[\s\S]*?<\/aside>/gi, '')
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '') // remove embedded figures/captions
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<a[^>]+href=["'][^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, '$1') // strip links
      .replace(/<[^>]+(class|id|style|data-[^=]*)=["'][^"']*["'][^>]*/gi, (m) => m.replace(/(class|id|style|data-[^=]*)=["'][^"']*["']/gi, ''))
      .trim();

    // Extract paragraphs - skip junk and promotional lines
    const JUNK = [
      /^(subscribe|sign up|newsletter|follow us|share this|click here|read more|advertisement|sponsored|related:|tags:|filed under|also read|see also|more from|you may also|don't miss|trending now|most read|popular now|breaking news alert)/i,
      /^(photo:|image:|caption:|credit:|source:|via:|originally published|copyright|all rights reserved|\(c\)|©)/i,
      /whatsapp|facebook|twitter|instagram|tiktok|youtube|telegram/i,
      /cookie|privacy policy|terms of use|gdpr/i,
    ];
    const paragraphs: string[] = [];
    const pMatches = Array.from(cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi));
    for (const m of pMatches) {
      const text = stripHtml(m[1]).trim();
      if (text.length < 40) continue;
      if (JUNK.some(r => r.test(text))) continue;
      if (PROMO_PARA_PATTERNS.some(r => r.test(text))) continue; // strip promo paragraphs
      paragraphs.push(text);
      if (paragraphs.length >= 12) break;
    }

    // Fallback: grab text from div blocks if no paragraphs found
    if (paragraphs.length === 0) {
      const divMatches = Array.from(cleanHtml.matchAll(/<div[^>]*>([\s\S]*?)<\/div>/gi));
      for (const m of divMatches) {
        const text = stripHtml(m[1]).trim();
        if (text.length > 80 && !JUNK.some(r => r.test(text))) {
          paragraphs.push(text);
          if (paragraphs.length >= 6) break;
        }
      }
    }

    const content = paragraphs.map((p) => `<p>${p}</p>`).join('\n');
    const excerpt = decodeXML(ogDesc) || paragraphs[0]?.slice(0, 250) || '';

    // If the scraped excerpt itself is brand PR, return empty to trigger rejection
    if (isPromotional('', excerpt)) {
      return { image: '', content: '', excerpt: '' };
    }

    return {
      image: ogImage.startsWith('//') ? `https:${ogImage}` : ogImage,
      content,
      excerpt,
    };
  } catch {
    return { image: '', content: '', excerpt: '' };
  }
}

const RSS_FEEDS: Array<{ url: string; name: string; category: string }> = [
  // ── NEWS — Kenya ──────────────────────────────────────────────────────────
  { url: 'https://www.nation.africa/kenya/rss.xml',              name: 'Nation Africa',         category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php',    name: 'Standard Media',        category: 'News' },
  { url: 'https://www.the-star.co.ke/rss/',                      name: 'The Star Kenya',        category: 'News' },
  { url: 'https://www.citizen.digital/feed',                     name: 'Citizen Digital',       category: 'News' },
  { url: 'https://www.capitalfm.co.ke/news/feed/',               name: 'Capital FM Kenya',      category: 'News' },
  { url: 'https://www.kbc.co.ke/feed/',                          name: 'KBC Kenya',             category: 'News' },
  { url: 'https://www.peopledailykenya.com/feed/',               name: 'People Daily Kenya',    category: 'News' },
  // ── NEWS — East Africa ────────────────────────────────────────────────────
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',         name: 'The East African',      category: 'News' },
  { url: 'https://www.monitor.co.ug/feed/',                      name: 'Daily Monitor Uganda',  category: 'News' },
  { url: 'https://www.thecitizen.co.tz/feed/',                   name: 'The Citizen Tanzania',  category: 'News' },
  { url: 'https://www.newvision.co.ug/feed/',                    name: 'New Vision Uganda',     category: 'News' },
  // ── NEWS — Africa & World ─────────────────────────────────────────────────
  { url: 'https://www.africanews.com/feed/rss2/',                name: 'Africa News',           category: 'News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml',            name: 'Al Jazeera Africa',     category: 'News' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml',                 name: 'BBC Africa',            category: 'News' },
  { url: 'https://www.vanguardngr.com/feed/',                    name: 'Vanguard Nigeria',      category: 'News' },
  { url: 'https://www.premiumtimesng.com/feed/',                 name: 'Premium Times Nigeria', category: 'News' },
  { url: 'https://www.myjoyonline.com/feed/',                    name: 'Joy Online Ghana',      category: 'News' },
  { url: 'https://www.timeslive.co.za/rss/',                     name: 'Times Live SA',         category: 'News' },
  { url: 'https://www.news24.com/rss',                           name: 'News24 SA',             category: 'News' },
  { url: 'https://www.reuters.com/rssFeed/worldNews',            name: 'Reuters World',         category: 'News' },

  // ── POLITICS ──────────────────────────────────────────────────────────────
  { url: 'https://www.nation.africa/kenya/politics/rss.xml',     name: 'Nation Politics',       category: 'Politics' },
  { url: 'https://www.standardmedia.co.ke/rss/politics.php',     name: 'Standard Politics',     category: 'Politics' },
  { url: 'https://www.the-star.co.ke/news/politics/rss/',        name: 'The Star Politics',     category: 'Politics' },
  { url: 'https://www.capitalfm.co.ke/politics/feed/',           name: 'Capital FM Politics',   category: 'Politics' },
  { url: 'https://www.citizen.digital/category/politics/feed/',  name: 'Citizen Politics',      category: 'Politics' },
  { url: 'https://www.kbc.co.ke/category/politics/feed/',        name: 'KBC Politics',          category: 'Politics' },

  // ── ENTERTAINMENT — Kenya ─────────────────────────────────────────────────
  { url: 'https://www.sde.co.ke/feed/',                          name: 'SDE Kenya',             category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/feed/',                      name: 'Ghafla Kenya',          category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/feed/',                       name: 'Mpasho',                category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/rss',                      name: 'Pulse Live Kenya',      category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/rss/',                          name: 'Tuko Kenya',            category: 'Entertainment' },
  // ── ENTERTAINMENT — Africa ────────────────────────────────────────────────
  { url: 'https://www.bellanaija.com/feed/',                     name: 'BellaNaija',            category: 'Entertainment' },
  { url: 'https://www.pulse.ng/rss',                             name: 'Pulse Nigeria',         category: 'Entertainment' },
  { url: 'https://www.pulse.com.gh/rss',                         name: 'Pulse Ghana',           category: 'Entertainment' },
  { url: 'https://www.thisisafrica.me/feed/',                    name: 'This Is Africa',        category: 'Entertainment' },
  // ── ENTERTAINMENT — Global ────────────────────────────────────────────────
  { url: 'https://variety.com/feed/',                            name: 'Variety',               category: 'Entertainment' },
  { url: 'https://deadline.com/feed/',                           name: 'Deadline Hollywood',    category: 'Entertainment' },
  { url: 'https://www.hollywoodreporter.com/feed/',              name: 'Hollywood Reporter',    category: 'Entertainment' },
  { url: 'https://ew.com/feed/',                                 name: 'Entertainment Weekly',  category: 'Entertainment' },

  // ── SPORTS — Kenya & Africa ───────────────────────────────────────────────
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',       name: 'Standard Sports',       category: 'Sports' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',       name: 'Nation Sports',         category: 'Sports' },
  { url: 'https://www.capitalfm.co.ke/sports/feed/',             name: 'Capital FM Sports',     category: 'Sports' },
  { url: 'https://www.supersport.com/rss/football',              name: 'SuperSport Football',   category: 'Sports' },
  { url: 'https://www.cafonline.com/rss',                        name: 'CAF Online',            category: 'Sports' },
  // ── SPORTS — Global ───────────────────────────────────────────────────────
  { url: 'https://www.bbc.co.uk/sport/rss.xml',                  name: 'BBC Sport',             category: 'Sports' },
  { url: 'https://www.skysports.com/rss/12040',                  name: 'Sky Sports',            category: 'Sports' },
  { url: 'https://www.espn.com/espn/rss/news',                   name: 'ESPN',                  category: 'Sports' },
  { url: 'https://www.goal.com/feeds/en/news',                   name: 'Goal.com',              category: 'Sports' },
  { url: 'https://www.fourfourtwo.com/rss',                      name: 'FourFourTwo',           category: 'Sports' },

  // ── MUSIC ─────────────────────────────────────────────────────────────────
  { url: 'https://www.capitalfm.co.ke/music/feed/',              name: 'Capital FM Music',      category: 'Music' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/',       name: 'Ghafla Music',          category: 'Music' },
  { url: 'https://www.bellanaija.com/category/music/feed/',      name: 'BellaNaija Music',      category: 'Music' },
  { url: 'https://www.pulse.ng/entertainment/music/rss',         name: 'Pulse Music Nigeria',   category: 'Music' },
  { url: 'https://pitchfork.com/rss/news',                       name: 'Pitchfork',             category: 'Music' },
  { url: 'https://www.rollingstone.com/music/feed/',             name: 'Rolling Stone Music',   category: 'Music' },
  { url: 'https://www.billboard.com/feed/',                      name: 'Billboard',             category: 'Music' },
  { url: 'https://www.nme.com/feed',                             name: 'NME',                   category: 'Music' },

  // ── LIFESTYLE ─────────────────────────────────────────────────────────────
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php',    name: 'Standard Lifestyle',    category: 'Lifestyle' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml',    name: 'Nation Lifestyle',      category: 'Lifestyle' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss',            name: 'Pulse Lifestyle Kenya', category: 'Lifestyle' },
  { url: 'https://www.tuko.co.ke/category/lifestyle/rss/',       name: 'Tuko Lifestyle',        category: 'Lifestyle' },
  { url: 'https://www.bellanaija.com/category/living/feed/',     name: 'BellaNaija Living',     category: 'Lifestyle' },
  { url: 'https://www.vogue.com/feed/rss',                       name: 'Vogue',                 category: 'Lifestyle' },
  { url: 'https://www.elle.com/rss/all.xml/',                    name: 'Elle',                  category: 'Lifestyle' },

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────
  { url: 'https://www.techweez.com/feed/',                       name: 'Techweez',              category: 'Technology' },
  { url: 'https://techcabal.com/feed/',                          name: 'TechCabal',             category: 'Technology' },
  { url: 'https://www.humanipo.com/feed/',                       name: 'HumanIPO',              category: 'Technology' },
  { url: 'https://disrupt-africa.com/feed/',                     name: 'Disrupt Africa',        category: 'Technology' },
  { url: 'https://techcrunch.com/feed/',                         name: 'TechCrunch',            category: 'Technology' },
  { url: 'https://www.theverge.com/rss/index.xml',               name: 'The Verge',             category: 'Technology' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',      name: 'Ars Technica',          category: 'Technology' },
  { url: 'https://www.wired.com/feed/rss',                       name: 'Wired',                 category: 'Technology' },
  { url: 'https://www.engadget.com/rss.xml',                     name: 'Engadget',              category: 'Technology' },

  // ── BUSINESS ─────────────────────────────────────────────────────────────
  { url: 'https://www.businessdailyafrica.com/feed/',            name: 'Business Daily Africa', category: 'Business' },
  { url: 'https://www.standardmedia.co.ke/rss/business.php',     name: 'Standard Business',     category: 'Business' },
  { url: 'https://www.nation.africa/kenya/business/rss.xml',     name: 'Nation Business',       category: 'Business' },
  { url: 'https://www.capitalfm.co.ke/business/feed/',           name: 'Capital FM Business',   category: 'Business' },
  { url: 'https://www.theeastafrican.co.ke/tea/business/rss.xml',name: 'EA Business',           category: 'Business' },
  { url: 'https://www.bloomberg.com/feeds/podcasts/etf.xml',     name: 'Bloomberg',             category: 'Business' },
  { url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',          name: 'Wall Street Journal',   category: 'Business' },
  { url: 'https://www.ft.com/rss/home/africa',                   name: 'Financial Times Africa',category: 'Business' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',name: 'CNBC Business',         category: 'Business' },

  // ── HEALTH ────────────────────────────────────────────────────────────────
  { url: 'https://www.nation.africa/kenya/health/rss.xml',       name: 'Nation Health',         category: 'Health' },
  { url: 'https://www.standardmedia.co.ke/rss/health.php',       name: 'Standard Health',       category: 'Health' },
  { url: 'https://www.who.int/rss-feeds/news-english.xml',       name: 'WHO News',              category: 'Health' },
  { url: 'https://www.medicalnewstoday.com/rss/news',            name: 'Medical News Today',    category: 'Health' },
  { url: 'https://www.healthline.com/rss/news',                  name: 'Healthline',            category: 'Health' },
  { url: 'https://www.webmd.com/rss/rss.aspx?rss=news',          name: 'WebMD',                 category: 'Health' },
  { url: 'https://www.sciencedaily.com/rss/health_medicine.xml', name: 'Science Daily Health',  category: 'Health' },

  // ── MOVIES ────────────────────────────────────────────────────────────────
  { url: 'https://www.empireonline.com/movies/feed/',            name: 'Empire Magazine',       category: 'Movies' },
  { url: 'https://www.indiewire.com/feed/',                      name: 'IndieWire',             category: 'Movies' },
  { url: 'https://collider.com/feed/',                           name: 'Collider',              category: 'Movies' },
  { url: 'https://screenrant.com/feed/',                         name: 'Screen Rant',           category: 'Movies' },
  { url: 'https://www.slashfilm.com/feed/',                      name: 'SlashFilm',             category: 'Movies' },
  { url: 'https://www.cinemablend.com/rss/news',                 name: 'CinemaBlend',           category: 'Movies' },
  { url: 'https://www.ign.com/rss/articles',                     name: 'IGN Movies',            category: 'Movies' },
  { url: 'https://www.rogerebert.com/feed',                      name: 'RogerEbert.com',        category: 'Movies' },

  // ── SCIENCE ───────────────────────────────────────────────────────────────
  { url: 'https://www.sciencedaily.com/rss/top.xml',             name: 'Science Daily',         category: 'Science' },
  { url: 'https://www.newscientist.com/feed/home/',              name: 'New Scientist',         category: 'Science' },
  { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',       name: 'NASA News',             category: 'Science' },
  { url: 'https://www.nature.com/nature.rss',                    name: 'Nature',                category: 'Science' },
  { url: 'https://feeds.nationalgeographic.com/ng/News/News_Main',name: 'National Geographic',  category: 'Science' },
  { url: 'https://www.scientificamerican.com/feed/rss/',         name: 'Scientific American',   category: 'Science' },
];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * URL-level guardrail: skip articles from known PR/brand content URL patterns.
 * These are paths that reliably indicate brand-written content.
 */
function isPromoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    u.includes('/press-release') ||
    u.includes('/press_release') ||
    u.includes('/sponsored') ||
    u.includes('/advertorial') ||
    u.includes('/partner-content') ||
    u.includes('/branded-content') ||
    u.includes('/native-ad') ||
    u.includes('/paid-post') ||
    u.includes('/brand-voice') ||
    u.includes('/prwire') ||
    u.includes('/prnewswire') ||
    u.includes('/businesswire') ||
    u.includes('/globenewswire') ||
    u.includes('/accesswire') ||
    u.includes('/einpresswire') ||
    u.includes('/newswire')
  );
}

async function fetchRSSFeed(feed: { url: string; name: string; category: string }): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();

    const items: Array<{ title: string; link: string; pubDate: string; description: string; mediaUrl: string; contentEncoded: string }> = [];
    const itemMatches = Array.from(text.matchAll(/<item>([\s\S]*?)<\/item>/g));

    for (const match of itemMatches) {
      const item = match[1];
      const title = decodeXML(item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] ?? '');
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
        ?? item.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? '';
      const description = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] ?? '';
      const contentEncoded = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/)?.[1] ?? '';

      // Try to get image from RSS item directly
      const mediaUrl =
        item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
        item.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
        item.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i)?.[1] ??
        contentEncoded.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ??
        description.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? '';

      if (!title || !link) continue;

      // URL-level guardrail: skip known PR/brand content URL patterns
      if (isPromoUrl(link)) continue;

      // Early title check before scraping (saves bandwidth)
      if (isPromotional(title, decodeXML(stripHtml(description)).slice(0, 300))) continue;

      items.push({ title, link, pubDate, description, mediaUrl, contentEncoded });
      if (items.length >= 10) break;
    }

    // Scrape each article page for og:image + content (in parallel, max 10)
    const articles = await Promise.all(
      items.map(async (item): Promise<Article> => {
        const scraped = await scrapeArticlePage(item.link);
        const imageUrl = scraped.image || item.mediaUrl || '';
        const excerpt = scraped.excerpt || decodeXML(stripHtml(item.description)).slice(0, 250);
        // Use content:encoded body if available, else scraped content
        const rawBody = item.contentEncoded || scraped.content || '';
        const content = rawBody ? cleanPromotionalContent(rawBody) : `<p>${excerpt}</p>`;
        const publishedAt = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
        const slug = slugify(`${item.title}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`);

        return {
          slug,
          title: decodeXML(item.title),
          excerpt,
          content,
          category: feed.category,
          tags: [],
          imageUrl,
          sourceUrl: item.link,
          sourceName: feed.name,
          publishedAt,
        };
      })
    );

    return articles.filter((a) =>
      a.imageUrl &&
      !isPromotional(a.title, a.excerpt) &&   // Level 1: title/excerpt check
      !isBodyPromotional(a.content)            // Level 2: body PR density check
    );
  } catch {
    return [];
  }
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSSFeed));
    const incoming: Article[] = [];
    for (const r of results) {
      if (r.status === 'fulfilled') incoming.push(...r.value);
    }
    if (incoming.length === 0) return;

    const existing = await getArticles(env);
    const existingUrls = new Set(existing.map((a) => a.sourceUrl));
    const newArticles = incoming.filter((a) => !existingUrls.has(a.sourceUrl));
    if (newArticles.length === 0) return;

    const merged = [...newArticles, ...existing]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 2000);

    await saveArticles(env, merged);

    if (env.VERCEL_URL) {
      try {
        await fetch(`${env.VERCEL_URL}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.WORKER_SECRET}` },
          body: JSON.stringify({ path: '/' }),
        });
      } catch { /* non-critical */ }
    }
  },

  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS });

    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (path === '/articles' && method === 'GET') {
      const category = url.searchParams.get('category');
      const sort = url.searchParams.get('sort') ?? 'recent';
      const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
      let articles = await getArticles(env);
      if (category) articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
      if (sort === 'trending') {
        articles = articles.map((a) => ({ ...a, trendingScore: trendingScore(a) })).sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0));
      } else {
        articles = articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
      return json(articles.slice(offset, offset + limit));
    }

    const articleMatch = path.match(/^\/articles\/(.+)$/);
    if (articleMatch && method === 'GET') {
      const slug = articleMatch[1];
      const articles = await getArticles(env);
      const article = articles.find((a) => a.slug === slug);
      if (!article) return json({ error: 'Not found' }, 404);
      return json(article);
    }

    if (path === '/articles' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      let incoming: Article[];
      try {
        incoming = await req.json() as Article[];
        if (!Array.isArray(incoming)) throw new Error('Expected array');
      } catch { return json({ error: 'Invalid body' }, 400); }

      const existing = await getArticles(env);
      const existingUrls = new Set(existing.map((a) => a.sourceUrl));
      let saved = 0, skipped = 0;
      for (const article of incoming) {
        if (existingUrls.has(article.sourceUrl)) { skipped++; }
        else { existing.push(article); existingUrls.add(article.sourceUrl); saved++; }
      }
      const sorted = existing.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      await saveArticles(env, sorted.slice(0, 2000));
      return json({ saved, skipped });
    }

    // ── POST /refresh — manually trigger RSS fetch ─────────────────────────
    if (path === '/refresh' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSSFeed));
      const incoming: Article[] = [];
      for (const r of results) {
        if (r.status === 'fulfilled') incoming.push(...r.value);
      }
      const existing = await getArticles(env);
      const existingUrlMap = new Map(existing.map((a) => [a.sourceUrl, a]));

      // New articles not yet in KV
      const newArticles = incoming.filter((a) => !existingUrlMap.has(a.sourceUrl));

      // Patch existing articles that are missing images
      let patched = 0;
      for (const inc of incoming) {
        const ex = existingUrlMap.get(inc.sourceUrl);
        if (ex && !ex.imageUrl && inc.imageUrl) {
          ex.imageUrl = inc.imageUrl;
          if (!ex.content && inc.content) ex.content = inc.content;
          if (!ex.excerpt && inc.excerpt) ex.excerpt = inc.excerpt;
          patched++;
        }
      }

      const merged = [...newArticles, ...existing]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 2000);
      await saveArticles(env, merged);
      return json({ fetched: incoming.length, saved: newArticles.length, patched, total: merged.length });
    }

    // ── POST /purge-no-image — remove articles without images ──────────────
    if (path === '/purge-no-image' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const existing = await getArticles(env);
      const before = existing.length;
      const clean = existing.filter((a) => a.imageUrl && a.imageUrl.length > 5);
      await saveArticles(env, clean);
      return json({ before, after: clean.length, removed: before - clean.length });
    }

    // ── POST /purge-promo — remove promotional articles from KV ───────────
    if (path === '/purge-promo' && method === 'POST') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const existing = await getArticles(env);
      const before = existing.length;
      const clean = existing.filter((a) =>
        !isPromotional(a.title, a.excerpt) &&
        !isBodyPromotional(a.content)
      );
      await saveArticles(env, clean);
      return json({ before, after: clean.length, removed: before - clean.length });
    }

    if (path === '/views' && method === 'POST') {
      let body: { slug?: string };
      try { body = await req.json() as { slug?: string }; } catch { return json({ error: 'Invalid body' }, 400); }
      const slug = body.slug;
      if (!slug) return json({ error: 'slug required' }, 400);
      const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
      const rateLimitKey = `rl:${slug}:${ip}`;
      const alreadyViewed = await env.PPP_TV_KV.get(rateLimitKey);
      if (!alreadyViewed) {
        await env.PPP_TV_KV.put(rateLimitKey, '1', { expirationTtl: 3600 });
        const views = await incrementViews(env, slug);
        return json({ slug, views });
      }
      return json({ slug, views: await getViews(env, slug) });
    }

    const viewsMatch = path.match(/^\/views\/(.+)$/);
    if (viewsMatch && method === 'GET') {
      const slug = viewsMatch[1];
      return json({ slug, views: await getViews(env, slug) });
    }

    if (path === '/trending' && method === 'GET') {
      const sevenDaysAgo = Date.now() - 7 * 24 * 3_600_000;
      const articles = await getArticles(env);
      const scored = articles
        .filter((a) => new Date(a.publishedAt).getTime() > sevenDaysAgo && a.imageUrl)
        .map((a) => ({ ...a, trendingScore: trendingScore(a) }))
        .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
        .slice(0, 10);
      return json(scored);
    }

    if (path === '/search' && method === 'GET') {
      const q = url.searchParams.get('q')?.toLowerCase().trim();
      if (!q) return json([]);
      const articles = await getArticles(env);
      const results = articles
        .filter((a) => `${a.title} ${a.excerpt} ${a.category} ${a.tags.join(' ')}`.toLowerCase().includes(q))
        .slice(0, 20);
      return json(results);
    }

    if (path === '/subscribe' && method === 'POST') {
      let body: { email?: string };
      try { body = await req.json() as { email?: string }; } catch { return json({ error: 'Invalid body' }, 400); }
      const email = body.email?.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email' }, 400);
      const existing = await env.PPP_TV_KV.get(`sub:${email}`);
      if (existing) return json({ message: 'Already subscribed.' });
      await env.PPP_TV_KV.put(`sub:${email}`, JSON.stringify({ email, subscribedAt: new Date().toISOString() }));
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      await env.PPP_TV_KV.put('subscriber_count', String((countRaw ? parseInt(countRaw, 10) : 0) + 1));
      return json({ message: 'Subscribed successfully.' });
    }

    if (path === '/analytics' && method === 'GET') {
      if (!isAuthed(req, env)) return json({ error: 'Unauthorized' }, 401);
      const articles = await getArticles(env);
      const countRaw = await env.PPP_TV_KV.get('subscriber_count');
      const withViews = await Promise.all(articles.slice(0, 50).map(async (a) => ({ slug: a.slug, views: await getViews(env, a.slug), lastViewed: a.publishedAt })));
      const topArticles = withViews.sort((a, b) => b.views - a.views).slice(0, 10);
      return json({ totalViews: withViews.reduce((s, a) => s + a.views, 0), topArticles, subscriberCount: countRaw ? parseInt(countRaw, 10) : 0 });
    }

    // ── GET /feed — social-media-ready article feed for auto-news-station ─
    if (path === '/feed' && method === 'GET') {
      const category = url.searchParams.get('category');
      const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20', 10), 50);
      const since = url.searchParams.get('since'); // ISO date string
      let articles = await getArticles(env);
      if (category) articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
      if (since) articles = articles.filter((a) => new Date(a.publishedAt) > new Date(since));
      articles = articles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);

      const SITE = 'https://ppp-tv-site.vercel.app';
      const WORKER = 'https://ppp-tv-worker.euginemicah.workers.dev';

      const feed = articles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        sourceName: a.sourceName,
        sourceUrl: a.sourceUrl,
        publishedAt: a.publishedAt,
        articleUrl: `${SITE}/news/${a.slug}`,
        imageUrl: a.imageUrl ? `${WORKER}/img?url=${encodeURIComponent(a.imageUrl)}` : '',
        imageUrlDirect: a.imageUrl,
        // Pre-formatted social captions
        twitterCaption: `${a.title}\n\n${a.excerpt?.slice(0, 120) ?? ''}\n\n${SITE}/news/${a.slug}\n\n#PPPTVKenya #${a.category.replace(/\s+/g, '')}`,
        facebookCaption: `${a.title}\n\n${a.excerpt ?? ''}\n\nRead more: ${SITE}/news/${a.slug}`,
        instagramCaption: `${a.title}\n\n${a.excerpt ?? ''}\n\n🔗 Link in bio\n\n#PPPTVKenya #Kenya #${a.category.replace(/\s+/g, '')} #KenyaNews #AfricaNews`,
      }));

      return json({ articles: feed, total: feed.length, generatedAt: new Date().toISOString() });
    }

    // ── GET /img?url=... — image proxy to bypass hotlink protection ───────
    if (path === '/img' && method === 'GET') {
      const imgUrl = url.searchParams.get('url');
      if (!imgUrl) return new Response('Missing url', { status: 400 });
      try {
        const res = await fetch(imgUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)', 'Accept': 'image/*' },
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return new Response('Image fetch failed', { status: 502 });
        const ct = res.headers.get('content-type') ?? 'image/jpeg';
        return new Response(res.body, {
          headers: {
            'Content-Type': ct,
            'Cache-Control': 'public, max-age=86400',
            ...CORS_HEADERS,
          },
        });
      } catch {
        return new Response('Image proxy error', { status: 502 });
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
