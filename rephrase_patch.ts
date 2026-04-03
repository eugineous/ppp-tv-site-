// PATCH: replace rephraseExistingArticles in worker/index.ts
// This is the parallel version that processes all articles simultaneously

async function rephraseExistingArticles(env: Env, limit = 3): Promise<{ rephrased: number; failed: number }> {
  if (!env.SUPABASE_URL || !env.GEMINI_API_KEY) return { rephrased: 0, failed: 0 };
  try {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/articles?select=slug,original_title,rewritten_title,rewritten_body,category&order=rewritten_at.asc.nullsfirst&limit=${limit}`,
      { headers: supabaseHeaders(env) }
    );
    if (!res.ok) return { rephrased: 0, failed: 0 };
    const rows = await res.json() as Array<Record<string, unknown>>;

    const results = await Promise.allSettled(rows.map(async (row) => {
      const body = stripHtml((row.rewritten_body as string) || '').slice(0, 400);
      const title = ((row.original_title || row.rewritten_title || '') as string).slice(0, 100);
      if (!body || body.length < 20) throw new Error('too short');

      const prompt = `PPP TV Kenya editor. Rewrite with fresh angle. Return ONLY JSON:\n{"rewritten_title":"headline","rewritten_excerpt":"summary","rewritten_body":"<p>body</p>","pptv_verdict":"verdict","subcategory":"${String(row.category).toLowerCase()}","tags":["a","b","c","d","e"]}\nTitle:${title}\nBody:${body}`;

      const aiRaw = await callGemini(prompt, env);
      if (!aiRaw) throw new Error('gemini null');

      let newTitle = title, newExcerpt = '', newBody = `<p>${body}</p>`, verdict = 'PPP TV Kenya.';
      try {
        const m = aiRaw.match(/\{[\s\S]*\}/);
        if (m) {
          const obj = JSON.parse(m[0]);
          if (obj.rewritten_title) newTitle = String(obj.rewritten_title);
          if (obj.rewritten_excerpt) newExcerpt = String(obj.rewritten_excerpt);
          if (obj.rewritten_body) newBody = String(obj.rewritten_body);
          if (obj.pptv_verdict) verdict = String(obj.pptv_verdict);
        }
      } catch { /* use fallbacks */ }

      const up = await fetch(
        `${env.SUPABASE_URL}/rest/v1/articles?slug=eq.${encodeURIComponent(row.slug as string)}`,
        {
          method: 'PATCH',
          headers: { ...supabaseHeaders(env), 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify({ rewritten_title: newTitle, rewritten_excerpt: newExcerpt, rewritten_body: newBody, pptv_verdict: verdict, rewritten_at: new Date().toISOString() }),
        }
      );
      if (!up.ok && up.status !== 204) throw new Error(`supabase ${up.status}`);
    }));

    return {
      rephrased: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
    };
  } catch {
    return { rephrased: 0, failed: 0 };
  }
}
