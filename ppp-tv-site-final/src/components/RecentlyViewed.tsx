'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRecentlyViewed, type RecentlyViewedItem } from '@/lib/localStorage';

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] border-t border-white/5 py-4 px-4" aria-label="Recently viewed articles">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Recently Viewed
        </p>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/news/${item.slug}`}
              className="flex-shrink-0 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group max-w-[200px]"
            >
              {item.imageUrl ? (
                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs text-gray-500">{item.category[0]}</span>
                </div>
              )}
              <span className="text-xs text-gray-300 group-hover:text-white line-clamp-2 leading-tight transition-colors">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
