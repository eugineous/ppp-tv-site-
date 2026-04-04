import type { Metadata } from 'next';
import { fetchArticles } from '@/lib/worker';
import CategoryPageLayout from '@/components/CategoryPageLayout';

export const metadata: Metadata = {
  title: 'Habari za Kiswahili | PPP TV Kenya',
  description: 'Habari za hivi karibuni kutoka Kenya, Tanzania, Uganda na Afrika Mashariki — kwa lugha ya Kiswahili.',
};

export const revalidate = 300;

export default async function SwahiliPage() {
  const [all, kenya, tanzania, uganda, sports, entertainment, latestAll] = await Promise.all([
    fetchArticles({ category: 'Swahili', limit: 60 }),
    fetchArticles({ category: 'Swahili', subcategory: 'kenya',         limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Swahili', subcategory: 'tanzania',      limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Swahili', subcategory: 'uganda',        limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Swahili', subcategory: 'michezo',       limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ category: 'Swahili', subcategory: 'burudani',      limit: 10 } as Parameters<typeof fetchArticles>[0]),
    fetchArticles({ sort: 'recent', limit: 10 }),
  ]);

  const rows = [
    { label: '🇰🇪 Kenya',      articles: kenya,         accentColor: '#006600' },
    { label: '🇹🇿 Tanzania',   articles: tanzania,      accentColor: '#1EB53A' },
    { label: '🇺🇬 Uganda',     articles: uganda,        accentColor: '#FCDC04' },
    { label: '⚽ Michezo',     articles: sports,        accentColor: '#00CFFF' },
    { label: '🎭 Burudani',    articles: entertainment, accentColor: '#FF007A' },
  ].filter(r => r.articles.length > 0);

  return (
    <CategoryPageLayout
      title="🌍 Habari za Kiswahili"
      accentColor="#006600"
      articles={all}
      rows={rows}
      latestAll={latestAll}
    />
  );
}
