import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'PPP TV Kenya terms of use.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Terms of Use</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">
        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">1. Acceptance of Terms</h2>
          <p>By accessing PPP TV Kenya (&ldquo;the Site&rdquo;), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">2. Content</h2>
          <p>PPP TV Kenya aggregates news from third-party RSS feeds. We do not claim ownership of third-party content. All articles link back to their original sources. Original PPP TV content is copyright © PPP TV Kenya.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">3. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Scrape or systematically download content from the Site</li>
            <li>Use the Site for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the Site</li>
            <li>Transmit any harmful, offensive or disruptive content</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">4. Disclaimer</h2>
          <p>The Site is provided &ldquo;as is&rdquo; without warranties of any kind. PPP TV Kenya is not responsible for the accuracy of third-party news content aggregated on this Site.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">5. Governing Law</h2>
          <p>These Terms are governed by the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">6. Contact</h2>
          <p>For terms-related enquiries, contact us at <a href="mailto:info@ppptv.co.ke" className="text-brand-pink hover:text-pink-300">info@ppptv.co.ke</a>.</p>
        </section>
      </div>
    </div>
  );
}
