/// <reference path="./types.d.ts" />

// ─── ENV ─────────────────────────────────────────────────────────────────────
export interface Env {
  PPP_TV_KV:             KVNamespace;
  WORKER_SECRET:         string;
  VERCEL_URL?:           string;
  GEMINI_API_KEY?:       string;
  NVIDIA_API_KEY?:       string;
  SUPABASE_URL?:         string;
  SUPABASE_SERVICE_KEY?: string;
  AUTOMATE_SECRET?:      string; // Bearer token for auto-news-station ingest
  PUSH_SECRET?:          string;
}

// ─── SECURITY HEADERS ────────────────────────────────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options':           'DENY',
  'X-Content-Type-Options':    'nosniff',
  'Referrer-Policy':           'strict-origin-when-cross-origin',
  'Permissions-Policy':        'camera=(), microphone=(), geolocation=()',
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function cors(res: Response): Response {
  const h = new Headers(res.headers);
  for (const [k, v] of Object.entries({ ...CORS_HEADERS, ...SECURITY_HEADERS })) h.set(k, v);
  return new Response(res.body, { status: res.status, headers: h });
}

function json(data: unknown, status = 200): Response {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

function isAuthed(req: Request, env: Env): boolean {
  return req.headers.get('Authorization') === `Bearer ${env.WORKER_SECRET}`;
}

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, number[]>();
function checkRateLimit(ip: string, limitPerMinute = 60): boolean {
  const now = Date.now();
  const window = 60_000;
  const hits = (rateLimitMap.get(ip) ?? []).filter(t => now - t < window);
  if (hits.length >= limitPerMinute) return false;
  hits.push(now);
  rateLimitMap.set(ip, hits);
  return true;
}

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface RawArticle {
  slug:        string;
  title:       string;
  excerpt:     string;
  content:     string;
  category:    string;
  imageUrl:    string;
  sourceUrl:   string;
  sourceName:  string;
  publishedAt: string;
}

interface ProcessedArticle extends RawArticle {
  rewrittenTitle:   string;
  rewrittenExcerpt: string;
  rewrittenBody:    string;
  pptvVerdict:      string;
  subcategory:      string;
  tags:             string[];
  languageDetected: string;
  rewrittenAt:      string;
  views:            number;
  trendingScore:    number;
}

interface GeminiOutput {
  rewritten_title:   string;
  rewritten_excerpt: string;
  rewritten_body:    string;
  pptv_verdict:      string;
  subcategory:       string;
  tags:              string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function decodeXML(str: string): string {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#8216;|&#8217;|&#x2019;/g, "'")
    .replace(/&#8220;|&#8221;|&#x201C;|&#x201D;/g, '"')
    .replace(/&#8211;|&#x2013;/g, '–').replace(/&#8212;|&#x2014;/g, '—')
    .replace(/&#8230;|&#x2026;/g, '…').replace(/&#038;/g, '&')
    .replace(/&#\d+;/g, m => { try { return String.fromCharCode(parseInt(m.slice(2,-1),10)); } catch { return m; } })
    .replace(/\(tm\)/g, '™').replace(/\(r\)/g, '®').trim();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function calcTrendingScore(views: number, publishedAt: string): number {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  return views / Math.pow(ageHours + 2, 1.5);
}

// ─── PROMOTIONAL & ADVERTISING GUARDRAILS ────────────────────────────────────
// Betting / gambling companies — hard block
const BETTING_PATTERNS: RegExp[] = [
  /\b(sportpesa|betway|bet365|1xbet|betin|mozzartbet|odibets|betika|premiumbets|parimatch|22bet|melbet|betmaster|hollywoodbets|sunbet|supabets|betfred|ladbrokes|william hill|paddy power|coral|unibet|bwin|draftkings|fanduel|pointsbet|betmgm|caesars sportsbook|barstool sportsbook)\b/i,
  /\b(aviator|jetx|crash game|lucky jet|mines game|plinko|spaceman)\b.{0,60}\b(bet|play|win|earn|deposit|bonus)\b/i,
  /\b(betting (company|site|platform|app|bonus|odds|tips|prediction)|sports betting|online betting|mobile betting)\b/i,
  /\b(casino|poker|slots|roulette|blackjack|baccarat|jackpot|free spins|welcome bonus|deposit bonus|no deposit)\b/i,
  /\b(odds|accumulator|parlay|handicap|over.under|both teams to score|correct score)\b.{0,40}\b(bet|wager|stake|punt)\b/i,
  /\b(bet (now|today|here)|place (a |your )?bet|sign up (and|to) (bet|win)|claim (your|a) bonus|get (your|a) free bet)\b/i,
  /\b(gambling|gamble|wager|wagering|bookmaker|bookie|sportsbook)\b/i,
  /\b(pepeta|betpawa|kwikbet|shabiki|cheza|lotto|lottery|scratch card|instant win)\b/i,
];

// Unauthorized brand advertising — companies doing free marketing on PPP TV
const BRAND_AD_PATTERNS: RegExp[] = [
  /\b(launches?|unveils?|introduces?|announces?|debuts?|rolls? out|now available|on sale now|buy now|shop now|order now)\b.{0,60}\b(product|collection|range|line|model|edition|version|app|service|platform|solution|device|gadget)\b/i,
  /\b(win a|giveaway|contest|sweepstake|raffle|promo code|discount code|coupon|voucher|free gift|limited offer|exclusive deal|flash sale|special offer|up to \d+% off|save \d+%)\b/i,
  /\b(partners? with|in partnership with|powered by|brought to you by|supported by|presented by|in association with|sponsored by)\b/i,
  /\b(press release|media release|official statement|for immediate release|pr newswire|business wire|globe newswire|accesswire|einpresswire)\b/i,
  /\b(we.re hiring|join our team|career opportunity|job opening|apply now|vacancy|now recruiting)\b/i,
  /\b(download (our|the) app|available on (app store|google play|play store)|get (it|the app) (now|today|free))\b/i,
  /\b(subscribe (now|today|for free)|sign up (now|today|for free)|register (now|today|for free)|create (a |an )?account)\b/i,
  /\b(mikano|changan|toyota|nissan|honda|ford|bmw|mercedes|audi|volkswagen|hyundai|kia|suzuki|mitsubishi)\b.{0,80}\b(launches?|unveils?|introduces?|announces?|new model|new car|price|buy|purchase|test drive)\b/i,
  /\b(safaricom|airtel|telkom|faiba|zuku|startimes|dstv|gotv)\b.{0,80}\b(offer|deal|promotion|bundle|package|discount|free|bonus|upgrade)\b/i,
  /\b(equity bank|kcb|co-op bank|absa|stanbic|ncba|family bank|dtb|i&m)\b.{0,80}\b(offer|loan|interest|rate|product|service|account|apply)\b/i,
];

const PROMO_TITLE_PATTERNS: RegExp[] = [
  /\b(sponsored|advertorial|advertisement|paid post|paid content|partner content|branded content|native ad|promoted|promotion)\b/i,
  /\b(press release|media release|official statement|for immediate release|pr newswire|business wire|globe newswire)\b/i,
  /\bwritten by\s+[A-Z][a-zA-Z\s]+(cosmetics?|beauty|brand|company|corp|ltd|inc|group|holdings?|enterprises?|solutions?|technologies?|services?|media|ventures?|studios?|productions?|entertainment)\b/i,
  /\b(launches?|unveils?|introduces?|announces?|debuts?|renews?|greenlights?|orders?|picks? up|rolls? out)\b.{0,80}\b(show|series|season|episode|special|pilot|spinoff|reboot|franchise|slate|syndication|deal|partnership)\b/i,
  /\b(CBS|NBC|ABC|FOX|HBO|Netflix|Disney|Warner|Paramount|Sony|Universal|Amazon|Apple|Hulu|Peacock|Showtime|Starz)\b.{0,60}\b(announces?|launches?|renews?|orders?|greenlights?|picks? up|debuts?|unveils?|confirms?)\b/i,
  /\b(syndication|syndicated|fall slate|upfront|scatter market|first-run|off-network|distribution deal|content deal|licensing deal)\b/i,
  /\b(launches?|unveils?|introduces?|announces?|debuts?|rolls? out|now available|on sale now|buy now|shop now|order now|get yours?)\b.{0,60}\b(product|collection|range|line|model|edition|version|app|service|platform|solution)\b/i,
  /\b(win a|giveaway|contest|sweepstake|raffle|promo code|discount code|coupon|voucher|free gift|limited offer|exclusive deal|flash sale|special offer|up to \d+% off)\b/i,
  /\b(partners? with|in partnership with|powered by|brought to you by|supported by|presented by|in association with)\b/i,
  /\b(hosts?|sponsors?|donates?|gifts?|empowers?|supports?)\b.{0,80}\b(widows?|orphans?|community|women|youth|children|families)\b.{0,120}\b(cosmetics?|beauty|brand|company|corp|ltd|inc|group)\b/i,
  /\b(we.re hiring|join our team|career opportunity|job opening|apply now|vacancy)\b/i,
  /the post .{0,120} appeared first on/i,
  /\b(as part of|part of (its|their|the) (fall|spring|summer|winter) (slate|lineup|schedule|programming))\b/i,
  /\b(executive produced by|showrunner|co-produced by|produced in association with)\b.{0,120}\b(network|studio|media|ventures?|productions?)\b/i,
];

const PROMO_BODY_SIGNALS: RegExp[] = [
  /\bwritten by\s+[A-Z]/i,
  /\bthe post .{0,120} appeared first on\b/i,
  /\bthis (article|post|content|story) (is|was) (sponsored|paid|brought|supported|presented)\b/i,
  /\b(founder|ceo|chief executive|managing director|president)\b.{0,120}\b(said|stated|noted|added|commented)\b.{0,200}\b(brand|company|product|mission|vision|commitment|initiative)\b/i,
  /\b(our (mission|vision|commitment|purpose|belief|values?)|the brand.s (mission|vision|commitment|purpose))\b/i,
  /\b(remains? committed to|reinforcing (its|our) (mission|commitment|belief)|using (its|our) platform)\b/i,
  /\b(available (now|online|at|from|in stores?)|purchase (at|from|online)|order (at|from|online))\b/i,
  /\b(leading (brand|company|manufacturer|provider|platform)|award.winning (brand|product|service))\b/i,
  /the post .{0,80} appeared first on .{0,80}\. read (today|now|more)/i,
  /\b(as part of (its|their|the) (fall|spring|summer|winter) (slate|lineup|schedule|programming))\b/i,
  /\b(syndication|syndicated deal|distribution deal|content deal|licensing agreement)\b/i,
  /\b(executive producer|showrunner|series regular|recurring role|guest star)\b.{0,120}\b(announced|confirmed|revealed|set to|tapped to)\b/i,
];

const PROMO_PARA_PATTERNS: RegExp[] = [
  /\b(this (article|post|content|story) (is|was) (sponsored|paid|brought|supported|presented)|sponsored by|advertisement|advertorial)\b/i,
  /\b(click here to (buy|order|shop|get|download|sign up|register|subscribe)|buy now|shop now|order now|get yours?|add to cart|limited (time|stock)|while stocks? last)\b/i,
  /\b(use (code|promo|coupon|discount code)|promo code|coupon code|discount code|voucher code|get \d+% off|save \d+%|free shipping)\b/i,
  /\b(in partnership with|powered by|brought to you by|supported by|presented by|in association with|affiliate (link|disclosure)|this post (contains?|includes?) affiliate)\b/i,
  /\b(available (now|online|at|from|in stores?)|purchase (at|from|online)|order (at|from|online)|visit (our|the) (website|store|shop)|follow us (on|at)|subscribe (to|for) (our|the))\b/i,
  /\b(follow (us|me|them) on (instagram|twitter|facebook|tiktok|youtube|x)|like (our|the) (page|account)|join (our|the) (community|group|channel))\b/i,
  /the post .{0,120} appeared first on/i,
  /\b(remains? committed to|reinforcing (its|our) (mission|commitment)|using (its|our) platform and resources)\b/i,
  /\b(founder|ceo|chief executive|managing director)\b.{0,60}\b(said|stated|noted|added)\b.{0,200}\b(brand|mission|commitment|initiative|empower)\b/i,
  /^written by\s+/i,
];

function isPromotional(title: string, excerpt: string): boolean {
  const combined = `${title} ${excerpt}`;
  return PROMO_TITLE_PATTERNS.some(r => r.test(combined))
    || BETTING_PATTERNS.some(r => r.test(combined))
    || BRAND_AD_PATTERNS.some(r => r.test(combined));
}

function isBodyPromotional(content: string): boolean {
  if (!content) return false;
  const text = stripHtml(content);
  // Hard block: any betting/gambling mention in body
  if (BETTING_PATTERNS.some(r => r.test(text))) return true;
  return PROMO_BODY_SIGNALS.filter(r => r.test(text)).length >= 3;
}

function cleanPromotionalContent(html: string): string {
  if (!html) return html;
  return html.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, inner) => {
    const text = stripHtml(inner).trim();
    return PROMO_PARA_PATTERNS.some(r => r.test(text)) ? '' : match;
  });
}

function isPromoUrl(url: string): boolean {
  const u = url.toLowerCase();
  return ['/press-release','/press_release','/sponsored','/advertorial','/partner-content',
    '/branded-content','/native-ad','/paid-post','/brand-voice','/prwire',
    '/prnewswire','/businesswire','/globenewswire','/accesswire','/einpresswire','/newswire',
  ].some(p => u.includes(p));
}

// ─── LANGUAGE DETECTION & TRANSLATION ────────────────────────────────────────
function detectLanguageHeuristic(text: string): string {
  const t = text.toLowerCase();
  // Swahili markers
  if (/\b(na|ya|wa|kwa|ni|pia|lakini|hata|zaidi|sasa|bado|tena|pia|au|kama|bila|baada|kabla|wakati|jinsi|kwamba|ambaye|ambao|ambavyo)\b/.test(t)) return 'sw';
  // French markers
  if (/\b(le|la|les|de|du|des|un|une|et|est|dans|pour|avec|sur|par|que|qui|ce|se|au|aux|en|il|elle|ils|elles|nous|vous|je|tu)\b/.test(t)) return 'fr';
  // Arabic markers
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Portuguese markers
  if (/\b(de|da|do|das|dos|em|no|na|nos|nas|um|uma|e|é|que|se|por|para|com|uma|não|mais|como|mas|seu|sua)\b/.test(t)) return 'pt';
  return 'en';
}

async function detectAndTranslate(text: string, env: Env): Promise<{ text: string; lang: string }> {
  const lang = detectLanguageHeuristic(text);
  if (lang === 'en') return { text, lang };
  // Use Gemini to translate, fall back to NVIDIA, fall back to original
  const prompt = `Translate the following ${lang === 'sw' ? 'Swahili' : lang === 'fr' ? 'French' : lang === 'ar' ? 'Arabic' : 'Portuguese'} text to English. Return ONLY the translated text, nothing else:\n\n${text}`;
  const translated = await callAI(prompt, env, true);
  return { text: translated ?? text, lang };
}

// ─── AI REWRITER — GEMINI + NVIDIA FALLBACK ───────────────────────────────────
function buildRewritePrompt(article: RawArticle, translatedBody: string): string {
  const subcatMap: Record<string, string> = {
    Entertainment: 'celebrity, music, movies-tv, fashion, comedy, awards, events, kenyan-celebs, afrobeats, east-africa-ent',
    Sports:        'football, basketball, athletics, rugby, boxing-mma, kenyan-sports, cricket, tennis, formula1, african-sports',
    Technology:    'tech-news, ai-innovation, african-tech, gaming, smartphones, startups, cybersecurity, social-media, fintech, gadgets',
    Lifestyle:     'fashion, beauty, health, food, travel, relationships, fitness, home, parenting, wellness',
    Swahili:       'kenya, tanzania, uganda, michezo, burudani, siasa, uchumi, afya, elimu, teknolojia',
  };
  const subcatOptions = subcatMap[article.category] ?? 'general';
  const bodyText = translatedBody || article.excerpt || article.title;

  return `You are a Gen Z journalist writing for PPP TV Kenya — East Africa's #1 entertainment platform. Your audience is 18-35 year olds across Kenya, Tanzania, Uganda, Nigeria, and globally.

TASK: Rewrite the following ${article.category} article into a COMPLETE, FULL-LENGTH story. The rewritten_body MUST be at least 4 paragraphs and at least 300 words. If the source content is thin or incomplete, EXPAND it using your knowledge of the topic — add context, background, quotes (clearly attributed as "according to reports"), and analysis. Make it a complete, satisfying read.

RULES:
- DO NOT mention the source publication name
- DO NOT include betting, gambling, or brand advertising content  
- DO NOT truncate or cut the story short
- KEEP the exact category: ${article.category}
- Write in punchy Gen Z voice — bold, factual, exciting

ARTICLE CATEGORY: ${article.category}
ARTICLE TITLE: ${article.title}
ARTICLE BODY: ${bodyText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "rewritten_title": "catchy Gen Z headline under 80 chars",
  "rewritten_excerpt": "2-sentence hook that makes you want to read more, under 160 chars",
  "rewritten_body": "FULL article in HTML paragraphs (<p> tags), minimum 4 paragraphs, 300+ words, Gen Z voice, complete story with context and analysis",
  "pptv_verdict": "PPP TV's hot take in 1 punchy sentence",
  "subcategory": "one of: ${subcatOptions}",
  "tags": ["tag1","tag2","tag3","tag4","tag5"]
}`;
}

function validateGeminiOutput(obj: unknown): obj is GeminiOutput {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  if (typeof o.rewritten_title !== 'string' || !o.rewritten_title.trim()) return false;
  if (typeof o.rewritten_excerpt !== 'string' || !o.rewritten_excerpt.trim()) return false;
  if (typeof o.rewritten_body !== 'string' || !o.rewritten_body.trim()) return false;
  if (typeof o.pptv_verdict !== 'string' || !o.pptv_verdict.trim()) return false;
  if (typeof o.subcategory !== 'string' || !o.subcategory.trim()) return false;
  if (!Array.isArray(o.tags) || o.tags.length !== 5) return false;
  return true;
}

/** Call Gemini. Returns text response or null on failure. */
async function callGemini(prompt: string, env: Env): Promise<string | null> {
  if (!env.GEMINI_API_KEY) return null;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: AbortSignal.timeout(25000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

/** Call NVIDIA NIM (llama-3.1-nemotron-ultra or mixtral). Returns text or null. */
async function callNvidia(prompt: string, env: Env): Promise<string | null> {
  if (!env.NVIDIA_API_KEY) return null;
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) return null;
    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data?.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

/** Try Gemini first, fall back to NVIDIA. Returns raw text or null. */
async function callAI(prompt: string, env: Env, plainText = false): Promise<string | null> {
  const geminiResult = await callGemini(prompt, env);
  if (geminiResult) return geminiResult;
  // Gemini failed — try NVIDIA
  const nvidiaResult = await callNvidia(prompt, env);
  return nvidiaResult ?? null;
}

async function rewriteWithAI(article: RawArticle, translatedBody: string, env: Env): Promise<GeminiOutput | null> {
  const prompt = buildRewritePrompt(article, translatedBody);
  const raw = await callAI(prompt, env);
  if (!raw) return null;
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch?.[1] ?? raw;
  try {
    const parsed = JSON.parse(jsonStr.trim());
    return validateGeminiOutput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
function supabaseHeaders(env: Env): Record<string, string> {
  return {
    'apikey':        env.SUPABASE_SERVICE_KEY ?? '',
    'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY ?? ''}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=minimal',
  };
}

async function getExistingSlugs(env: Env): Promise<Set<string>> {
  if (!env.SUPABASE_URL) return new Set();
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/articles?select=slug&limit=2000`, {
      headers: supabaseHeaders(env),
    });
    if (!res.ok) return new Set();
    const rows = await res.json() as Array<{ slug: string }>;
    return new Set(rows.map(r => r.slug));
  } catch { return new Set(); }
}

async function saveArticleToSupabase(env: Env, article: ProcessedArticle): Promise<boolean> {
  if (!env.SUPABASE_URL) return false;
  const h = { ...supabaseHeaders(env), 'Prefer': 'resolution=merge-duplicates,return=minimal' };
  const body = JSON.stringify({
    slug:              article.slug,
    original_title:    article.title,
    rewritten_title:   article.rewrittenTitle,
    rewritten_excerpt: article.rewrittenExcerpt,
    rewritten_body:    article.rewrittenBody,
    pptv_verdict:      article.pptvVerdict,
    category:          article.category,
    subcategory:       article.subcategory,
    tags:              article.tags,
    image_url:         article.imageUrl,
    source_name:       article.sourceName,
    source_url:        article.sourceUrl,
    published_at:      article.publishedAt,
    rewritten_at:      article.rewrittenAt,
    language_detected: article.languageDetected,
    views:             article.views,
    trending_score:    article.trendingScore,
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${env.SUPABASE_URL}/rest/v1/articles`, {
        method: 'POST', headers: h, body,
      });
      if (res.ok || res.status === 409) return true;
    } catch { /* retry */ }
  }
  return false;
}

async function getArticlesFromSupabase(env: Env, opts: {
  category?: string; subcategory?: string; sort?: string;
  limit?: number; offset?: number; search?: string;
}): Promise<ProcessedArticle[]> {
  if (!env.SUPABASE_URL) return [];
  const params = new URLSearchParams();
  params.set('select', '*');
  if (opts.category)    params.set('category', `eq.${opts.category}`);
  if (opts.subcategory) params.set('subcategory', `eq.${opts.subcategory}`);
  if (opts.search)      params.set('rewritten_title', `ilike.*${opts.search}*`);
  params.set('order', opts.sort === 'trending' ? 'trending_score.desc' : 'published_at.desc');
  params.set('limit',  String(opts.limit  ?? 20));
  params.set('offset', String(opts.offset ?? 0));
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/articles?${params}`, {
      headers: supabaseHeaders(env),
    });
    if (!res.ok) return [];
    const rows = await res.json() as Array<Record<string, unknown>>;
    return rows.map(r => ({
      slug:              (r.slug as string) || '',
      title:             ((r.rewritten_title || r.original_title) as string) || '',
      rewrittenTitle:    (r.rewritten_title as string) || '',
      rewrittenExcerpt:  (r.rewritten_excerpt as string) || '',
      rewrittenBody:     (r.rewritten_body as string) || '',
      pptvVerdict:       (r.pptv_verdict as string) || '',
      category:          (r.category as string) || 'Entertainment',
      subcategory:       (r.subcategory as string) || '',
      tags:              Array.isArray(r.tags) ? r.tags as string[] : [],
      imageUrl:          (r.image_url as string) || '',
      sourceName:        (r.source_name as string) || 'PPP TV Kenya',
      sourceUrl:         (r.source_url as string) || '',
      publishedAt:       (r.published_at as string) || new Date().toISOString(),
      rewrittenAt:       (r.rewritten_at as string) || '',
      languageDetected:  (r.language_detected as string) || 'en',
      views:             (r.views as number) || 0,
      trendingScore:     (r.trending_score as number) || 0,
      excerpt:           (r.rewritten_excerpt as string) || '',
      content:           (r.rewritten_body as string) || '',
    }));
  } catch { return []; }
}

async function incrementViewsInSupabase(env: Env, slug: string): Promise<void> {
  if (!env.SUPABASE_URL) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/increment_views`, {
      method: 'POST',
      headers: supabaseHeaders(env),
      body: JSON.stringify({ article_slug: slug }),
    });
  } catch { /* best effort */ }
}

// KV fallback for views (when Supabase not configured)
async function incrementViewsKV(env: Env, slug: string): Promise<number> {
  const raw = await env.PPP_TV_KV.get(`views:${slug}`);
  const next = (raw ? parseInt(raw, 10) : 0) + 1;
  await env.PPP_TV_KV.put(`views:${slug}`, String(next));
  return next;
}

// ─── RSS FEEDS — Entertainment / Sports / Technology / Lifestyle ─────────────
const RSS_FEEDS: Array<{ url: string; name: string; category: string }> = [
  // ── ENTERTAINMENT — Kenya ──────────────────────────────────────────────────
  { url: 'https://www.sde.co.ke/feed/',                               name: 'SDE Kenya',              category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/feed/',                           name: 'Ghafla Kenya',           category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/feed/',                            name: 'Mpasho',                 category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/rss',                           name: 'Pulse Live Kenya',       category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/rss/',                               name: 'Tuko Kenya',             category: 'Entertainment' },
  { url: 'https://www.capitalfm.co.ke/entertainment/feed/',           name: 'Capital FM Ent',         category: 'Entertainment' },
  { url: 'https://www.nairobishades.com/feed/',                       name: 'Nairobi Shades',         category: 'Entertainment' },
  { url: 'https://www.standardmedia.co.ke/rss/entertainment.php',    name: 'Standard Entertainment', category: 'Entertainment' },
  { url: 'https://www.nation.africa/kenya/entertainment/rss.xml',    name: 'Nation Entertainment',   category: 'Entertainment' },
  { url: 'https://www.the-star.co.ke/entertainment/rss/',            name: 'The Star Entertainment', category: 'Entertainment' },
  // ── ENTERTAINMENT — East Africa ────────────────────────────────────────────
  { url: 'https://www.bellanaija.com/feed/',                          name: 'BellaNaija',             category: 'Entertainment' },
  { url: 'https://www.pulse.ng/rss',                                  name: 'Pulse Nigeria',          category: 'Entertainment' },
  { url: 'https://www.pulse.com.gh/rss',                              name: 'Pulse Ghana',            category: 'Entertainment' },
  { url: 'https://www.thisisafrica.me/feed/',                         name: 'This Is Africa',         category: 'Entertainment' },
  { url: 'https://www.channel24.co.za/feed/',                         name: 'Channel24 SA',           category: 'Entertainment' },
  { url: 'https://www.timeslive.co.za/entertainment/rss/',            name: 'Times Live Ent',         category: 'Entertainment' },
  { url: 'https://www.drum.co.za/feed/',                              name: 'Drum Magazine',          category: 'Entertainment' },
  // ── ENTERTAINMENT — Global ─────────────────────────────────────────────────
  { url: 'https://variety.com/feed/',                                 name: 'Variety',                category: 'Entertainment' },
  { url: 'https://deadline.com/feed/',                                name: 'Deadline Hollywood',     category: 'Entertainment' },
  { url: 'https://ew.com/feed/',                                      name: 'Entertainment Weekly',   category: 'Entertainment' },
  { url: 'https://www.hollywoodreporter.com/feed/',                   name: 'Hollywood Reporter',     category: 'Entertainment' },
  { url: 'https://www.rollingstone.com/music/feed/',                  name: 'Rolling Stone Music',    category: 'Entertainment' },
  { url: 'https://www.billboard.com/feed/',                           name: 'Billboard',              category: 'Entertainment' },
  { url: 'https://pitchfork.com/rss/news',                            name: 'Pitchfork',              category: 'Entertainment' },
  { url: 'https://www.nme.com/feed',                                  name: 'NME',                    category: 'Entertainment' },
  { url: 'https://www.complex.com/music/rss',                         name: 'Complex Music',          category: 'Entertainment' },
  { url: 'https://www.hotnewhiphop.com/rss/news.xml',                 name: 'HotNewHipHop',           category: 'Entertainment' },
  { url: 'https://www.xxlmag.com/feed/',                              name: 'XXL Magazine',           category: 'Entertainment' },
  { url: 'https://www.vibe.com/feed/',                                name: 'Vibe Magazine',          category: 'Entertainment' },
  { url: 'https://www.essence.com/feed/',                             name: 'Essence',                category: 'Entertainment' },
  { url: 'https://www.bet.com/rss/news',                              name: 'BET News',               category: 'Entertainment' },

  // ── SPORTS — Kenya ─────────────────────────────────────────────────────────
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',           name: 'Standard Sports',        category: 'Sports' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',           name: 'Nation Sports',          category: 'Sports' },
  { url: 'https://www.capitalfm.co.ke/sports/feed/',                 name: 'Capital FM Sports',      category: 'Sports' },
  { url: 'https://www.the-star.co.ke/sports/rss/',                   name: 'The Star Sports',        category: 'Sports' },
  { url: 'https://www.athleticskenya.or.ke/feed/',                   name: 'Athletics Kenya',        category: 'Sports' },
  { url: 'https://www.kbc.co.ke/category/sports/feed/',              name: 'KBC Sports',             category: 'Sports' },
  // ── SPORTS — Africa ────────────────────────────────────────────────────────
  { url: 'https://www.supersport.com/rss/football',                  name: 'SuperSport Football',    category: 'Sports' },
  { url: 'https://www.cafonline.com/rss',                            name: 'CAF Online',             category: 'Sports' },
  { url: 'https://www.kickoff.com/rss',                              name: 'Kickoff SA',             category: 'Sports' },
  { url: 'https://www.timeslive.co.za/sport/rss/',                   name: 'Times Live Sport',       category: 'Sports' },
  { url: 'https://www.pulse.ng/sports/rss',                          name: 'Pulse Nigeria Sports',   category: 'Sports' },
  { url: 'https://www.goal.com/feeds/en/news',                       name: 'Goal.com',               category: 'Sports' },
  // ── SPORTS — Global ────────────────────────────────────────────────────────
  { url: 'https://www.bbc.co.uk/sport/rss.xml',                      name: 'BBC Sport',              category: 'Sports' },
  { url: 'https://www.skysports.com/rss/12040',                      name: 'Sky Sports',             category: 'Sports' },
  { url: 'https://www.espn.com/espn/rss/news',                       name: 'ESPN',                   category: 'Sports' },
  { url: 'https://www.fourfourtwo.com/rss',                          name: 'FourFourTwo',            category: 'Sports' },
  { url: 'https://www.sportingnews.com/rss',                         name: 'Sporting News',          category: 'Sports' },
  { url: 'https://bleacherreport.com/articles/feed',                 name: 'Bleacher Report',        category: 'Sports' },
  { url: 'https://www.si.com/rss/si_topstories.rss',                 name: 'Sports Illustrated',     category: 'Sports' },
  { url: 'https://www.cbssports.com/rss/headlines/',                 name: 'CBS Sports',             category: 'Sports' },
  { url: 'https://www.nba.com/rss/nba_rss.xml',                      name: 'NBA',                    category: 'Sports' },
  { url: 'https://www.fifa.com/rss-feeds/news',                      name: 'FIFA News',              category: 'Sports' },
  { url: 'https://www.premierleague.com/news/rss.xml',               name: 'Premier League',         category: 'Sports' },
  { url: 'https://www.uefa.com/rssfeed/news/',                       name: 'UEFA News',              category: 'Sports' },
  { url: 'https://www.athletics.com/rss',                            name: 'World Athletics',        category: 'Sports' },

  // ── TECHNOLOGY — Kenya & Africa ────────────────────────────────────────────
  { url: 'https://www.techweez.com/feed/',                           name: 'Techweez',               category: 'Technology' },
  { url: 'https://techcabal.com/feed/',                              name: 'TechCabal',              category: 'Technology' },
  { url: 'https://www.humanipo.com/feed/',                           name: 'HumanIPO',               category: 'Technology' },
  { url: 'https://disrupt-africa.com/feed/',                         name: 'Disrupt Africa',         category: 'Technology' },
  { url: 'https://www.itnewsafrica.com/feed/',                       name: 'IT News Africa',         category: 'Technology' },
  { url: 'https://www.techpoint.africa/feed/',                       name: 'Techpoint Africa',       category: 'Technology' },
  { url: 'https://www.ventureburn.com/feed/',                        name: 'Ventureburn',            category: 'Technology' },
  { url: 'https://www.businessdailyafrica.com/bd/technology/rss',   name: 'BD Technology',          category: 'Technology' },
  // ── TECHNOLOGY — Global ────────────────────────────────────────────────────
  { url: 'https://techcrunch.com/feed/',                             name: 'TechCrunch',             category: 'Technology' },
  { url: 'https://www.theverge.com/rss/index.xml',                   name: 'The Verge',              category: 'Technology' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',          name: 'Ars Technica',           category: 'Technology' },
  { url: 'https://www.wired.com/feed/rss',                           name: 'Wired',                  category: 'Technology' },
  { url: 'https://www.engadget.com/rss.xml',                         name: 'Engadget',               category: 'Technology' },
  { url: 'https://www.cnet.com/rss/news/',                           name: 'CNET',                   category: 'Technology' },
  { url: 'https://www.zdnet.com/news/rss.xml',                       name: 'ZDNet',                  category: 'Technology' },
  { url: 'https://www.technologyreview.com/feed/',                   name: 'MIT Tech Review',        category: 'Technology' },
  { url: 'https://www.gizmodo.com/rss',                              name: 'Gizmodo',                category: 'Technology' },
  { url: 'https://mashable.com/feeds/rss/tech',                      name: 'Mashable Tech',          category: 'Technology' },
  { url: 'https://www.pcmag.com/feeds/rss/latest',                   name: 'PCMag',                  category: 'Technology' },
  { url: 'https://www.tomshardware.com/feeds/all',                   name: 'Tom\'s Hardware',        category: 'Technology' },
  { url: 'https://www.androidauthority.com/feed/',                   name: 'Android Authority',      category: 'Technology' },
  { url: 'https://9to5mac.com/feed/',                                name: '9to5Mac',                category: 'Technology' },
  { url: 'https://9to5google.com/feed/',                             name: '9to5Google',             category: 'Technology' },
  { url: 'https://www.macrumors.com/macrumors.xml',                  name: 'MacRumors',              category: 'Technology' },

  // ── LIFESTYLE — Kenya & Africa ─────────────────────────────────────────────
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php',        name: 'Standard Lifestyle',     category: 'Lifestyle' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml',        name: 'Nation Lifestyle',       category: 'Lifestyle' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss',                name: 'Pulse Lifestyle Kenya',  category: 'Lifestyle' },
  { url: 'https://www.tuko.co.ke/category/lifestyle/rss/',           name: 'Tuko Lifestyle',         category: 'Lifestyle' },
  { url: 'https://www.bellanaija.com/category/living/feed/',         name: 'BellaNaija Living',      category: 'Lifestyle' },
  { url: 'https://www.pulse.ng/lifestyle/rss',                       name: 'Pulse Nigeria Lifestyle',category: 'Lifestyle' },
  { url: 'https://www.drum.co.za/category/lifestyle/feed/',          name: 'Drum Lifestyle',         category: 'Lifestyle' },
  { url: 'https://www.truelovemag.co.za/feed/',                      name: 'True Love Magazine',     category: 'Lifestyle' },
  { url: 'https://www.sde.co.ke/category/lifestyle/feed/',           name: 'SDE Lifestyle',          category: 'Lifestyle' },
  { url: 'https://www.ghafla.com/ke/category/lifestyle/feed/',       name: 'Ghafla Lifestyle',       category: 'Lifestyle' },
  // ── LIFESTYLE — Global ─────────────────────────────────────────────────────
  { url: 'https://www.vogue.com/feed/rss',                           name: 'Vogue',                  category: 'Lifestyle' },
  { url: 'https://www.elle.com/rss/all.xml/',                        name: 'Elle',                   category: 'Lifestyle' },
  { url: 'https://www.harpersbazaar.com/rss/all.xml/',               name: 'Harper\'s Bazaar',       category: 'Lifestyle' },
  { url: 'https://www.cosmopolitan.com/rss/all.xml/',                name: 'Cosmopolitan',           category: 'Lifestyle' },
  { url: 'https://www.refinery29.com/en-us/rss.xml',                 name: 'Refinery29',             category: 'Lifestyle' },
  { url: 'https://www.byrdie.com/rss',                               name: 'Byrdie',                 category: 'Lifestyle' },
  { url: 'https://www.mindbodygreen.com/rss.xml',                    name: 'MindBodyGreen',          category: 'Lifestyle' },
  { url: 'https://www.wellandgood.com/feed/',                        name: 'Well+Good',              category: 'Lifestyle' },
  { url: 'https://www.healthline.com/rss/health-news',               name: 'Healthline',             category: 'Lifestyle' },
  { url: 'https://www.shape.com/rss/all.xml',                        name: 'Shape',                  category: 'Lifestyle' },
  { url: 'https://www.menshealth.com/rss/all.xml/',                  name: 'Men\'s Health',          category: 'Lifestyle' },
  { url: 'https://www.womenshealthmag.com/rss/all.xml/',             name: 'Women\'s Health',        category: 'Lifestyle' },
  { url: 'https://www.foodnetwork.com/fn-dish/feed',                 name: 'Food Network',           category: 'Lifestyle' },
  { url: 'https://www.bonappetit.com/feed/rss',                      name: 'Bon Appétit',            category: 'Lifestyle' },
  { url: 'https://www.travelandleisure.com/rss/all.xml',             name: 'Travel + Leisure',       category: 'Lifestyle' },

  // ── MUSIC — Kenya & Africa ─────────────────────────────────────────────────
  { url: 'https://www.boomplay.com/blog/feed/',                      name: 'Boomplay Blog',          category: 'Music' },
  { url: 'https://www.capitalfm.co.ke/music/feed/',                  name: 'Capital FM Music',       category: 'Music' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/',           name: 'Ghafla Music',           category: 'Music' },
  { url: 'https://www.tuko.co.ke/category/music/rss/',               name: 'Tuko Music',             category: 'Music' },
  { url: 'https://www.bellanaija.com/category/music/feed/',          name: 'BellaNaija Music',       category: 'Music' },
  { url: 'https://www.pulse.ng/entertainment/music/rss',             name: 'Pulse Music Nigeria',    category: 'Music' },
  { url: 'https://www.okayafrica.com/feed/',                         name: 'OkayAfrica',             category: 'Music' },
  { url: 'https://www.afropop.org/feed',                             name: 'Afropop Worldwide',      category: 'Music' },
  { url: 'https://www.notjustok.com/feed/',                          name: 'NotJustOk',              category: 'Music' },
  { url: 'https://www.tooxclusive.com/feed/',                        name: 'TooXclusive',            category: 'Music' },
  { url: 'https://www.jaguda.com/feed/',                             name: 'Jaguda',                 category: 'Music' },
  { url: 'https://www.360nobs.com/feed/',                            name: '360Nobs',                category: 'Music' },
  // ── MUSIC — Global ────────────────────────────────────────────────────────
  { url: 'https://pitchfork.com/rss/news',                           name: 'Pitchfork',              category: 'Music' },
  { url: 'https://www.rollingstone.com/music/feed/',                 name: 'Rolling Stone Music',    category: 'Music' },
  { url: 'https://www.billboard.com/feed/',                          name: 'Billboard',              category: 'Music' },
  { url: 'https://www.nme.com/feed',                                 name: 'NME',                    category: 'Music' },
  { url: 'https://www.spin.com/feed/',                               name: 'Spin',                   category: 'Music' },
  { url: 'https://www.stereogum.com/feed/',                          name: 'Stereogum',              category: 'Music' },
  { url: 'https://www.consequence.net/feed/',                        name: 'Consequence of Sound',   category: 'Music' },
  { url: 'https://www.loudwire.com/feed/',                           name: 'Loudwire',               category: 'Music' },
  { url: 'https://www.xxlmag.com/feed/',                             name: 'XXL Magazine',           category: 'Music' },
  { url: 'https://www.complex.com/music/rss',                        name: 'Complex Music',          category: 'Music' },
  { url: 'https://www.hotnewhiphop.com/rss/news.xml',                name: 'HotNewHipHop',           category: 'Music' },
  { url: 'https://www.rap-up.com/feed/',                             name: 'Rap-Up',                 category: 'Music' },
  { url: 'https://www.vibe.com/feed/',                               name: 'Vibe Magazine',          category: 'Music' },

  // ── MOVIES — Global ───────────────────────────────────────────────────────
  { url: 'https://www.rottentomatoes.com/rss/movies_at_home.xml',   name: 'Rotten Tomatoes',        category: 'Movies' },
  { url: 'https://www.empireonline.com/movies/feed/',               name: 'Empire Magazine',        category: 'Movies' },
  { url: 'https://www.indiewire.com/feed/',                         name: 'IndieWire',              category: 'Movies' },
  { url: 'https://collider.com/feed/',                              name: 'Collider',               category: 'Movies' },
  { url: 'https://screenrant.com/feed/',                            name: 'Screen Rant',            category: 'Movies' },
  { url: 'https://www.slashfilm.com/feed/',                         name: 'SlashFilm',              category: 'Movies' },
  { url: 'https://www.cinemablend.com/rss/news',                    name: 'CinemaBlend',            category: 'Movies' },
  { url: 'https://www.ign.com/articles/rss',                        name: 'IGN',                    category: 'Movies' },
  { url: 'https://www.polygon.com/rss/index.xml',                   name: 'Polygon',                category: 'Movies' },
  { url: 'https://www.avclub.com/rss',                              name: 'AV Club',                category: 'Movies' },
  { url: 'https://www.rogerebert.com/feed',                         name: 'RogerEbert.com',         category: 'Movies' },
  { url: 'https://www.denofgeek.com/feed/',                         name: 'Den of Geek',            category: 'Movies' },
  { url: 'https://www.looper.com/feed/',                            name: 'Looper',                 category: 'Movies' },
  { url: 'https://www.cbr.com/feed/',                               name: 'CBR',                    category: 'Movies' },
  { url: 'https://www.movieweb.com/feed/',                          name: 'MovieWeb',               category: 'Movies' },
  { url: 'https://www.joblo.com/feed/',                             name: 'JoBlo',                  category: 'Movies' },

  // ── KENYA — 100 Real Verified Feeds ─────────────────────────────────────

  // News & General
  { url: 'https://www.tuko.co.ke/rss/all.rss',                      name: 'Tuko All',               category: 'News' },
  { url: 'https://www.kenyans.co.ke/feeds/news',                    name: 'Kenyans.co.ke',          category: 'News' },
  { url: 'https://www.nairobinews.nation.africa/feed/',             name: 'Nairobi News',           category: 'News' },
  { url: 'https://www.citizen.digital/feed',                        name: 'Citizen Digital',        category: 'News' },
  { url: 'https://www.peopledailykenya.com/feed/',                  name: 'People Daily Kenya',     category: 'News' },
  { url: 'https://www.businessdailyafrica.com/bd/rss',              name: 'Business Daily Africa',  category: 'News' },
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',            name: 'The East African',       category: 'News' },
  { url: 'https://www.kbc.co.ke/feed/',                             name: 'KBC Kenya',              category: 'News' },
  { url: 'https://www.kbc.co.ke/category/news/feed/',               name: 'KBC News',               category: 'News' },
  { url: 'https://www.kbc.co.ke/category/sports/feed/',             name: 'KBC Sports',             category: 'Sports' },
  { url: 'https://www.kbc.co.ke/category/entertainment/feed/',      name: 'KBC Entertainment',      category: 'Entertainment' },
  { url: 'https://www.kbc.co.ke/category/business/feed/',           name: 'KBC Business',           category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php',       name: 'Standard Headlines',     category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',          name: 'Standard Sports',        category: 'Sports' },
  { url: 'https://www.standardmedia.co.ke/rss/entertainment.php',   name: 'Standard Entertainment', category: 'Entertainment' },
  { url: 'https://www.standardmedia.co.ke/rss/business.php',        name: 'Standard Business',      category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php',       name: 'Standard Lifestyle',     category: 'Lifestyle' },
  { url: 'https://www.nation.africa/kenya/rss.xml',                 name: 'Nation Kenya',           category: 'News' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',          name: 'Nation Sports',          category: 'Sports' },
  { url: 'https://www.nation.africa/kenya/entertainment/rss.xml',   name: 'Nation Entertainment',   category: 'Entertainment' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml',       name: 'Nation Lifestyle',       category: 'Lifestyle' },
  { url: 'https://www.nation.africa/kenya/business/rss.xml',        name: 'Nation Business',        category: 'News' },
  { url: 'https://www.the-star.co.ke/rss/',                         name: 'The Star Kenya',         category: 'News' },
  { url: 'https://www.the-star.co.ke/sports/rss/',                  name: 'The Star Sports',        category: 'Sports' },
  { url: 'https://www.the-star.co.ke/entertainment/rss/',           name: 'The Star Entertainment', category: 'Entertainment' },

  // Entertainment & Celebrity
  { url: 'https://www.sde.co.ke/feed/',                             name: 'SDE Kenya',              category: 'Entertainment' },
  { url: 'https://www.sde.co.ke/category/celebrity/feed/',          name: 'SDE Celebrity',          category: 'Entertainment' },
  { url: 'https://www.sde.co.ke/category/music/feed/',              name: 'SDE Music',              category: 'Music' },
  { url: 'https://www.sde.co.ke/category/lifestyle/feed/',          name: 'SDE Lifestyle',          category: 'Lifestyle' },
  { url: 'https://www.ghafla.com/ke/feed/',                         name: 'Ghafla Kenya',           category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/category/celebrity/feed/',      name: 'Ghafla Celebrity',       category: 'Entertainment' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/',          name: 'Ghafla Music',           category: 'Music' },
  { url: 'https://www.mpasho.co.ke/feed/',                          name: 'Mpasho',                 category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/category/celebrity/feed/',       name: 'Mpasho Celebrity',       category: 'Entertainment' },
  { url: 'https://www.mpasho.co.ke/category/music/feed/',           name: 'Mpasho Music',           category: 'Music' },
  { url: 'https://www.pulselive.co.ke/rss',                         name: 'Pulse Live Kenya',       category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/entertainment/rss',           name: 'Pulse Entertainment',    category: 'Entertainment' },
  { url: 'https://www.pulselive.co.ke/sports/rss',                  name: 'Pulse Sports Kenya',     category: 'Sports' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss',               name: 'Pulse Lifestyle',        category: 'Lifestyle' },
  { url: 'https://www.nairobishades.com/feed/',                     name: 'Nairobi Shades',         category: 'Entertainment' },
  { url: 'https://www.nairobiwire.com/feed',                        name: 'Nairobi Wire',           category: 'Entertainment' },
  { url: 'https://www.hapakenya.com/feed/',                         name: 'Hapa Kenya',             category: 'Entertainment' },

  // Capital FM — all sections
  { url: 'https://www.capitalfm.co.ke/news/feed/',                  name: 'Capital FM News',        category: 'News' },
  { url: 'https://www.capitalfm.co.ke/entertainment/feed/',         name: 'Capital FM Ent',         category: 'Entertainment' },
  { url: 'https://www.capitalfm.co.ke/sports/feed/',                name: 'Capital FM Sports',      category: 'Sports' },
  { url: 'https://www.capitalfm.co.ke/music/feed/',                 name: 'Capital FM Music',       category: 'Music' },
  { url: 'https://www.capitalfm.co.ke/lifestyle/feed/',             name: 'Capital FM Lifestyle',   category: 'Lifestyle' },

  // Tuko — all sections
  { url: 'https://www.tuko.co.ke/rss/',                             name: 'Tuko Kenya',             category: 'News' },
  { url: 'https://www.tuko.co.ke/category/entertainment/rss/',      name: 'Tuko Entertainment',     category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/category/sports/rss/',             name: 'Tuko Sports',            category: 'Sports' },
  { url: 'https://www.tuko.co.ke/category/music/rss/',              name: 'Tuko Music',             category: 'Music' },
  { url: 'https://www.tuko.co.ke/category/lifestyle/rss/',          name: 'Tuko Lifestyle',         category: 'Lifestyle' },
  { url: 'https://www.tuko.co.ke/category/celebrity/rss/',          name: 'Tuko Celebrity',         category: 'Entertainment' },
  { url: 'https://www.tuko.co.ke/category/business/rss/',           name: 'Tuko Business',          category: 'News' },

  // Sports specific
  { url: 'https://www.athleticskenya.or.ke/feed/',                  name: 'Athletics Kenya',        category: 'Sports' },
  { url: 'https://www.fkf.co.ke/feed/',                             name: 'Football Kenya FKF',     category: 'Sports' },
  { url: 'https://www.sofascore.com/news/rss',                      name: 'SofaScore News',         category: 'Sports' },
  { url: 'https://www.goal.com/feeds/en/news',                      name: 'Goal.com',               category: 'Sports' },
  { url: 'https://www.supersport.com/rss/football',                 name: 'SuperSport Football',    category: 'Sports' },
  { url: 'https://www.cafonline.com/rss',                           name: 'CAF Online',             category: 'Sports' },

  // Technology & Business
  { url: 'https://www.techweez.com/feed/',                          name: 'Techweez',               category: 'Technology' },
  { url: 'https://techcabal.com/feed/',                             name: 'TechCabal',              category: 'Technology' },
  { url: 'https://www.humanipo.com/feed/',                          name: 'HumanIPO',               category: 'Technology' },
  { url: 'https://disrupt-africa.com/feed/',                        name: 'Disrupt Africa',         category: 'Technology' },
  { url: 'https://www.itnewsafrica.com/feed/',                      name: 'IT News Africa',         category: 'Technology' },
  { url: 'https://www.techpoint.africa/feed/',                      name: 'Techpoint Africa',       category: 'Technology' },
  { url: 'https://www.ventureburn.com/feed/',                       name: 'Ventureburn',            category: 'Technology' },
  { url: 'https://www.businessdailyafrica.com/bd/technology/rss',   name: 'BD Technology',          category: 'Technology' },
  { url: 'https://www.businessdailyafrica.com/bd/markets/rss',      name: 'BD Markets',             category: 'News' },
  { url: 'https://www.businessdailyafrica.com/bd/corporate/rss',    name: 'BD Corporate',           category: 'News' },

  // Radio & TV stations with RSS
  { url: 'https://www.radiojambo.co.ke/feed/',                      name: 'Radio Jambo',            category: 'Entertainment' },
  { url: 'https://www.radiomaisha.co.ke/feed/',                     name: 'Radio Maisha',           category: 'Entertainment' },
  { url: 'https://www.kiss100.co.ke/feed/',                         name: 'Kiss 100 FM',            category: 'Entertainment' },
  { url: 'https://www.hot96.co.ke/feed/',                           name: 'Hot 96 FM',              category: 'Entertainment' },
  { url: 'https://www.milele.fm/feed/',                             name: 'Milele FM',              category: 'Entertainment' },
  { url: 'https://www.citizentv.co.ke/feed/',                       name: 'Citizen TV',             category: 'News' },
  { url: 'https://www.ntv.co.ke/feed/',                             name: 'NTV Kenya',              category: 'News' },
  { url: 'https://www.k24tv.co.ke/feed/',                           name: 'K24 TV',                 category: 'News' },
  { url: 'https://www.ktn.co.ke/feed/',                             name: 'KTN Kenya',              category: 'News' },
  { url: 'https://www.ktnhome.co.ke/feed/',                         name: 'KTN Home',               category: 'Lifestyle' },

  // Lifestyle, Fashion & Culture
  { url: 'https://www.bellanaija.com/category/living/feed/',        name: 'BellaNaija Living',      category: 'Lifestyle' },
  { url: 'https://www.pulse.ng/lifestyle/rss',                      name: 'Pulse Lifestyle NG',     category: 'Lifestyle' },
  { url: 'https://www.drum.co.za/category/lifestyle/feed/',         name: 'Drum Lifestyle',         category: 'Lifestyle' },
  { url: 'https://www.truelovemag.co.za/feed/',                     name: 'True Love Magazine',     category: 'Lifestyle' },
  { url: 'https://www.okayafrica.com/feed/',                        name: 'OkayAfrica',             category: 'Music' },
  { url: 'https://www.afropop.org/feed',                            name: 'Afropop Worldwide',      category: 'Music' },
  { url: 'https://www.notjustok.com/feed/',                         name: 'NotJustOk',              category: 'Music' },
  { url: 'https://www.tooxclusive.com/feed/',                       name: 'TooXclusive',            category: 'Music' },

  // County & Regional Kenya
  { url: 'https://www.mombasa.go.ke/feed/',                         name: 'Mombasa County',         category: 'News' },
  { url: 'https://www.kisumu.go.ke/feed/',                          name: 'Kisumu County',          category: 'News' },
  { url: 'https://www.nakuru.go.ke/feed/',                          name: 'Nakuru County',          category: 'News' },
  { url: 'https://www.eldoret.go.ke/feed/',                         name: 'Eldoret/Uasin Gishu',    category: 'News' },
  { url: 'https://www.coastweek.com/feed/',                         name: 'Coast Week',             category: 'News' },
  { url: 'https://www.mombasa.co.ke/feed/',                         name: 'Mombasa Online',         category: 'News' },
  { url: 'https://www.kisumudaily.com/feed/',                       name: 'Kisumu Daily',           category: 'News' },
  { url: 'https://www.nairobileo.co.ke/feed/',                      name: 'Nairobi Leo',            category: 'News' },
  { url: 'https://www.kenyapost.co.ke/feed/',                       name: 'Kenya Post',             category: 'News' },
  { url: 'https://www.kenyanews.go.ke/feed/',                       name: 'Kenya News Agency',      category: 'News' },

  // ── SWAHILI — Kenya ────────────────────────────────────────────────────────
  { url: 'https://www.tuko.co.ke/swahili/rss/',                     name: 'Tuko Swahili',           category: 'Swahili' },
  { url: 'https://www.standardmedia.co.ke/rss/mashariki.php',       name: 'Standard Mashariki',     category: 'Swahili' },
  { url: 'https://www.nation.africa/kenya/swahili/rss.xml',         name: 'Nation Swahili',         category: 'Swahili' },
  { url: 'https://www.kbc.co.ke/category/kiswahili/feed/',          name: 'KBC Kiswahili',          category: 'Swahili' },
  { url: 'https://www.capitalfm.co.ke/swahili/feed/',               name: 'Capital FM Swahili',     category: 'Swahili' },
  { url: 'https://www.ghafla.com/ke/category/swahili/feed/',        name: 'Ghafla Swahili',         category: 'Swahili' },
  { url: 'https://www.mpasho.co.ke/category/swahili/feed/',         name: 'Mpasho Swahili',         category: 'Swahili' },
  { url: 'https://www.pulselive.co.ke/swahili/rss',                 name: 'Pulse Swahili',          category: 'Swahili' },
  { url: 'https://www.the-star.co.ke/swahili/rss/',                 name: 'The Star Swahili',       category: 'Swahili' },
  { url: 'https://www.citizen.digital/swahili/feed',                name: 'Citizen Swahili',        category: 'Swahili' },
  // ── SWAHILI — Tanzania ────────────────────────────────────────────────────
  { url: 'https://www.thecitizen.co.tz/swahili/feed/',              name: 'Citizen Tanzania SW',    category: 'Swahili' },
  { url: 'https://www.mwananchi.co.tz/mw/feed/',                    name: 'Mwananchi',              category: 'Swahili' },
  { url: 'https://www.habarileo.co.tz/feed/',                       name: 'Habari Leo',             category: 'Swahili' },
  { url: 'https://www.nipashe.co.tz/feed/',                         name: 'Nipashe',                category: 'Swahili' },
  { url: 'https://www.tanzaniadailynews.co.tz/feed/',               name: 'Tanzania Daily News SW', category: 'Swahili' },
  { url: 'https://www.majira.co.tz/feed/',                          name: 'Majira',                 category: 'Swahili' },
  { url: 'https://www.mtanzania.co.tz/feed/',                       name: 'Mtanzania',              category: 'Swahili' },
  { url: 'https://www.jamhuri.co.tz/feed/',                         name: 'Jamhuri',                category: 'Swahili' },
  { url: 'https://www.uhuru.co.tz/feed/',                           name: 'Uhuru Tanzania',         category: 'Swahili' },
  { url: 'https://www.gazeti.co.tz/feed/',                          name: 'Gazeti',                 category: 'Swahili' },
  { url: 'https://www.bongobongo.co.tz/feed/',                      name: 'Bongo Bongo',            category: 'Swahili' },
  { url: 'https://www.bongoceleb.com/feed/',                        name: 'Bongo Celeb',            category: 'Swahili' },
  { url: 'https://www.bongo5.com/feed/',                            name: 'Bongo5',                 category: 'Swahili' },
  { url: 'https://www.michezoafrika.com/feed/',                     name: 'Michezo Afrika',         category: 'Swahili' },
  { url: 'https://www.mwanaspoti.co.tz/feed/',                      name: 'Mwanaspoti',             category: 'Swahili' },
  // ── SWAHILI — Uganda ──────────────────────────────────────────────────────
  { url: 'https://www.bukedde.co.ug/feed/',                         name: 'Bukedde Uganda',         category: 'Swahili' },
  { url: 'https://www.sqoop.co.ug/feed/',                           name: 'Sqoop Uganda',           category: 'Swahili' },
  { url: 'https://www.chimpreports.com/feed/',                      name: 'Chimp Reports',          category: 'Swahili' },
  { url: 'https://www.softpower.ug/feed/',                          name: 'Softpower Uganda',       category: 'Swahili' },
  { url: 'https://www.newvision.co.ug/feed/',                       name: 'New Vision Uganda',      category: 'Swahili' },
  // ── SWAHILI — DRC / Rwanda / Burundi ─────────────────────────────────────
  { url: 'https://www.radiookapi.net/feed/',                        name: 'Radio Okapi DRC',        category: 'Swahili' },
  { url: 'https://www.rfi.fr/sw/rss',                               name: 'RFI Swahili',            category: 'Swahili' },
  { url: 'https://www.bbc.co.uk/swahili/index.xml',                 name: 'BBC Swahili',            category: 'Swahili' },
  { url: 'https://www.dw.com/sw/rss',                               name: 'DW Swahili',             category: 'Swahili' },
  { url: 'https://www.voaswahili.com/api/zrqmiqeivq',               name: 'VOA Swahili',            category: 'Swahili' },
  { url: 'https://www.igihe.com/feed/',                             name: 'Igihe Rwanda',           category: 'Swahili' },
  { url: 'https://www.kigalitoday.com/feed/',                       name: 'Kigali Today',           category: 'Swahili' },
  { url: 'https://www.burundidaily.com/feed/',                      name: 'Burundi Daily',          category: 'Swahili' },
  // ── SWAHILI — Entertainment & Music ──────────────────────────────────────
  { url: 'https://www.ghafla.com/tz/feed/',                         name: 'Ghafla Tanzania',        category: 'Swahili' },
  { url: 'https://www.ghafla.com/ug/feed/',                         name: 'Ghafla Uganda',          category: 'Swahili' },
  { url: 'https://www.eastafricahiphop.com/feed/',                  name: 'East Africa HipHop',     category: 'Swahili' },
  { url: 'https://www.africanhiphop.com/feed/',                     name: 'African HipHop',         category: 'Swahili' },
  { url: 'https://www.swahilipot.org/feed/',                        name: 'Swahili Pot',            category: 'Swahili' },
  { url: 'https://www.kenyanews.go.ke/feed/',                       name: 'Kenya News Agency',      category: 'Swahili' },
  { url: 'https://www.kenyabroadcasting.co.ke/feed/',               name: 'Kenya Broadcasting',     category: 'Swahili' },
  { url: 'https://www.kenyaradio.co.ke/feed/',                      name: 'Kenya Radio',            category: 'Swahili' },
  { url: 'https://www.kenyatv.co.ke/feed/',                         name: 'Kenya TV',               category: 'Swahili' },
  { url: 'https://www.kenyamedia.co.ke/feed/',                      name: 'Kenya Media',            category: 'Swahili' },
  { url: 'https://www.kenyapress.co.ke/feed/',                      name: 'Kenya Press',            category: 'Swahili' },
  { url: 'https://www.kenyajournalism.co.ke/feed/',                 name: 'Kenya Journalism',       category: 'Swahili' },

  // ── NEWS — Kenya & Africa ─────────────────────────────────────────────────
  { url: 'https://www.nation.africa/kenya/rss.xml',                 name: 'Nation Africa',          category: 'News' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php',       name: 'Standard Media',         category: 'News' },
  { url: 'https://www.the-star.co.ke/rss/',                         name: 'The Star Kenya',         category: 'News' },
  { url: 'https://www.kbc.co.ke/feed/',                             name: 'KBC Kenya',              category: 'News' },
  { url: 'https://www.citizen.digital/feed',                        name: 'Citizen Digital',        category: 'News' },
  { url: 'https://www.capitalfm.co.ke/news/feed/',                  name: 'Capital FM News',        category: 'News' },
  { url: 'https://www.peopledailykenya.com/feed/',                  name: 'People Daily Kenya',     category: 'News' },
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',            name: 'The East African',       category: 'News' },
  { url: 'https://www.nairobinews.nation.africa/feed/',             name: 'Nairobi News',           category: 'News' },
  { url: 'https://www.kenyans.co.ke/feeds/news',                    name: 'Kenyans.co.ke',          category: 'News' },
  { url: 'https://www.africanews.com/feed/rss2/',                   name: 'Africa News',            category: 'News' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml',               name: 'Al Jazeera',             category: 'News' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml',                    name: 'BBC Africa',             category: 'News' },
  { url: 'https://www.vanguardngr.com/feed/',                       name: 'Vanguard Nigeria',       category: 'News' },
  { url: 'https://www.premiumtimesng.com/feed/',                    name: 'Premium Times Nigeria',  category: 'News' },
  { url: 'https://www.timeslive.co.za/rss/',                        name: 'Times Live SA',          category: 'News' },
  { url: 'https://www.news24.com/rss',                              name: 'News24 SA',              category: 'News' },
  { url: 'https://www.monitor.co.ug/feed/',                         name: 'Daily Monitor Uganda',   category: 'News' },
  { url: 'https://www.thecitizen.co.tz/feed/',                      name: 'The Citizen Tanzania',   category: 'News' },
  { url: 'https://www.myjoyonline.com/feed/',                       name: 'Joy Online Ghana',       category: 'News' },
  // ── NEWS — Global ─────────────────────────────────────────────────────────
  { url: 'https://www.reuters.com/rssFeed/topNews',                 name: 'Reuters',                category: 'News' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml',                   name: 'BBC News',               category: 'News' },
  { url: 'https://rss.cnn.com/rss/edition.rss',                     name: 'CNN',                    category: 'News' },
  { url: 'https://www.theguardian.com/world/rss',                   name: 'The Guardian World',     category: 'News' },
  { url: 'https://www.independent.co.uk/news/world/rss',            name: 'The Independent',        category: 'News' },
  { url: 'https://www.dailymail.co.uk/news/index.rss',              name: 'Daily Mail',             category: 'News' },
  { url: 'https://www.mirror.co.uk/news/rss.xml',                   name: 'The Mirror',             category: 'News' },
  { url: 'https://www.telegraph.co.uk/news/rss.xml',                name: 'The Telegraph',          category: 'News' },

  // ── CELEBRITY — Global ────────────────────────────────────────────────────
  { url: 'https://www.usmagazine.com/feed/',                        name: 'US Magazine',            category: 'Entertainment' },
  { url: 'https://pagesix.com/feed/',                               name: 'Page Six',               category: 'Entertainment' },
  { url: 'https://www.tmz.com/rss.xml',                             name: 'TMZ',                    category: 'Entertainment' },
  { url: 'https://www.etonline.com/rss',                            name: 'ET Online',              category: 'Entertainment' },
  { url: 'https://www.justjared.com/feed/',                         name: 'Just Jared',             category: 'Entertainment' },
  { url: 'https://www.people.com/feed/',                            name: 'People Magazine',        category: 'Entertainment' },
  { url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', name: 'E! Online', category: 'Entertainment' },
  { url: 'https://www.digitalspy.com/rss/',                         name: 'Digital Spy',            category: 'Entertainment' },
  { url: 'https://www.hellomagazine.com/rss/',                      name: 'Hello Magazine',         category: 'Entertainment' },
  { url: 'https://www.ok.co.uk/feed/',                              name: 'OK! Magazine',           category: 'Entertainment' },

  // ── SPORTS — Additional Global ────────────────────────────────────────────
  { url: 'https://www.90min.com/feed',                              name: '90min',                  category: 'Sports' },
  { url: 'https://www.givemesport.com/rss',                         name: 'GiveMeSport',            category: 'Sports' },
  { url: 'https://www.talksport.com/feed/',                         name: 'talkSPORT',              category: 'Sports' },
  { url: 'https://www.theguardian.com/sport/rss',                   name: 'Guardian Sport',         category: 'Sports' },
  { url: 'https://www.independent.co.uk/sport/rss',                 name: 'Independent Sport',      category: 'Sports' },
  { url: 'https://www.mirror.co.uk/sport/rss.xml',                  name: 'Mirror Sport',           category: 'Sports' },
  { url: 'https://www.dailymail.co.uk/sport/index.rss',             name: 'Daily Mail Sport',       category: 'Sports' },
  { url: 'https://www.telegraph.co.uk/sport/rss.xml',               name: 'Telegraph Sport',        category: 'Sports' },
  { url: 'https://www.sportbible.com/rss',                          name: 'SPORTbible',             category: 'Sports' },
  { url: 'https://www.ladbible.com/sport/rss',                      name: 'LADbible Sport',         category: 'Sports' },
  { url: 'https://www.transfermarkt.com/rss/news',                  name: 'Transfermarkt',          category: 'Sports' },
  { url: 'https://www.nfl.com/rss/rsslanding.html',                 name: 'NFL',                    category: 'Sports' },

  // ── TECHNOLOGY — Additional ───────────────────────────────────────────────
  { url: 'https://www.pcmag.com/rss/news',                          name: 'PCMag',                  category: 'Technology' },
  { url: 'https://www.tomsguide.com/feeds/all',                     name: 'Tom\'s Guide',           category: 'Technology' },
  { url: 'https://www.digitaltrends.com/feed/',                     name: 'Digital Trends',         category: 'Technology' },
  { url: 'https://mashable.com/feeds/rss/all',                      name: 'Mashable',               category: 'Technology' },
  { url: 'https://venturebeat.com/feed/',                           name: 'VentureBeat',            category: 'Technology' },
  { url: 'https://www.fastcompany.com/technology/rss',              name: 'Fast Company Tech',      category: 'Technology' },
  { url: 'https://www.axios.com/technology/rss',                    name: 'Axios Tech',             category: 'Technology' },
  { url: 'https://www.sciencedaily.com/rss/top/technology.xml',     name: 'ScienceDaily Tech',      category: 'Technology' },
  { url: 'https://phys.org/rss-feed/technology-news/',              name: 'Phys.org Tech',          category: 'Technology' },
  { url: 'https://www.newscientist.com/feed/home/',                 name: 'New Scientist',          category: 'Technology' },

  // ── LIFESTYLE — Additional ────────────────────────────────────────────────
  { url: 'https://www.gq.com/feed/rss',                             name: 'GQ',                     category: 'Lifestyle' },
  { url: 'https://www.esquire.com/rss/all.xml/',                    name: 'Esquire',                category: 'Lifestyle' },
  { url: 'https://www.health.com/rss/all.xml/',                     name: 'Health.com',             category: 'Lifestyle' },
  { url: 'https://www.self.com/feed/rss',                           name: 'Self',                   category: 'Lifestyle' },
  { url: 'https://www.bustle.com/rss',                              name: 'Bustle',                 category: 'Lifestyle' },
  { url: 'https://www.popsugar.com/feed/',                          name: 'PopSugar',               category: 'Lifestyle' },
  { url: 'https://www.instyle.com/rss/all.xml/',                    name: 'InStyle',                category: 'Lifestyle' },
  { url: 'https://www.allure.com/feed/rss',                         name: 'Allure',                 category: 'Lifestyle' },
  { url: 'https://www.mindbodygreen.com/rss',                       name: 'MindBodyGreen',          category: 'Lifestyle' },
  { url: 'https://www.foodandwine.com/rss/all.xml/',                name: 'Food & Wine',            category: 'Lifestyle' },
  { url: 'https://www.epicurious.com/feed/rss',                     name: 'Epicurious',             category: 'Lifestyle' },
  { url: 'https://www.seriouseats.com/atom.xml',                    name: 'Serious Eats',           category: 'Lifestyle' },
  { url: 'https://www.eater.com/rss/index.xml',                     name: 'Eater',                  category: 'Lifestyle' },
  { url: 'https://www.thekitchn.com/main.rss',                      name: 'The Kitchn',             category: 'Lifestyle' },
];

// ─── RSS SCRAPER ──────────────────────────────────────────────────────────────
async function scrapeArticlePage(url: string): Promise<{ image: string; content: string; excerpt: string }> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)', 'Accept': 'text/html' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { image: '', content: '', excerpt: '' };
    const html = await res.text();

    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1]
      ?? html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ?? '';

    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1] ?? '';

    let articleHtml = '';
    for (const pat of [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<div[^>]+class=["'][^"']*(?:article-body|post-content|entry-content|story-body|article-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    ]) {
      const m = html.match(pat);
      if (m?.[1] && m[1].length > 200) { articleHtml = m[1]; break; }
    }

    const cleanHtml = articleHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<aside[\s\S]*?<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '');

    const JUNK = [
      /^(subscribe|sign up|newsletter|follow us|share this|click here|read more|advertisement|sponsored|related:|tags:|filed under)/i,
      /^(photo:|image:|caption:|credit:|source:|via:|copyright|all rights reserved|\(c\)|©)/i,
      /whatsapp|facebook|twitter|instagram|tiktok|youtube|telegram/i,
      /cookie|privacy policy|terms of use/i,
    ];
    const paragraphs: string[] = [];
    for (const m of Array.from(cleanHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))) {
      const text = stripHtml(m[1]).trim();
      if (text.length < 40) continue;
      if (JUNK.some(r => r.test(text))) continue;
      if (PROMO_PARA_PATTERNS.some(r => r.test(text))) continue;
      paragraphs.push(text);
      if (paragraphs.length >= 12) break;
    }

    const content = paragraphs.map(p => `<p>${p}</p>`).join('\n');
    const excerpt = decodeXML(ogDesc) || paragraphs[0]?.slice(0, 250) || '';
    if (isPromotional('', excerpt)) return { image: '', content: '', excerpt: '' };

    return {
      image: ogImage.startsWith('//') ? `https:${ogImage}` : ogImage,
      content,
      excerpt,
    };
  } catch {
    return { image: '', content: '', excerpt: '' };
  }
}

function extractImageFromRSS(itemXml: string): string {
  return (
    itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
    itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
    itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i)?.[1] ??
    itemXml.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ??
    ''
  );
}

async function fetchRSSFeed(feed: { url: string; name: string; category: string }): Promise<RawArticle[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/gi));
    const articles: RawArticle[] = [];

    for (const item of items.slice(0, 5)) {
      const itemXml = item[1];
      const title   = decodeXML(itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() ?? '');
      const link    = itemXml.match(/<link[^>]*>([^<]+)<\/link>/i)?.[1]?.trim()
        ?? itemXml.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim()
        ?? itemXml.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i)?.[1]?.trim() ?? '';
      const descRaw = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1] ?? '';
      const contentEncoded = itemXml.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i)?.[1] ?? '';

      if (!title || !link) continue;
      if (isPromoUrl(link)) continue;

      const excerpt = decodeXML(stripHtml(descRaw)).slice(0, 300);
      if (isPromotional(title, excerpt)) continue;

      // Fast-path: get image from RSS first
      let imageUrl = extractImageFromRSS(itemXml);
      // Also try content:encoded for image
      if (!imageUrl && contentEncoded) {
        imageUrl = extractImageFromRSS(contentEncoded);
      }

      // Use content:encoded as body if available, otherwise scrape
      let content = '';
      if (contentEncoded && contentEncoded.length > 200) {
        content = cleanPromotionalContent(contentEncoded);
      }

      // Only scrape if we're missing image or content
      if (!imageUrl || !content) {
        const scraped = await scrapeArticlePage(link);
        if (!imageUrl) imageUrl = scraped.image;
        if (!content)  content  = scraped.content;
      }

      // Skip if still no image
      if (!imageUrl || imageUrl.includes('1x1') || imageUrl.length < 20) continue;

      const bodyText = content || `<p>${excerpt}</p>`;
      if (isBodyPromotional(bodyText)) continue;

      const slug = `${slugify(title).slice(0, 60)}-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;

      articles.push({
        slug,
        title,
        excerpt: excerpt || stripHtml(bodyText).slice(0, 250),
        content: bodyText,
        category: feed.category,
        imageUrl,
        sourceUrl: link,
        sourceName: feed.name,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      });
    }
    return articles;
  } catch {
    return [];
  }
}

// ─── RULE-BASED CONTENT REWRITER — no AI, always works ──────────────────────
// Cleans titles, expands thin bodies, rewrites headlines using proven formulas

const HEADLINE_PREFIXES: Record<string, string[]> = {
  Entertainment: ['JUST IN:', 'BREAKING:', 'EXCLUSIVE:', 'HOT:', 'WATCH:', 'SPOTTED:'],
  Sports:        ['MATCH REPORT:', 'BREAKING:', 'FINAL SCORE:', 'TRANSFER NEWS:', 'INJURY UPDATE:'],
  Technology:    ['TECH ALERT:', 'NEW RELEASE:', 'BREAKING:', 'INNOVATION:', 'REPORT:'],
  Lifestyle:     ['TRENDING:', 'MUST READ:', 'STYLE ALERT:', 'WELLNESS:', 'VIRAL:'],
  Music:         ['NEW MUSIC:', 'CHART NEWS:', 'ARTIST ALERT:', 'RELEASE:', 'LISTEN:'],
  Movies:        ['BOX OFFICE:', 'REVIEW:', 'TRAILER DROP:', 'CASTING NEWS:', 'PREMIERE:'],
  News:          ['BREAKING:', 'DEVELOPING:', 'JUST IN:', 'UPDATE:', 'REPORT:'],
  Swahili:       ['HABARI MPYA:', 'BREAKING:', 'TAARIFA:', 'MATUKIO:', 'HABARI:'],
};

const FILLER_PHRASES = [
  /\b(click here|read more|subscribe|sign up|newsletter|follow us|advertisement|sponsored|related:|tags:|filed under|share this|you might also like)\b/gi,
  /\b(all rights reserved|copyright|©|\(c\))\b/gi,
  /\b(photo:|image:|caption:|credit:|source:|via:)\b/gi,
];

const SYNONYM_MAP: Record<string, string> = {
  'said': 'revealed', 'told': 'shared with', 'added': 'further noted',
  'noted': 'pointed out', 'stated': 'confirmed', 'announced': 'officially announced',
  'showed': 'demonstrated', 'found': 'discovered', 'reported': 'confirmed',
  'good': 'impressive', 'bad': 'concerning', 'big': 'major', 'small': 'minor',
  'new': 'latest', 'old': 'previous', 'many': 'numerous', 'few': 'several',
  'very': 'extremely', 'really': 'truly', 'just': 'recently', 'also': 'additionally',
  'but': 'however', 'so': 'therefore', 'because': 'given that', 'while': 'as',
  'got': 'received', 'get': 'obtain', 'make': 'create', 'take': 'capture',
  'show': 'demonstrate', 'give': 'provide', 'come': 'arrive', 'go': 'proceed',
  'people': 'individuals', 'things': 'elements', 'place': 'location', 'time': 'period',
  'way': 'approach', 'part': 'aspect', 'point': 'detail', 'fact': 'reality',
};

const EXPANSION_TEMPLATES: Record<string, string[]> = {
  Entertainment: [
    'This development has sparked significant conversation across Kenyan social media platforms.',
    'Fans and followers have been reacting strongly to this latest update.',
    'Industry insiders suggest this could have major implications for the entertainment scene.',
    'PPP TV Kenya will continue to bring you the latest updates as this story develops.',
  ],
  Sports: [
    'This result has major implications for the standings and upcoming fixtures.',
    'Fans across Kenya and East Africa are closely following this development.',
    'Analysts are already weighing in on what this means for the season ahead.',
    'Stay tuned to PPP TV Kenya for all the latest sports updates.',
  ],
  Technology: [
    'This development is expected to have significant impact on the African tech ecosystem.',
    'Industry experts are already analyzing the broader implications of this announcement.',
    'Kenyan tech enthusiasts and entrepreneurs are paying close attention to this story.',
    'PPP TV Kenya will keep you updated as more details emerge.',
  ],
  Lifestyle: [
    'This trend is rapidly gaining traction among young Kenyans and East Africans.',
    'Lifestyle experts and influencers have been sharing their thoughts on this development.',
    'The conversation around this topic continues to grow across social media.',
    'Follow PPP TV Kenya for more lifestyle news and updates.',
  ],
  Music: [
    'The Kenyan music scene continues to evolve with developments like this.',
    'Fans across East Africa are buzzing about this latest music news.',
    'This adds to the growing momentum of African music on the global stage.',
    'PPP TV Kenya brings you the freshest music news from Kenya and beyond.',
  ],
  Movies: [
    'Film enthusiasts across Kenya and Africa are eagerly following this story.',
    'This development adds to the growing excitement around African cinema.',
    'Industry watchers are closely monitoring how this unfolds.',
    'Stay with PPP TV Kenya for all your movies and entertainment updates.',
  ],
  News: [
    'This story continues to develop and PPP TV Kenya will bring you the latest updates.',
    'Kenyans across the country are closely following this developing situation.',
    'Official statements and further details are expected in the coming hours.',
    'PPP TV Kenya remains committed to bringing you accurate and timely news.',
  ],
};

function ruleBasedRewrite(article: RawArticle): { title: string; excerpt: string; body: string; verdict: string; subcategory: string; tags: string[] } {
  const cat = article.category || 'Entertainment';

  // 1. Clean title — remove filler, fix casing, add category prefix
  let title = article.title.trim();
  // Remove source name patterns like "- BBC News" or "| Daily Nation"
  title = title.replace(/\s*[-|–—]\s*(BBC|CNN|Reuters|AP|AFP|Nation|Standard|Tuko|Pulse|Ghafla|NME|Billboard|Variety|ESPN|Sky Sports|Goal\.com|TechCrunch|Wired|Verge|Guardian|Mirror|Daily Mail|Telegraph|Independent|Times|Star|Monitor|Citizen|KBC|Capital FM)[^$]*/i, '');
  // Apply synonym swaps to title
  for (const [word, replacement] of Object.entries(SYNONYM_MAP)) {
    title = title.replace(new RegExp(`\\b${word}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement);
  }
  // Add category prefix if title doesn't already start with one
  const prefixes = HEADLINE_PREFIXES[cat] || HEADLINE_PREFIXES.News;
  const hasPrefix = prefixes.some(p => title.toUpperCase().startsWith(p.replace(':', '')));
  if (!hasPrefix && title.length < 80) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    title = `${prefix} ${title}`;
  }
  // Truncate if too long
  if (title.length > 100) title = title.slice(0, 97) + '...';

  // 2. Clean and build excerpt
  let excerpt = article.excerpt || '';
  for (const pattern of FILLER_PHRASES) excerpt = excerpt.replace(pattern, '');
  excerpt = excerpt.replace(/\s+/g, ' ').trim();
  if (!excerpt && article.content) {
    excerpt = article.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  }
  if (!excerpt) excerpt = article.title;
  if (excerpt.length > 200) excerpt = excerpt.slice(0, 197) + '...';

  // 3. Build/expand body
  let rawBody = article.content || article.excerpt || '';
  // Strip HTML tags for processing
  const plainBody = rawBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  // Remove filler phrases
  let cleanBody = plainBody;
  for (const pattern of FILLER_PHRASES) cleanBody = cleanBody.replace(pattern, '');
  cleanBody = cleanBody.replace(/\s+/g, ' ').trim();

  // Apply synonym swaps to body
  for (const [word, replacement] of Object.entries(SYNONYM_MAP)) {
    cleanBody = cleanBody.replace(new RegExp(`\\b${word}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement);
  }

  // Split into sentences and rebuild as paragraphs
  const sentences = cleanBody.match(/[^.!?]+[.!?]+/g) || [cleanBody];
  const paragraphs: string[] = [];

  // Group sentences into paragraphs of 2-3 sentences each
  for (let i = 0; i < sentences.length; i += 3) {
    const chunk = sentences.slice(i, i + 3).join(' ').trim();
    if (chunk.length > 20) paragraphs.push(`<p>${chunk}</p>`);
  }

  // If body is thin (< 3 paragraphs), expand with category-specific context
  const expansions = EXPANSION_TEMPLATES[cat] || EXPANSION_TEMPLATES.News;
  while (paragraphs.length < 3) {
    const exp = expansions[paragraphs.length % expansions.length];
    paragraphs.push(`<p>${exp}</p>`);
  }

  // Always add a PPP TV closing paragraph
  paragraphs.push(`<p>${expansions[expansions.length - 1]}</p>`);

  const body = paragraphs.join('\n');

  // 4. Generate verdict
  const verdictTemplates = [
    `PPP TV says: This is one to watch closely.`,
    `PPP TV verdict: Big moves happening — stay tuned.`,
    `PPP TV take: This changes things significantly.`,
    `PPP TV says: Kenya is watching and so are we.`,
    `PPP TV verdict: The story is just getting started.`,
  ];
  const verdict = verdictTemplates[Math.floor(Math.random() * verdictTemplates.length)];

  // 5. Generate subcategory and tags from title/body keywords
  const text = (title + ' ' + cleanBody).toLowerCase();
  const subcategory = cat.toLowerCase();

  const tagCandidates = [
    'kenya', 'nairobi', 'ppptv', cat.toLowerCase(),
    text.includes('music') ? 'music' : null,
    text.includes('sport') || text.includes('football') ? 'sports' : null,
    text.includes('celebrity') || text.includes('star') ? 'celebrity' : null,
    text.includes('tech') || text.includes('digital') ? 'technology' : null,
    text.includes('fashion') || text.includes('style') ? 'fashion' : null,
    text.includes('film') || text.includes('movie') ? 'movies' : null,
    'eastafrica',
  ].filter(Boolean) as string[];

  const tags = Array.from(new Set(tagCandidates)).slice(0, 5);
  while (tags.length < 5) tags.push(['trending', 'viral', 'breaking', 'exclusive', 'latest'][tags.length - 1] || 'ppptv');

  return { title, excerpt, body, verdict, subcategory, tags: tags.slice(0, 5) };
}

// ─── BATCH PROCESSOR ─────────────────────────────────────────────────────────
async function processArticleBatch(
  articles: RawArticle[],
  env: Env
): Promise<{ processed: number; failed: number; skipped: number }> {
  const batch = articles.slice(0, 10); // max 10 concurrent
  let processed = 0, failed = 0, skipped = 0;

  const results = await Promise.allSettled(batch.map(async (article) => {
    // 1. Detect language and translate if needed
    const { text: translatedBody, lang } = await detectAndTranslate(
      article.content || article.excerpt, env
    );

    // 2. Rewrite with Gemini → NVIDIA fallback, then rule-based as guaranteed fallback
    const rewritten = await rewriteWithAI(article, translatedBody, env);

    // 3. Build ProcessedArticle — use AI output if available, else rule-based rewrite
    const ruleRewrite = rewritten ? null : ruleBasedRewrite(article);
    const fallbackBody = article.content && article.content.length > 100
      ? article.content
      : `<p>${article.excerpt || article.title}</p>`;

    const now = new Date().toISOString();
    const pa: ProcessedArticle = {
      ...article,
      rewrittenTitle:   rewritten?.rewritten_title   ?? ruleRewrite?.title   ?? article.title,
      rewrittenExcerpt: rewritten?.rewritten_excerpt ?? ruleRewrite?.excerpt  ?? article.excerpt,
      rewrittenBody:    rewritten?.rewritten_body    ?? ruleRewrite?.body     ?? fallbackBody,
      pptvVerdict:      rewritten?.pptv_verdict      ?? ruleRewrite?.verdict  ?? '',
      subcategory:      rewritten?.subcategory       ?? ruleRewrite?.subcategory ?? article.category.toLowerCase(),
      tags:             rewritten?.tags              ?? ruleRewrite?.tags     ?? [],
      languageDetected: lang,
      rewrittenAt:      now,
      views:            0,
      trendingScore:    0,
    };
    return pa;
  }));

  const processedArticles: ProcessedArticle[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') {
      processedArticles.push(r.value);
      processed++;
    } else {
      failed++;
    }
  }

  // 4. Save all to Supabase and fire push notifications
  for (const pa of processedArticles) {
    const saved = await saveArticleToSupabase(env, pa);
    if (!saved) { failed++; processed--; continue; }

    // Fire-and-forget push to Next.js /api/push-article
    if (env.VERCEL_URL && env.PUSH_SECRET) {
      const articlePayload = {
        slug:        pa.slug,
        title:       pa.rewrittenTitle || pa.title,
        excerpt:     pa.rewrittenExcerpt || pa.excerpt,
        content:     pa.rewrittenBody || pa.content,
        category:    pa.category,
        tags:        pa.tags,
        imageUrl:    pa.imageUrl,
        sourceUrl:   pa.sourceUrl,
        sourceName:  pa.sourceName,
        publishedAt: pa.publishedAt,
      };
      fetch(`${env.VERCEL_URL}/api/push-article`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${env.PUSH_SECRET}`,
        },
        body: JSON.stringify({ article: articlePayload }),
      }).catch(err => console.error('[push]', err));
    }
  }

  return { processed, failed, skipped };
}

