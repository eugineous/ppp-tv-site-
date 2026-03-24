import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PPP TV Kenya privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-bebas text-4xl text-white tracking-wide mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300">
        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">1. Information We Collect</h2>
          <p>PPP TV Kenya collects minimal data to provide our service. This includes:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Email addresses when you subscribe to our newsletter (optional)</li>
            <li>Anonymous page view counts for articles (no personal data stored)</li>
            <li>Bookmarks and recently viewed articles (stored locally on your device only)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">2. How We Use Your Data</h2>
          <p>We use collected data solely to:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Send you our newsletter (if subscribed)</li>
            <li>Improve our content by understanding which articles are most popular</li>
            <li>Maintain the security and performance of our service</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">3. Data Storage</h2>
          <p>Newsletter email addresses are stored securely in our Cloudflare KV store. Article view counts are stored as anonymous aggregates. Your bookmarks and recently viewed articles are stored only in your browser&apos;s localStorage and never transmitted to our servers.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">4. Third-Party Services</h2>
          <p>Our site embeds YouTube videos and links to external news sources. These third parties have their own privacy policies. We are not responsible for their data practices.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">5. Your Rights</h2>
          <p>You may request deletion of your newsletter subscription at any time by contacting us at <a href="mailto:info@ppptv.co.ke" className="text-brand-pink hover:text-pink-300">info@ppptv.co.ke</a>.</p>
        </section>

        <section>
          <h2 className="font-bebas text-2xl text-white tracking-wide mb-3">6. Contact</h2>
          <p>For privacy-related enquiries, contact us at <a href="mailto:info@ppptv.co.ke" className="text-brand-pink hover:text-pink-300">info@ppptv.co.ke</a>.</p>
        </section>
      </div>
    </div>
  );
}
