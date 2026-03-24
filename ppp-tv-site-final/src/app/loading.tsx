export default function Loading() {
  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <div className="skeleton" style={{ width: '100%', height: '80vh', minHeight: '520px', maxHeight: '860px' }} />

      {/* Row skeletons */}
      <div style={{ padding: '2rem 1rem 0', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ marginBottom: '2rem' }}>
            <div className="skeleton" style={{ height: '22px', width: '160px', marginBottom: '14px', borderRadius: '3px' }} />
            <div style={{ display: 'flex', gap: '8px', overflow: 'hidden' }}>
              {[1, 2, 3, 4, 5, 6].map(j => (
                <div key={j} className="skeleton" style={{ flexShrink: 0, width: 'calc((100vw - 2rem - 5*8px) / 2.3)', aspectRatio: '16/9', borderRadius: '4px' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