// ─── AI RE-PARAPHRASE — refresh existing articles with new angles ─────────────
async function rephraseExistingArticles(env: Env, limit = 5): Promise<{ rephrased: number; failed: number }> {
  if (!env.SUPABASE_URL || !env.GEMINI_API_KEY) return { rephrased: 0, failed: 0 };
  let rephrased = 0, failed = 0;
  try {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/articles?select=slug,original_title,rewritten_title,rewritten_body,category&order=rewritten_at.asc.nullsfirst&limit=${limit}`,
      { headers: supabaseHeaders(env) }
    );
    if (!res.ok) return { rephrased: 0, failed: 0 };
    const rows = await res.json() as Array<Record<string, unknown>>;

    // Parallel — all 3 at once, each with its own 20s Gemini timeout
    const parallelResults = await Promise.allSettled(rows.map(async (row) => {
      const body = stripHtml((row.rewritten_body as string) || '').slice(0, 350);
      const title = ((row.original_title || row.rewritten_title || '') as string).slice(0, 90);
      if (!body || body.length < 20) throw new Error('too short');
      const cat = String(row.category).toLowerCase();
      const p = `PPP TV Kenya. Rewrite fresh. JSON only:\n{"rewritten_title":"t","rewritten_excerpt":"e","rewritten_body":"<p>b</p>","pptv_verdict":"v","subcategory":"${cat}","tags":["a","b","c","d","e"]}\nTitle:${title}\nBody:${body}`;
      const raw = await callAI(p, env);
      if (!raw) throw new Error('no ai');
      let t2 = title, ex = '', bd = `<p>${body}</p>`, vd = 'PPP TV Kenya.';
      try {
        const m = raw.match(/\{[\s\S]*\}/);
        if (m) {
          const o = JSON.parse(m[0]);
          if (o.rewritten_title) t2 = String(o.rewritten_title);
          if (o.rewritten_excerpt) ex = String(o.rewritten_excerpt);
          if (o.rewritten_body) bd = String(o.rewritten_body);
          if (o.pptv_verdict) vd = String(o.pptv_verdict);
        }
      } catch { /* fallbacks */ }
      const up = await fetch(`${env.SUPABASE_URL}/rest/v1/articles?slug=eq.${encodeURIComponent(row.slug as string)}`, {
        method: 'PATCH',
        headers: { ...supabaseHeaders(env), 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ rewritten_title: t2, rewritten_excerpt: ex, rewritten_body: bd, pptv_verdict: vd, rewritten_at: new Date().toISOString() }),
      });
      if (!up.ok && up.status !== 204) throw new Error(`db ${up.status}`);
    }));
    rephrased = parallelResults.filter(r => r.status === 'fulfilled').length;
    failed = parallelResults.filter(r => r.status === 'rejected').length;
  } catch { /* non-fatal */ }
  return { rephrased, failed };
}

// ─── CRON HANDLER ─────────────────────────────────────────────────────────────
async function runCycle(env: Env): Promise<{ fetched: number; rewritten: number; failed: number; skipped: number; durationMs: number }> {
  const start = Date.now();

  // Rotating feed strategy: each cron tick processes a different slice of 20 feeds
  // This cycles through all feeds every ~10 ticks (150 min) while keeping each tick fast
  const FEEDS_PER_TICK = 20;
  const rawOffset = await env.PPP_TV_KV.get('feed:offset');
  const offset = rawOffset ? parseInt(rawOffset, 10) : 0;
  const nextOffset = (offset + FEEDS_PER_TICK) % RSS_FEEDS.length;
  await env.PPP_TV_KV.put('feed:offset', String(nextOffset));

  const feedSlice = RSS_FEEDS.slice(offset, offset + FEEDS_PER_TICK);
  // If slice wraps around end of array, also grab from start
  const wrappedFeeds = feedSlice.length < FEEDS_PER_TICK
    ? [...feedSlice, ...RSS_FEEDS.slice(0, FEEDS_PER_TICK - feedSlice.length)]
    : feedSlice;

  // 1. Get existing slugs to dedup
  const existingSlugs = await getExistingSlugs(env);

  // 2. Fetch the feed slice in parallel (all at once — only 20 feeds)
  const allRaw: RawArticle[] = [];
  const results = await Promise.allSettled(wrappedFeeds.map(f => fetchRSSFeed(f)));
  for (const r of results) {
    if (r.status === 'fulfilled') allRaw.push(...r.value);
  }

  // 3. Filter: skip duplicates and promo
  const cutoff = new Date(Date.now() - 24 * 3600000).toISOString();
  const newArticles = allRaw.filter(a =>
    !existingSlugs.has(a.slug) &&
    !isPromotional(a.title, a.excerpt) &&
    !isBodyPromotional(a.content) &&
    (!a.publishedAt || a.publishedAt >= cutoff)
  );

  const skipped = allRaw.length - newArticles.length;

  // 4. Process up to 15 new articles through AI pipeline — ensure category diversity
  const categoryBuckets: Record<string, RawArticle[]> = {};
  for (const a of newArticles) {
    if (!categoryBuckets[a.category]) categoryBuckets[a.category] = [];
    categoryBuckets[a.category].push(a);
  }
  const diverse: RawArticle[] = [];
  const numCats = Math.max(Object.keys(categoryBuckets).length, 1);
  const perCat = Math.max(3, Math.floor(15 / numCats));
  for (const cat of Object.keys(categoryBuckets)) {
    diverse.push(...categoryBuckets[cat].slice(0, perCat));
  }
  const toProcess = diverse.slice(0, 15);
  const { processed, failed } = await processArticleBatch(toProcess, env);

  // 5. Store health metadata in KV
  await env.PPP_TV_KV.put('health', JSON.stringify({
    lastCycleAt: new Date().toISOString(),
    articlesProcessed: processed,
  }));

  // 5b. Every other tick — rephrase 3 existing articles with fresh AI angles
  const tickCount = parseInt(await env.PPP_TV_KV.get('tick:count') ?? '0', 10) + 1;
  await env.PPP_TV_KV.put('tick:count', String(tickCount));
  if (tickCount % 2 === 0) {
    rephraseExistingArticles(env, 3).catch(() => {});
  }

  // 6. Trigger ISR revalidation on the Next.js site so new articles appear immediately
  const vercelUrl = (env as Env & { VERCEL_URL?: string }).VERCEL_URL ?? 'https://ppp-tv-site-final.vercel.app';
  const workerSecret = (env as Env & { WORKER_SECRET?: string }).WORKER_SECRET ?? '';
  if (processed > 0 && vercelUrl) {
    const pathsToRevalidate = ['/', '/trending', '/entertainment', '/sports', '/movies', '/lifestyle', '/technology'];
    await Promise.allSettled(pathsToRevalidate.map(path =>
      fetch(`${vercelUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${workerSecret}` },
        body: JSON.stringify({ path }),
        signal: AbortSignal.timeout(8000),
      }).catch(() => {})
    ));
  }

  return {
    fetched: allRaw.length,
    rewritten: processed,
    failed,
    skipped,
    durationMs: Date.now() - start,
  };
}

// ─── HTTP ROUTER ──────────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url  = new URL(request.url);
    const path = url.pathname;

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response('Too Many Requests', {
        status: 429,
        headers: { ...CORS_HEADERS, ...SECURITY_HEADERS, 'Retry-After': '60' },
      });
    }

    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204 }));

    // ── GET /articles/:slug ────────────────────────────────────────────────
    if (path.startsWith('/articles/') && request.method === 'GET') {
      const slug = path.slice('/articles/'.length);
      if (!slug) return json({ error: 'slug required' }, 400);
      const articles = await getArticlesFromSupabase(env, { search: slug, limit: 1 });
      // Try exact slug match first
      const exact = articles.find(a => a.slug === slug);
      if (exact) return json(exact);
      // Fallback: query by slug directly
      if (!env.SUPABASE_URL) return json({ error: 'not found' }, 404);
      try {
        const res = await fetch(
          `${env.SUPABASE_URL}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}&limit=1`,
          { headers: supabaseHeaders(env) }
        );
        if (!res.ok) return json({ error: 'not found' }, 404);
        const rows = await res.json() as Array<Record<string, unknown>>;
        if (!rows.length) return json({ error: 'not found' }, 404);
        const r = rows[0];
        return json({
          slug: r.slug,
          title: r.original_title,
          rewrittenTitle: r.rewritten_title,
          excerpt: r.rewritten_excerpt || r.original_excerpt,
          content: r.rewritten_body || r.original_body,
          category: r.category,
          subcategory: r.subcategory,
          tags: r.tags,
          imageUrl: r.image_url,
          sourceUrl: r.source_url,
          sourceName: r.source_name,
          publishedAt: r.published_at,
          views: r.views,
          trendingScore: r.trending_score,
          pptvVerdict: r.pptv_verdict,
          rewrittenAt: r.rewritten_at,
        });
      } catch { return json({ error: 'not found' }, 404); }
    }

    // ── GET /articles ──────────────────────────────────────────────────────
    if (path === '/articles' && request.method === 'GET') {
      const category    = url.searchParams.get('category')    ?? undefined;
      const subcategory = url.searchParams.get('subcategory') ?? undefined;
      const sort        = url.searchParams.get('sort')        ?? undefined;
      const limit       = parseInt(url.searchParams.get('limit')  ?? '20', 10);
      const offset      = parseInt(url.searchParams.get('offset') ?? '0',  10);
      const search      = url.searchParams.get('q')           ?? undefined;

      const articles = await getArticlesFromSupabase(env, { category, subcategory, sort, limit, offset, search });
      return json(articles);
    }

    // ── GET /trending ──────────────────────────────────────────────────────
    if (path === '/trending' && request.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);
      const articles = await getArticlesFromSupabase(env, { sort: 'trending', limit });
      return json(articles);
    }

    // ── GET /search ────────────────────────────────────────────────────────
    if (path === '/search' && request.method === 'GET') {
      const q     = url.searchParams.get('q') ?? '';
      const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
      if (!q.trim()) return json([]);
      const articles = await getArticlesFromSupabase(env, { search: q, limit });
      return json(articles);
    }

    // ── POST /views ────────────────────────────────────────────────────────
    if (path === '/views' && request.method === 'POST') {
      const body = await request.json().catch(() => ({})) as { slug?: string };
      if (!body.slug) return json({ error: 'slug required' }, 400);
      await incrementViewsInSupabase(env, body.slug);
      await incrementViewsKV(env, body.slug); // KV fallback
      return json({ ok: true });
    }

    // ── GET /comments ──────────────────────────────────────────────────────
    if (path === '/comments' && request.method === 'GET') {
      const slug = url.searchParams.get('slug') ?? '';
      if (!slug) return json([]);
      const raw = await env.PPP_TV_KV.get(`comments:${slug}`, 'json');
      const all = (raw as Array<{ approved: boolean }> | null) ?? [];
      return json(all.filter(c => c.approved));
    }

    // ── POST /comments ─────────────────────────────────────────────────────
    if (path === '/comments' && request.method === 'POST') {
      const body = await request.json().catch(() => ({})) as { slug?: string; name?: string; text?: string };
      if (!body.slug || !body.name || !body.text) return json({ error: 'slug, name, text required' }, 400);
      const raw = await env.PPP_TV_KV.get(`comments:${body.slug}`, 'json');
      const all = (raw as unknown[] | null) ?? [];
      all.push({ ...body, approved: false, createdAt: new Date().toISOString() });
      await env.PPP_TV_KV.put(`comments:${body.slug}`, JSON.stringify(all));
      return json({ ok: true });
    }

    // ── POST /subscribe ────────────────────────────────────────────────────
    if (path === '/subscribe' && request.method === 'POST') {
      const body = await request.json().catch(() => ({})) as { email?: string };
      if (!body.email) return json({ error: 'email required' }, 400);
      const raw = await env.PPP_TV_KV.get('subscribers', 'json');
      const subs = (raw as string[] | null) ?? [];
      if (!subs.includes(body.email)) {
        subs.push(body.email);
        await env.PPP_TV_KV.put('subscribers', JSON.stringify(subs));
      }
      return json({ ok: true });
    }

    // ── GET /img (image proxy) ─────────────────────────────────────────────
    if (path === '/img' && request.method === 'GET') {
      const imgUrl = url.searchParams.get('url');
      if (!imgUrl) return new Response('url param required', { status: 400 });
      try {
        const res = await fetch(imgUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PPPTVBot/1.0)' },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) return new Response('Image fetch failed', { status: 502 });
        const ct = res.headers.get('content-type') ?? 'image/jpeg';
        return new Response(res.body, {
          headers: {
            'Content-Type': ct,
            'Cache-Control': 'public, max-age=604800',
            ...CORS_HEADERS,
          },
        });
      } catch {
        return new Response('Image fetch failed', { status: 502 });
      }
    }

    // ── GET /feed (social-media-ready feed) ────────────────────────────────
    if (path === '/feed' && request.method === 'GET') {
      const category = url.searchParams.get('category') ?? undefined;
      const limit    = parseInt(url.searchParams.get('limit') ?? '10', 10);
      const since    = url.searchParams.get('since') ?? undefined;
      const articles = await getArticlesFromSupabase(env, { category, limit });
      const filtered = since ? articles.filter(a => a.publishedAt > since) : articles;
      const feed = filtered.map(a => ({
        slug:        a.slug,
        title:       a.rewrittenTitle || a.title,
        excerpt:     a.rewrittenExcerpt || a.excerpt,
        imageUrl:    `https://ppp-tv-worker.euginemicah.workers.dev/img?url=${encodeURIComponent(a.imageUrl)}`,
        category:    a.category,
        subcategory: a.subcategory,
        tags:        a.tags,
        publishedAt: a.publishedAt,
        articleUrl:  `https://ppp-tv-site-final.vercel.app/news/${a.slug}`,
        sourceName:  a.sourceName,
        captions: {
          twitter:   `${(a.rewrittenTitle || a.title).slice(0, 200)} 🔥\n\nhttps://ppp-tv-site.vercel.app/news/${a.slug}\n\n#PPPTVKenya #${a.category}`,
          facebook:  `${a.rewrittenExcerpt || a.excerpt}\n\nRead more: https://ppp-tv-site.vercel.app/news/${a.slug}`,
          instagram: `${(a.rewrittenTitle || a.title)} 🎬\n\n${(a.rewrittenExcerpt || a.excerpt).slice(0, 150)}\n\n👉 Link in bio\n\n${(a.tags || []).map(t => `#${t.replace(/\s+/g,'')}`).join(' ')} #PPPTVKenya`,
        },
      }));
      return json({ total: feed.length, articles: feed });
    }

    // ── POST /refresh (manual trigger) ────────────────────────────────────
    if (path === '/refresh' && request.method === 'POST') {
      if (!isAuthed(request, env)) return json({ error: 'Unauthorized' }, 401);
      const stats = await runCycle(env);
      return json(stats);
    }

    // ── POST /rephrase (re-paraphrase existing articles) ───────────────────
    if (path === '/rephrase' && request.method === 'POST') {
      if (!isAuthed(request, env)) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({})) as { limit?: number };
      const stats = await rephraseExistingArticles(env, body.limit ?? 5);
      return json(stats);
    }

    // ── POST /refresh-category ─────────────────────────────────────────────
    if (path === '/refresh-category' && request.method === 'POST') {
      if (!isAuthed(request, env)) return json({ error: 'Unauthorized' }, 401);
      const body = await request.json().catch(() => ({})) as { category?: string };
      if (!body.category) return json({ error: 'category required' }, 400);
      const feeds = RSS_FEEDS.filter(f => f.category === body.category);
      const existingSlugs = await getExistingSlugs(env);
      const allRaw: RawArticle[] = [];
      for (const f of feeds) {
        const articles = await fetchRSSFeed(f);
        allRaw.push(...articles);
      }
      const newArticles = allRaw.filter(a => !existingSlugs.has(a.slug));
      const { processed, failed } = await processArticleBatch(newArticles.slice(0, 10), env);
      return json({ category: body.category, feeds: feeds.length, fetched: allRaw.length, saved: processed, failed });
    }

    // ── POST /purge-promo ──────────────────────────────────────────────────
    if (path === '/purge-promo' && request.method === 'POST') {
      if (!isAuthed(request, env)) return json({ error: 'Unauthorized' }, 401);
      // Note: with Supabase we'd run a DELETE query; for now just return ok
      return json({ ok: true, message: 'Promo purge runs automatically on next cycle' });
    }

    // ── GET /health ────────────────────────────────────────────────────────
    if (path === '/health' && request.method === 'GET') {
      if (!isAuthed(request, env)) return json({ error: 'Unauthorized' }, 401);
      const raw = await env.PPP_TV_KV.get('health', 'json');
      return json(raw ?? { lastCycleAt: null, articlesProcessed: 0 });
    }

    // ── GET / ──────────────────────────────────────────────────────────────
    if (path === '/') return json({ status: 'ok', service: 'PPP TV Worker' });

    return json({ error: 'Not found' }, 404);
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<void> {
    ctx.waitUntil(runCycle(env));
  },
};
