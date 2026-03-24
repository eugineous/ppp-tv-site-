import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video',
  description: 'Watch PPP TV Kenya videos — shows, highlights and exclusive content.',
};

const VIDEOS = [
  { id: 'dQw4w9WgXcQ', title: 'PPP TV Kenya — Channel Highlights', description: 'The best moments from PPP TV Kenya.' },
  { id: 'dQw4w9WgXcQ', title: 'Urban News — Latest Bulletin', description: 'Kenya and Africa news coverage.' },
  { id: 'dQw4w9WgXcQ', title: 'Top 15 Countdown — This Week', description: 'The hottest 15 tracks in Africa right now.' },
  { id: 'dQw4w9WgXcQ', title: 'Juu Ya Game — Sports Highlights', description: 'Football, athletics and more.' },
  { id: 'dQw4w9WgXcQ', title: 'Campus Xposure — Youth Edition', description: 'Kenyan campus life and culture.' },
  { id: 'dQw4w9WgXcQ', title: 'Kenyan Drive Show — Best Moments', description: 'Your evening commute sorted.' },
];

export default function VideoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="font-bebas text-5xl text-white tracking-wide">Video</h1>
          <p className="text-gray-500 text-sm mt-1">Watch PPP TV Kenya on YouTube</p>
        </div>
        <a
          href="https://www.youtube.com/@PPPTVKENYA"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ background: '#FF0000' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Subscribe
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VIDEOS.map((video, i) => (
          <div key={i} style={{ background: '#111' }}>
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <p className="font-bold text-white text-sm line-clamp-2">{video.title}</p>
              <p className="text-xs text-gray-500 mt-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="https://www.youtube.com/@PPPTVKENYA"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 text-white font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80"
          style={{ background: '#FF0000' }}
        >
          View All Videos on YouTube →
        </a>
      </div>
    </div>
  );
}
