export interface RssFeed {
  url: string;
  name: string;
  category: string;
  country: string;
}

export const rssFeeds: RssFeed[] = [
  // === KENYA — NEWS ===
  { url: 'https://www.nation.africa/kenya/rss.xml', name: 'Nation Africa', category: 'News', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php', name: 'Standard Media', category: 'News', country: 'KE' },
  { url: 'https://www.the-star.co.ke/rss/', name: 'The Star Kenya', category: 'News', country: 'KE' },
  { url: 'https://www.kbc.co.ke/feed/', name: 'KBC Kenya', category: 'News', country: 'KE' },
  { url: 'https://www.citizen.digital/feed', name: 'Citizen Digital', category: 'News', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/news/feed/', name: 'Capital FM Kenya', category: 'News', country: 'KE' },
  { url: 'https://www.businessdailyafrica.com/rss.xml', name: 'Business Daily Africa', category: 'Business', country: 'KE' },
  { url: 'https://www.peopledailykenya.com/feed/', name: 'People Daily Kenya', category: 'News', country: 'KE' },

  // === KENYA — ENTERTAINMENT ===
  { url: 'https://www.sde.co.ke/feed/', name: 'SDE Kenya', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/feed/', name: 'Ghafla Kenya', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.mpasho.co.ke/feed/', name: 'Mpasho', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.nairobishades.com/feed/', name: 'Nairobi Shades', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/rss', name: 'Pulse Live Kenya', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.tuko.co.ke/rss/', name: 'Tuko Kenya', category: 'Entertainment', country: 'KE' },

  // === KENYA — SPORTS ===
  { url: 'https://www.goal.com/feeds/en/news', name: 'Goal.com Kenya', category: 'Sports', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/sports.php', name: 'Standard Sports', category: 'Sports', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml', name: 'Nation Sports', category: 'Sports', country: 'KE' },
  { url: 'https://www.athleticskenya.or.ke/feed/', name: 'Athletics Kenya', category: 'Sports', country: 'KE' },

  // === KENYA — MUSIC ===
  { url: 'https://www.boomplay.com/blog/feed/', name: 'Boomplay Blog', category: 'Music', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/music/feed/', name: 'Capital FM Music', category: 'Music', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/', name: 'Ghafla Music', category: 'Music', country: 'KE' },

  // === KENYA — LIFESTYLE ===
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php', name: 'Standard Lifestyle', category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml', name: 'Nation Lifestyle', category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss', name: 'Pulse Lifestyle', category: 'Lifestyle', country: 'KE' },

  // === KENYA — TECHNOLOGY ===
  { url: 'https://www.techweez.com/feed/', name: 'Techweez', category: 'Technology', country: 'KE' },
  { url: 'https://www.humanipo.com/feed/', name: 'HumanIPO', category: 'Technology', country: 'KE' },
  { url: 'https://disrupt-africa.com/feed/', name: 'Disrupt Africa', category: 'Technology', country: 'KE' },

  // === EAST AFRICA ===
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml', name: 'The East African', category: 'News', country: 'EA' },
  { url: 'https://www.monitor.co.ug/feed/', name: 'Daily Monitor Uganda', category: 'News', country: 'UG' },
  { url: 'https://www.thecitizen.co.tz/feed/', name: 'The Citizen Tanzania', category: 'News', country: 'TZ' },
  { url: 'https://www.newvision.co.ug/feed/', name: 'New Vision Uganda', category: 'News', country: 'UG' },
  { url: 'https://www.rwandatv.rw/feed/', name: 'Rwanda TV', category: 'News', country: 'RW' },

  // === WEST AFRICA ===
  { url: 'https://www.pulse.com.gh/rss', name: 'Pulse Ghana', category: 'Entertainment', country: 'GH' },
  { url: 'https://www.myjoyonline.com/feed/', name: 'Joy Online Ghana', category: 'News', country: 'GH' },
  { url: 'https://www.vanguardngr.com/feed/', name: 'Vanguard Nigeria', category: 'News', country: 'NG' },
  { url: 'https://www.pulse.ng/rss', name: 'Pulse Nigeria', category: 'Entertainment', country: 'NG' },
  { url: 'https://www.premiumtimesng.com/feed/', name: 'Premium Times Nigeria', category: 'News', country: 'NG' },
  { url: 'https://www.bellanaija.com/feed/', name: 'BellaNaija', category: 'Entertainment', country: 'NG' },

  // === SOUTH AFRICA ===
  { url: 'https://www.timeslive.co.za/rss/', name: 'Times Live SA', category: 'News', country: 'ZA' },
  { url: 'https://www.news24.com/rss', name: 'News24 SA', category: 'News', country: 'ZA' },
  { url: 'https://www.channel24.co.za/feed/', name: 'Channel24 SA', category: 'Entertainment', country: 'ZA' },

  // === PAN-AFRICAN ===
  { url: 'https://www.africanews.com/feed/rss2/', name: 'Africa News', category: 'News', country: 'AF' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera Africa', category: 'News', country: 'AF' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml', name: 'BBC Africa', category: 'News', country: 'AF' },
  { url: 'https://www.thisisafrica.me/feed/', name: 'This Is Africa', category: 'Culture', country: 'AF' },
];

export function getFeedsByCategory(category: string): RssFeed[] {
  return rssFeeds.filter((f) => f.category === category);
}

export function getFeedsByCountry(country: string): RssFeed[] {
  return rssFeeds.filter((f) => f.country === country);
}

export const feedUrls: string[] = rssFeeds.map((f) => f.url);
