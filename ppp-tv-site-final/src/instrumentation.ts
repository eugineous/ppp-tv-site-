export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  try {
    const { pushBatch } = await import('@/lib/pusher');
    const result = await pushBatch();
    if (result.ok) {
      console.log(`[instrumentation] Pushed ${result.pushed} articles on startup`);
    } else {
      console.error('[instrumentation] pushBatch failed:', result.error);
    }
  } catch (err) {
    console.error('[instrumentation] Unexpected error during startup push:', err);
  }
}
