'use client';

import { useEffect } from 'react';
import { recordView } from '@/lib/worker';
import { addRecentlyViewed } from '@/lib/localStorage';
import type { Article } from '@/types';

interface ViewRecorderProps {
  slug: string;
  article: Article;
}

export default function ViewRecorder({ slug, article }: ViewRecorderProps) {
  useEffect(() => {
    // Record view on the Worker (fire-and-forget)
    recordView(slug);

    // Add to recently viewed in localStorage
    addRecentlyViewed({
      slug: article.slug,
      title: article.title,
      imageUrl: article.imageUrl,
      category: article.category,
    });
  }, [slug, article]);

  return null;
}
