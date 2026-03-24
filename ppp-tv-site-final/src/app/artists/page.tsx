import Link from 'next/link';
import type { Metadata } from 'next';
import { artists, getFeaturedArtists } from '@/data/artists';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Kenyan and African artists featured on PPP TV Kenya.',
};

export default function ArtistsPage() {
  const featured = getFeaturedArtists();
  const rest = artists.filter((a) => !a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Artists</h1>
      <p className="text-gray-400 text-sm mb-8">Kenyan and African artists we love and support.</p>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-10" aria-label="Featured artists">
          <SectionLabel label="Featured Artists" accentColor="bg-orange-500" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((artist) => (
              <div key={artist.slug} className="bg-[#111] rounded-xl p-5 text-center border border-orange-500/20">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="font-bebas text-2xl text-white">{artist.initials}</span>
                </div>
                <p className="font-semibold text-white text-sm">{artist.name}</p>
                <p className="text-xs text-orange-400 mt-0.5">{artist.genre}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{artist.bio}</p>
                {artist.instagramUrl && (
                  <a
                    href={artist.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs text-gray-400 hover:text-brand-pink transition-colors"
                  >
                    Instagram →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All artists */}
      <section aria-label="All artists">
        <SectionLabel label="All Artists" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {rest.map((artist) => (
            <div key={artist.slug} className="bg-[#111] rounded-xl p-4 text-center hover:ring-1 hover:ring-brand-pink/30 transition-all">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                <span className="font-bebas text-xl text-white">{artist.initials}</span>
              </div>
              <p className="font-medium text-white text-xs">{artist.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{artist.genre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
