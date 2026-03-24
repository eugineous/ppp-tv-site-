import Link from 'next/link';
import type { Metadata } from 'next';
import { artists, getFeaturedArtists } from '@/data/artists';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Artists',
  description: 'Kenyan and African artists featured on PPP TV Kenya.',
};

const ACCENT_COLORS = ['#FF6B00', '#FF007A', '#BF00FF', '#00CFFF', '#00FF94', '#FFE600'];

export default function ArtistsPage() {
  const featured = getFeaturedArtists();
  const rest = artists.filter((a) => !a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-bebas text-5xl text-white tracking-wide mb-1">Artists</h1>
      <p className="text-gray-500 text-sm mb-10">Kenyan and African artists we love and support.</p>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12" aria-label="Featured artists">
          <SectionLabel label="Featured Artists" color="#FF6B00" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((artist, i) => {
              const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
              return (
                <div key={artist.slug} style={{ background: '#111', borderTop: `3px solid ${accent}` }}>
                  <div className="p-5 text-center">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3" style={{ background: `${accent}22` }}>
                      <span className="font-bebas text-2xl text-white">{artist.initials}</span>
                    </div>
                    <p className="font-bold text-white text-sm">{artist.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-0.5" style={{ color: accent }}>{artist.genre}</p>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{artist.bio}</p>
                    {artist.instagramUrl && (
                      <a
                        href={artist.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        Instagram →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All artists */}
      <section aria-label="All artists">
        <SectionLabel label="All Artists" color="#BF00FF" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {rest.map((artist, i) => {
            const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
            return (
              <div key={artist.slug} className="text-center transition-transform hover:scale-[1.03]" style={{ background: '#111' }}>
                <div className="h-0.5 w-full" style={{ background: accent }} />
                <div className="p-4">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <span className="font-bebas text-xl text-white">{artist.initials}</span>
                  </div>
                  <p className="font-medium text-white text-xs">{artist.name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: accent }}>{artist.genre}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
