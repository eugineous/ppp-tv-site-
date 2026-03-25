export interface RssFeed {
  url: string;
  name: string;
  category: string;
  country: string;
}

export const rssFeeds: RssFeed[] = [

  // ═══════════════════════════════════════
  // NEWS — Kenya & Africa
  // ═══════════════════════════════════════
  { url: 'https://www.nation.africa/kenya/rss.xml',              name: 'Nation Africa',        category: 'News', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php',    name: 'Standard Media',       category: 'News', country: 'KE' },
  { url: 'https://www.the-star.co.ke/rss/',                      name: 'The Star Kenya',       category: 'News', country: 'KE' },
  { url: 'https://www.kbc.co.ke/feed/',                          name: 'KBC Kenya',            category: 'News', country: 'KE' },
  { url: 'https://www.citizen.digital/feed',                     name: 'Citizen Digital',      category: 'News', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/news/feed/',               name: 'Capital FM News',      category: 'News', country: 'KE' },
  { url: 'https://www.peopledailykenya.com/feed/',               name: 'People Daily Kenya',   category: 'News', country: 'KE' },
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',         name: 'The East African',     category: 'News', country: 'EA' },
  { url: 'https://www.africanews.com/feed/rss2/',                name: 'Africa News',          category: 'News', country: 'AF' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml',            name: 'Al Jazeera',           category: 'News', country: 'AF' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml',                 name: 'BBC Africa',           category: 'News', country: 'AF' },
  { url: 'https://www.vanguardngr.com/feed/',                    name: 'Vanguard Nigeria',     category: 'News', country: 'NG' },
  { url: 'https://www.premiumtimesng.com/feed/',                 name: 'Premium Times Nigeria',category: 'News', country: 'NG' },
  { url: 'https://www.timeslive.co.za/rss/',                     name: 'Times Live SA',        category: 'News', country: 'ZA' },
  { url: 'https://www.news24.com/rss',                           name: 'News24 SA',            category: 'News', country: 'ZA' },
  { url: 'https://www.monitor.co.ug/feed/',                      name: 'Daily Monitor Uganda', category: 'News', country: 'UG' },
  { url: 'https://www.thecitizen.co.tz/feed/',                   name: 'The Citizen Tanzania', category: 'News', country: 'TZ' },
  { url: 'https://www.myjoyonline.com/feed/',                    name: 'Joy Online Ghana',     category: 'News', country: 'GH' },

  // ═══════════════════════════════════════
  // ENTERTAINMENT — Kenya & Africa
  // ═══════════════════════════════════════
  { url: 'https://www.sde.co.ke/feed/',                          name: 'SDE Kenya',            category: 'Entertainment', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/feed/',                      name: 'Ghafla Kenya',         category: 'Entertainment', country: 'KE' },
  { url: 'https://www.mpasho.co.ke/feed/',                       name: 'Mpasho',               category: 'Entertainment', country: 'KE' },
  { url: 'https://www.nairobishades.com/feed/',                  name: 'Nairobi Shades',       category: 'Entertainment', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/rss',                      name: 'Pulse Live Kenya',     category: 'Entertainment', country: 'KE' },
  { url: 'https://www.tuko.co.ke/rss/',                          name: 'Tuko Kenya',           category: 'Entertainment', country: 'KE' },
  { url: 'https://www.bellanaija.com/feed/',                     name: 'BellaNaija',           category: 'Entertainment', country: 'NG' },
  { url: 'https://www.pulse.ng/rss',                             name: 'Pulse Nigeria',        category: 'Entertainment', country: 'NG' },
  { url: 'https://www.pulse.com.gh/rss',                         name: 'Pulse Ghana',          category: 'Entertainment', country: 'GH' },
  { url: 'https://www.channel24.co.za/feed/',                    name: 'Channel24 SA',         category: 'Entertainment', country: 'ZA' },
  { url: 'https://www.thisisafrica.me/feed/',                    name: 'This Is Africa',       category: 'Entertainment', country: 'AF' },
  { url: 'https://variety.com/feed/',                            name: 'Variety',              category: 'Entertainment', country: 'US' },
  { url: 'https://deadline.com/feed/',                           name: 'Deadline Hollywood',   category: 'Entertainment', country: 'US' },
  { url: 'https://www.hollywoodreporter.com/feed/',              name: 'Hollywood Reporter',   category: 'Entertainment', country: 'US' },

  // ═══════════════════════════════════════
  // SPORTS — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.goal.com/feeds/en/news',                   name: 'Goal.com',             category: 'Sports', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',       name: 'Standard Sports',      category: 'Sports', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',       name: 'Nation Sports',        category: 'Sports', country: 'KE' },
  { url: 'https://www.athleticskenya.or.ke/feed/',               name: 'Athletics Kenya',      category: 'Sports', country: 'KE' },
  { url: 'https://www.bbc.co.uk/sport/rss.xml',                  name: 'BBC Sport',            category: 'Sports', country: 'GB' },
  { url: 'https://www.skysports.com/rss/12040',                  name: 'Sky Sports',           category: 'Sports', country: 'GB' },
  { url: 'https://www.espn.com/espn/rss/news',                   name: 'ESPN',                 category: 'Sports', country: 'US' },
  { url: 'https://www.supersport.com/rss/football',              name: 'SuperSport Football',  category: 'Sports', country: 'AF' },
  { url: 'https://www.cafonline.com/rss',                        name: 'CAF Online',           category: 'Sports', country: 'AF' },

  // ═══════════════════════════════════════
  // MUSIC — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.boomplay.com/blog/feed/',                  name: 'Boomplay Blog',        category: 'Music', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/music/feed/',              name: 'Capital FM Music',     category: 'Music', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/',       name: 'Ghafla Music',         category: 'Music', country: 'KE' },
  { url: 'https://www.tuko.co.ke/category/music/rss/',           name: 'Tuko Music',           category: 'Music', country: 'KE' },
  { url: 'https://www.bellanaija.com/category/music/feed/',      name: 'BellaNaija Music',     category: 'Music', country: 'NG' },
  { url: 'https://www.pulse.ng/entertainment/music/rss',         name: 'Pulse Music Nigeria',  category: 'Music', country: 'NG' },
  { url: 'https://pitchfork.com/rss/news',                       name: 'Pitchfork',            category: 'Music', country: 'US' },
  { url: 'https://www.rollingstone.com/music/feed/',             name: 'Rolling Stone Music',  category: 'Music', country: 'US' },
  { url: 'https://www.billboard.com/feed/',                      name: 'Billboard',            category: 'Music', country: 'US' },
  { url: 'https://www.nme.com/feed',                             name: 'NME',                  category: 'Music', country: 'GB' },

  // ═══════════════════════════════════════
  // LIFESTYLE — Kenya & Africa
  // ═══════════════════════════════════════
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php',    name: 'Standard Lifestyle',   category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml',    name: 'Nation Lifestyle',     category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss',            name: 'Pulse Lifestyle',      category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.tuko.co.ke/category/lifestyle/rss/',       name: 'Tuko Lifestyle',       category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.bellanaija.com/category/living/feed/',     name: 'BellaNaija Living',    category: 'Lifestyle', country: 'NG' },
  { url: 'https://www.vogue.com/feed/rss',                       name: 'Vogue',                category: 'Lifestyle', country: 'US' },
  { url: 'https://www.elle.com/rss/all.xml/',                    name: 'Elle',                 category: 'Lifestyle', country: 'US' },

  // ═══════════════════════════════════════
  // TECHNOLOGY — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.techweez.com/feed/',                       name: 'Techweez',             category: 'Technology', country: 'KE' },
  { url: 'https://www.humanipo.com/feed/',                       name: 'HumanIPO',             category: 'Technology', country: 'KE' },
  { url: 'https://disrupt-africa.com/feed/',                     name: 'Disrupt Africa',       category: 'Technology', country: 'AF' },
  { url: 'https://techcrunch.com/feed/',                         name: 'TechCrunch',           category: 'Technology', country: 'US' },
  { url: 'https://www.theverge.com/rss/index.xml',               name: 'The Verge',            category: 'Technology', country: 'US' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',      name: 'Ars Technica',         category: 'Technology', country: 'US' },
  { url: 'https://www.wired.com/feed/rss',                       name: 'Wired',                category: 'Technology', country: 'US' },

  // ═══════════════════════════════════════
  // MOVIES — Global
  // ═══════════════════════════════════════
  { url: 'https://www.rottentomatoes.com/rss/movies_at_home.xml', name: 'Rotten Tomatoes',    category: 'Movies', country: 'US' },
  { url: 'https://www.empireonline.com/movies/feed/',             name: 'Empire Magazine',     category: 'Movies', country: 'GB' },
  { url: 'https://www.indiewire.com/feed/',                       name: 'IndieWire',           category: 'Movies', country: 'US' },
  { url: 'https://collider.com/feed/',                            name: 'Collider',            category: 'Movies', country: 'US' },
  { url: 'https://screenrant.com/feed/',                          name: 'Screen Rant',         category: 'Movies', country: 'US' },
  { url: 'https://www.slashfilm.com/feed/',                       name: 'SlashFilm',           category: 'Movies', country: 'US' },
  { url: 'https://www.cinemablend.com/rss/news',                  name: 'CinemaBlend',         category: 'Movies', country: 'US' },

];

export function getFeedsByCategory(category: string): RssFeed[] {
  return rssFeeds.filter((f) => f.category === category);
}

export function getFeedsByCountry(country: string): RssFeed[] {
  return rssFeeds.filter((f) => f.country === country);
}

export const feedUrls: string[] = rssFeeds.map((f) => f.url);
