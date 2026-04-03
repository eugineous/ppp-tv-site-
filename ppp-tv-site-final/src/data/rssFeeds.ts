export interface RssFeed {
  url: string;
  name: string;
  category: string;
  country: string;
}

export const rssFeeds: RssFeed[] = [

  // ═══════════════════════════════════════
  // ENTERTAINMENT — Kenya & Africa
  // ═══════════════════════════════════════
  { url: 'https://www.sde.co.ke/feed/',                          name: 'SDE Kenya',              category: 'Entertainment', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/feed/',                      name: 'Ghafla Kenya',           category: 'Entertainment', country: 'KE' },
  { url: 'https://www.mpasho.co.ke/feed/',                       name: 'Mpasho',                 category: 'Entertainment', country: 'KE' },
  { url: 'https://www.nairobishades.com/feed/',                  name: 'Nairobi Shades',         category: 'Entertainment', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/rss',                      name: 'Pulse Live Kenya',       category: 'Entertainment', country: 'KE' },
  { url: 'https://www.tuko.co.ke/rss/',                          name: 'Tuko Kenya',             category: 'Entertainment', country: 'KE' },
  { url: 'https://www.nairobinews.nation.africa/feed/',          name: 'Nairobi News',           category: 'Entertainment', country: 'KE' },
  { url: 'https://www.kenyans.co.ke/feeds/news',                 name: 'Kenyans.co.ke',          category: 'Entertainment', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/entertainment.php', name: 'Standard Entertainment', category: 'Entertainment', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/entertainment/rss.xml', name: 'Nation Entertainment',  category: 'Entertainment', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/entertainment/feed/',      name: 'Capital FM Ent',         category: 'Entertainment', country: 'KE' },
  { url: 'https://www.bellanaija.com/feed/',                     name: 'BellaNaija',             category: 'Entertainment', country: 'NG' },
  { url: 'https://www.pulse.ng/rss',                             name: 'Pulse Nigeria',          category: 'Entertainment', country: 'NG' },
  { url: 'https://www.pulse.com.gh/rss',                         name: 'Pulse Ghana',            category: 'Entertainment', country: 'GH' },
  { url: 'https://www.channel24.co.za/feed/',                    name: 'Channel24 SA',           category: 'Entertainment', country: 'ZA' },
  { url: 'https://www.thisisafrica.me/feed/',                    name: 'This Is Africa',         category: 'Entertainment', country: 'AF' },
  // ── ENTERTAINMENT — Global ─────────────────────────────────────────────────
  { url: 'https://variety.com/feed/',                            name: 'Variety',                category: 'Entertainment', country: 'US' },
  { url: 'https://deadline.com/feed/',                           name: 'Deadline Hollywood',     category: 'Entertainment', country: 'US' },
  { url: 'https://www.hollywoodreporter.com/feed/',              name: 'Hollywood Reporter',     category: 'Entertainment', country: 'US' },
  { url: 'https://ew.com/feed/',                                 name: 'Entertainment Weekly',   category: 'Entertainment', country: 'US' },
  { url: 'https://www.usmagazine.com/feed/',                     name: 'US Magazine',            category: 'Entertainment', country: 'US' },
  { url: 'https://pagesix.com/feed/',                            name: 'Page Six',               category: 'Entertainment', country: 'US' },
  { url: 'https://www.tmz.com/rss.xml',                          name: 'TMZ',                    category: 'Entertainment', country: 'US' },
  { url: 'https://www.etonline.com/rss',                         name: 'ET Online',              category: 'Entertainment', country: 'US' },
  { url: 'https://www.justjared.com/feed/',                      name: 'Just Jared',             category: 'Entertainment', country: 'US' },
  { url: 'https://www.people.com/feed/',                         name: 'People Magazine',        category: 'Entertainment', country: 'US' },
  { url: 'https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml', name: 'E! Online', category: 'Entertainment', country: 'US' },
  { url: 'https://www.digitalspy.com/rss/',                      name: 'Digital Spy',            category: 'Entertainment', country: 'GB' },
  { url: 'https://www.hellomagazine.com/rss/',                   name: 'Hello Magazine',         category: 'Entertainment', country: 'GB' },
  { url: 'https://www.ok.co.uk/feed/',                           name: 'OK! Magazine',           category: 'Entertainment', country: 'GB' },

  // ═══════════════════════════════════════
  // SPORTS — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.goal.com/feeds/en/news',                   name: 'Goal.com',               category: 'Sports', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/sports.php',       name: 'Standard Sports',        category: 'Sports', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/sports/rss.xml',       name: 'Nation Sports',          category: 'Sports', country: 'KE' },
  { url: 'https://www.athleticskenya.or.ke/feed/',               name: 'Athletics Kenya',        category: 'Sports', country: 'KE' },
  { url: 'https://www.bbc.co.uk/sport/rss.xml',                  name: 'BBC Sport',              category: 'Sports', country: 'GB' },
  { url: 'https://www.skysports.com/rss/12040',                  name: 'Sky Sports',             category: 'Sports', country: 'GB' },
  { url: 'https://www.espn.com/espn/rss/news',                   name: 'ESPN',                   category: 'Sports', country: 'US' },
  { url: 'https://www.supersport.com/rss/football',              name: 'SuperSport Football',    category: 'Sports', country: 'AF' },
  { url: 'https://www.cafonline.com/rss',                        name: 'CAF Online',             category: 'Sports', country: 'AF' },
  { url: 'https://www.fourfourtwo.com/rss',                      name: 'FourFourTwo',            category: 'Sports', country: 'GB' },
  { url: 'https://www.sportingnews.com/rss',                     name: 'Sporting News',          category: 'Sports', country: 'US' },
  { url: 'https://bleacherreport.com/articles/feed',             name: 'Bleacher Report',        category: 'Sports', country: 'US' },
  { url: 'https://www.si.com/rss/si_topstories.rss',             name: 'Sports Illustrated',     category: 'Sports', country: 'US' },
  { url: 'https://www.cbssports.com/rss/headlines/',             name: 'CBS Sports',             category: 'Sports', country: 'US' },
  { url: 'https://www.nba.com/rss/nba_rss.xml',                  name: 'NBA',                    category: 'Sports', country: 'US' },
  { url: 'https://www.nfl.com/rss/rsslanding.html',              name: 'NFL',                    category: 'Sports', country: 'US' },
  { url: 'https://www.uefa.com/rssfeed/',                        name: 'UEFA News',              category: 'Sports', country: 'EU' },
  { url: 'https://www.fifa.com/rss/',                            name: 'FIFA News',              category: 'Sports', country: 'INT' },
  { url: 'https://www.premierleague.com/news/rss.xml',           name: 'Premier League',         category: 'Sports', country: 'GB' },
  { url: 'https://www.transfermarkt.com/rss/news',               name: 'Transfermarkt',          category: 'Sports', country: 'DE' },
  { url: 'https://www.90min.com/feed',                           name: '90min',                  category: 'Sports', country: 'GB' },
  { url: 'https://www.givemesport.com/rss',                      name: 'GiveMeSport',            category: 'Sports', country: 'GB' },
  { url: 'https://www.talksport.com/feed/',                      name: 'talkSPORT',              category: 'Sports', country: 'GB' },
  { url: 'https://www.theguardian.com/sport/rss',                name: 'Guardian Sport',         category: 'Sports', country: 'GB' },
  { url: 'https://www.independent.co.uk/sport/rss',              name: 'Independent Sport',      category: 'Sports', country: 'GB' },
  { url: 'https://www.mirror.co.uk/sport/rss.xml',               name: 'Mirror Sport',           category: 'Sports', country: 'GB' },
  { url: 'https://www.dailymail.co.uk/sport/index.rss',          name: 'Daily Mail Sport',       category: 'Sports', country: 'GB' },
  { url: 'https://www.telegraph.co.uk/sport/rss.xml',            name: 'Telegraph Sport',        category: 'Sports', country: 'GB' },
  { url: 'https://www.sportbible.com/rss',                       name: 'SPORTbible',             category: 'Sports', country: 'GB' },
  { url: 'https://www.ladbible.com/sport/rss',                   name: 'LADbible Sport',         category: 'Sports', country: 'GB' },

  // ═══════════════════════════════════════
  // MUSIC — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.boomplay.com/blog/feed/',                  name: 'Boomplay Blog',          category: 'Music', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/music/feed/',              name: 'Capital FM Music',       category: 'Music', country: 'KE' },
  { url: 'https://www.ghafla.com/ke/category/music/feed/',       name: 'Ghafla Music',           category: 'Music', country: 'KE' },
  { url: 'https://www.tuko.co.ke/category/music/rss/',           name: 'Tuko Music',             category: 'Music', country: 'KE' },
  { url: 'https://www.bellanaija.com/category/music/feed/',      name: 'BellaNaija Music',       category: 'Music', country: 'NG' },
  { url: 'https://www.pulse.ng/entertainment/music/rss',         name: 'Pulse Music Nigeria',    category: 'Music', country: 'NG' },
  { url: 'https://pitchfork.com/rss/news',                       name: 'Pitchfork',              category: 'Music', country: 'US' },
  { url: 'https://www.rollingstone.com/music/feed/',             name: 'Rolling Stone Music',    category: 'Music', country: 'US' },
  { url: 'https://www.billboard.com/feed/',                      name: 'Billboard',              category: 'Music', country: 'US' },
  { url: 'https://www.nme.com/feed',                             name: 'NME',                    category: 'Music', country: 'GB' },
  { url: 'https://www.spin.com/feed/',                           name: 'Spin',                   category: 'Music', country: 'US' },
  { url: 'https://www.stereogum.com/feed/',                      name: 'Stereogum',              category: 'Music', country: 'US' },
  { url: 'https://www.consequence.net/feed/',                    name: 'Consequence of Sound',   category: 'Music', country: 'US' },
  { url: 'https://www.loudwire.com/feed/',                       name: 'Loudwire',               category: 'Music', country: 'US' },
  { url: 'https://www.xxlmag.com/feed/',                         name: 'XXL Magazine',           category: 'Music', country: 'US' },
  { url: 'https://www.complex.com/music/rss',                    name: 'Complex Music',          category: 'Music', country: 'US' },
  { url: 'https://www.hotnewhiphop.com/rss/news.xml',            name: 'HotNewHipHop',           category: 'Music', country: 'US' },
  { url: 'https://www.rap-up.com/feed/',                         name: 'Rap-Up',                 category: 'Music', country: 'US' },
  { url: 'https://www.vibe.com/feed/',                           name: 'Vibe Magazine',          category: 'Music', country: 'US' },
  { url: 'https://www.okayafrica.com/feed/',                     name: 'OkayAfrica',             category: 'Music', country: 'AF' },
  { url: 'https://www.afropop.org/feed',                         name: 'Afropop Worldwide',      category: 'Music', country: 'AF' },
  { url: 'https://www.notjustok.com/feed/',                      name: 'NotJustOk',              category: 'Music', country: 'NG' },
  { url: 'https://www.tooxclusive.com/feed/',                    name: 'TooXclusive',            category: 'Music', country: 'NG' },
  { url: 'https://www.jaguda.com/feed/',                         name: 'Jaguda',                 category: 'Music', country: 'NG' },
  { url: 'https://www.360nobs.com/feed/',                        name: '360Nobs',                category: 'Music', country: 'NG' },

  // ═══════════════════════════════════════
  // LIFESTYLE — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.standardmedia.co.ke/rss/lifestyle.php',    name: 'Standard Lifestyle',     category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.nation.africa/kenya/lifestyle/rss.xml',    name: 'Nation Lifestyle',       category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.pulselive.co.ke/lifestyle/rss',            name: 'Pulse Lifestyle',        category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.tuko.co.ke/category/lifestyle/rss/',       name: 'Tuko Lifestyle',         category: 'Lifestyle', country: 'KE' },
  { url: 'https://www.bellanaija.com/category/living/feed/',     name: 'BellaNaija Living',      category: 'Lifestyle', country: 'NG' },
  { url: 'https://www.vogue.com/feed/rss',                       name: 'Vogue',                  category: 'Lifestyle', country: 'US' },
  { url: 'https://www.elle.com/rss/all.xml/',                    name: 'Elle',                   category: 'Lifestyle', country: 'US' },
  { url: 'https://www.harpersbazaar.com/rss/all.xml/',           name: "Harper's Bazaar",        category: 'Lifestyle', country: 'US' },
  { url: 'https://www.cosmopolitan.com/rss/all.xml/',            name: 'Cosmopolitan',           category: 'Lifestyle', country: 'US' },
  { url: 'https://www.gq.com/feed/rss',                          name: 'GQ',                     category: 'Lifestyle', country: 'US' },
  { url: 'https://www.esquire.com/rss/all.xml/',                 name: 'Esquire',                category: 'Lifestyle', country: 'US' },
  { url: 'https://www.menshealth.com/rss/all.xml/',              name: "Men's Health",           category: 'Lifestyle', country: 'US' },
  { url: 'https://www.womenshealthmag.com/rss/all.xml/',         name: "Women's Health",         category: 'Lifestyle', country: 'US' },
  { url: 'https://www.health.com/rss/all.xml/',                  name: 'Health.com',             category: 'Lifestyle', country: 'US' },
  { url: 'https://www.self.com/feed/rss',                        name: 'Self',                   category: 'Lifestyle', country: 'US' },
  { url: 'https://www.refinery29.com/en-us/rss.xml',             name: 'Refinery29',             category: 'Lifestyle', country: 'US' },
  { url: 'https://www.bustle.com/rss',                           name: 'Bustle',                 category: 'Lifestyle', country: 'US' },
  { url: 'https://www.popsugar.com/feed/',                       name: 'PopSugar',               category: 'Lifestyle', country: 'US' },
  { url: 'https://www.instyle.com/rss/all.xml/',                 name: 'InStyle',                category: 'Lifestyle', country: 'US' },
  { url: 'https://www.allure.com/feed/rss',                      name: 'Allure',                 category: 'Lifestyle', country: 'US' },
  { url: 'https://www.byrdie.com/rss',                           name: 'Byrdie',                 category: 'Lifestyle', country: 'US' },
  { url: 'https://www.wellandgood.com/feed/',                    name: 'Well+Good',              category: 'Lifestyle', country: 'US' },
  { url: 'https://www.mindbodygreen.com/rss',                    name: 'MindBodyGreen',          category: 'Lifestyle', country: 'US' },
  { url: 'https://www.foodandwine.com/rss/all.xml/',             name: 'Food & Wine',            category: 'Lifestyle', country: 'US' },
  { url: 'https://www.bonappetit.com/feed/rss',                  name: 'Bon Appetit',            category: 'Lifestyle', country: 'US' },
  { url: 'https://www.epicurious.com/feed/rss',                  name: 'Epicurious',             category: 'Lifestyle', country: 'US' },
  { url: 'https://www.seriouseats.com/atom.xml',                 name: 'Serious Eats',           category: 'Lifestyle', country: 'US' },
  { url: 'https://www.eater.com/rss/index.xml',                  name: 'Eater',                  category: 'Lifestyle', country: 'US' },
  { url: 'https://www.thekitchn.com/main.rss',                   name: 'The Kitchn',             category: 'Lifestyle', country: 'US' },

  // ═══════════════════════════════════════
  // TECHNOLOGY — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.techweez.com/feed/',                       name: 'Techweez',               category: 'Technology', country: 'KE' },
  { url: 'https://www.humanipo.com/feed/',                       name: 'HumanIPO',               category: 'Technology', country: 'KE' },
  { url: 'https://disrupt-africa.com/feed/',                     name: 'Disrupt Africa',         category: 'Technology', country: 'AF' },
  { url: 'https://techcrunch.com/feed/',                         name: 'TechCrunch',             category: 'Technology', country: 'US' },
  { url: 'https://www.theverge.com/rss/index.xml',               name: 'The Verge',              category: 'Technology', country: 'US' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index',      name: 'Ars Technica',           category: 'Technology', country: 'US' },
  { url: 'https://www.wired.com/feed/rss',                       name: 'Wired',                  category: 'Technology', country: 'US' },
  { url: 'https://www.engadget.com/rss.xml',                     name: 'Engadget',               category: 'Technology', country: 'US' },
  { url: 'https://www.cnet.com/rss/news/',                       name: 'CNET',                   category: 'Technology', country: 'US' },
  { url: 'https://www.zdnet.com/news/rss.xml',                   name: 'ZDNet',                  category: 'Technology', country: 'US' },
  { url: 'https://www.pcmag.com/rss/news',                       name: 'PCMag',                  category: 'Technology', country: 'US' },
  { url: 'https://www.tomsguide.com/feeds/all',                  name: "Tom's Guide",            category: 'Technology', country: 'US' },
  { url: 'https://www.tomshardware.com/feeds/all',               name: "Tom's Hardware",         category: 'Technology', country: 'US' },
  { url: 'https://www.digitaltrends.com/feed/',                  name: 'Digital Trends',         category: 'Technology', country: 'US' },
  { url: 'https://www.gizmodo.com/rss',                          name: 'Gizmodo',                category: 'Technology', country: 'US' },
  { url: 'https://mashable.com/feeds/rss/all',                   name: 'Mashable',               category: 'Technology', country: 'US' },
  { url: 'https://venturebeat.com/feed/',                        name: 'VentureBeat',            category: 'Technology', country: 'US' },
  { url: 'https://www.fastcompany.com/technology/rss',           name: 'Fast Company Tech',      category: 'Technology', country: 'US' },
  { url: 'https://www.technologyreview.com/feed/',               name: 'MIT Tech Review',        category: 'Technology', country: 'US' },
  { url: 'https://www.axios.com/technology/rss',                 name: 'Axios Tech',             category: 'Technology', country: 'US' },
  { url: 'https://www.sciencedaily.com/rss/top/technology.xml',  name: 'ScienceDaily Tech',      category: 'Technology', country: 'US' },
  { url: 'https://phys.org/rss-feed/technology-news/',           name: 'Phys.org Tech',          category: 'Technology', country: 'US' },
  { url: 'https://www.newscientist.com/feed/home/',              name: 'New Scientist',          category: 'Technology', country: 'GB' },

  // ═══════════════════════════════════════
  // MOVIES — Global
  // ═══════════════════════════════════════
  { url: 'https://www.rottentomatoes.com/rss/movies_at_home.xml', name: 'Rotten Tomatoes',       category: 'Movies', country: 'US' },
  { url: 'https://www.empireonline.com/movies/feed/',             name: 'Empire Magazine',        category: 'Movies', country: 'GB' },
  { url: 'https://www.indiewire.com/feed/',                       name: 'IndieWire',              category: 'Movies', country: 'US' },
  { url: 'https://collider.com/feed/',                            name: 'Collider',               category: 'Movies', country: 'US' },
  { url: 'https://screenrant.com/feed/',                          name: 'Screen Rant',            category: 'Movies', country: 'US' },
  { url: 'https://www.slashfilm.com/feed/',                       name: 'SlashFilm',              category: 'Movies', country: 'US' },
  { url: 'https://www.cinemablend.com/rss/news',                  name: 'CinemaBlend',            category: 'Movies', country: 'US' },
  { url: 'https://www.ign.com/articles/rss',                      name: 'IGN',                    category: 'Movies', country: 'US' },
  { url: 'https://www.polygon.com/rss/index.xml',                 name: 'Polygon',                category: 'Movies', country: 'US' },
  { url: 'https://www.avclub.com/rss',                            name: 'AV Club',                category: 'Movies', country: 'US' },
  { url: 'https://www.rogerebert.com/feed',                       name: 'RogerEbert.com',         category: 'Movies', country: 'US' },
  { url: 'https://www.denofgeek.com/feed/',                       name: 'Den of Geek',            category: 'Movies', country: 'GB' },
  { url: 'https://www.looper.com/feed/',                          name: 'Looper',                 category: 'Movies', country: 'US' },
  { url: 'https://www.cbr.com/feed/',                             name: 'CBR',                    category: 'Movies', country: 'US' },
  { url: 'https://www.movieweb.com/feed/',                        name: 'MovieWeb',               category: 'Movies', country: 'US' },
  { url: 'https://www.joblo.com/feed/',                           name: 'JoBlo',                  category: 'Movies', country: 'US' },

  // ═══════════════════════════════════════
  // NEWS — Kenya & Africa & Global
  // ═══════════════════════════════════════
  { url: 'https://www.nation.africa/kenya/rss.xml',              name: 'Nation Africa',          category: 'News', country: 'KE' },
  { url: 'https://www.standardmedia.co.ke/rss/headlines.php',    name: 'Standard Media',         category: 'News', country: 'KE' },
  { url: 'https://www.the-star.co.ke/rss/',                      name: 'The Star Kenya',         category: 'News', country: 'KE' },
  { url: 'https://www.kbc.co.ke/feed/',                          name: 'KBC Kenya',              category: 'News', country: 'KE' },
  { url: 'https://www.citizen.digital/feed',                     name: 'Citizen Digital',        category: 'News', country: 'KE' },
  { url: 'https://www.capitalfm.co.ke/news/feed/',               name: 'Capital FM News',        category: 'News', country: 'KE' },
  { url: 'https://www.peopledailykenya.com/feed/',               name: 'People Daily Kenya',     category: 'News', country: 'KE' },
  { url: 'https://www.theeastafrican.co.ke/tea/rss.xml',         name: 'The East African',       category: 'News', country: 'EA' },
  { url: 'https://www.africanews.com/feed/rss2/',                name: 'Africa News',            category: 'News', country: 'AF' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml',            name: 'Al Jazeera',             category: 'News', country: 'AF' },
  { url: 'https://www.bbc.co.uk/africa/rss.xml',                 name: 'BBC Africa',             category: 'News', country: 'AF' },
  { url: 'https://www.vanguardngr.com/feed/',                    name: 'Vanguard Nigeria',       category: 'News', country: 'NG' },
  { url: 'https://www.premiumtimesng.com/feed/',                 name: 'Premium Times Nigeria',  category: 'News', country: 'NG' },
  { url: 'https://www.timeslive.co.za/rss/',                     name: 'Times Live SA',          category: 'News', country: 'ZA' },
  { url: 'https://www.news24.com/rss',                           name: 'News24 SA',              category: 'News', country: 'ZA' },
  { url: 'https://www.monitor.co.ug/feed/',                      name: 'Daily Monitor Uganda',   category: 'News', country: 'UG' },
  { url: 'https://www.thecitizen.co.tz/feed/',                   name: 'The Citizen Tanzania',   category: 'News', country: 'TZ' },
  { url: 'https://www.myjoyonline.com/feed/',                    name: 'Joy Online Ghana',       category: 'News', country: 'GH' },
  { url: 'https://www.reuters.com/rssFeed/topNews',              name: 'Reuters',                category: 'News', country: 'INT' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml',                name: 'BBC News',               category: 'News', country: 'GB' },
  { url: 'https://rss.cnn.com/rss/edition.rss',                  name: 'CNN',                    category: 'News', country: 'US' },
  { url: 'https://www.theguardian.com/world/rss',                name: 'The Guardian World',     category: 'News', country: 'GB' },
  { url: 'https://www.independent.co.uk/news/world/rss',         name: 'The Independent',        category: 'News', country: 'GB' },
  { url: 'https://www.dailymail.co.uk/news/index.rss',           name: 'Daily Mail',             category: 'News', country: 'GB' },
  { url: 'https://www.mirror.co.uk/news/rss.xml',                name: 'The Mirror',             category: 'News', country: 'GB' },
  { url: 'https://www.telegraph.co.uk/news/rss.xml',             name: 'The Telegraph',          category: 'News', country: 'GB' },

];

export function getFeedsByCategory(category: string): RssFeed[] {
  return rssFeeds.filter((f) => f.category === category);
}

export function getFeedsByCountry(country: string): RssFeed[] {
  return rssFeeds.filter((f) => f.country === country);
}

export const feedUrls: string[] = rssFeeds.map((f) => f.url);
