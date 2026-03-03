A lightweight, daily-updated tracker of **competitions / challenges / grants / programs** where you can submit projects and potentially win prizes (hackathons, startup challenges, research grants).

## Powered by Exa API 

This project uses **Exa** as its search provider — after repetedly trying other providers like Brave or DuckDuckGo. Here's why:

### Why Exa?
- **Neural search** instead of keyword matching — understands intent much better than Brave
- **Fresh results** with automatic date filtering - Found that Exa's searches are ranked better, in Brave I needed a reranker of my own
- **Autoprompt** — lets Exa optimize queries automatically
- **Fast, reliable, and cost-effective** for agentic workloads

### Usage in this project
- **Search queries per recipient:** 5-8 personalized queries generated per user using few-shot prompting
- **Exa API calls:** Direct HTTP POST to `https://api.exa.ai/search`
- **numResults:** 8 results per query
- **useAutoprompt:** enabled for smarter result ranking
- **startPublishedDate:** filters to last 30 days for fresh opportunities
- **Total searches/day:** ~40-50 queries (8 recipients × 5-8 queries each)
- **No contents endpoint** — we fetch search result URLs separately with web_fetch for evidence extraction

### Other Data Sources
- **Hacker News Jobs** — Firebase API for early-stage job postings
- **Google Sheets** — Public grants/fellowships spreadsheet (CSV export)
- **Substack** — Harsehaj's newsletter as fallback lead

## How updates work
- A daily cron job runs web searches, curates a short list, and writes a dated update in `updates/`.
- Each update includes: name, deadline (if found), prize/benefit, eligibility/notes, and link.

## Latest
- **[2026-03-03](updates/2026-03-03.md)** - 50+ curated oppurtunities 
- **[2026-03-02](updates/2026-03-02.md)** — 5 validated items: KDD 2026 Travel Award (Seoul, June 11), ACM-W Scholarship ($1200, deadline April 15), NVIDIA GTC Student Experience (Mar 16, free), NVIDIA SJSU Hackathon (Mar 16, free), HackPSU travel ($110, Mar 28)
- **[2026-02-26](updates/2026-02-26.md)** — 6 new items: ICLR 2026 Financial Assistance (Rio, deadline March 1), ICML 2026 (Seoul, free reg+hotel), PyCon US 2026 (deadline TODAY), RECOMB Travel Fellowships, HackPSU travel ($110), e-Fest Entrepreneurship ($10K)
- **[2026-02-23](updates/2026-02-23.md)** — Refresh run: 7 opps (Thiel, Emergent, Z Fellows, LA Hacks, 1517 Medici, Bitcamp, HackPSU) - Personalized for AI/Bio-Agents
- **[2026-02-22](updates/2026-02-22.md)** — Refresh run: 8 opps (Gemini Live Agent, AI Dev Days, GSoC, DEBUT, America's Startup, YC S26) - Personalized for AI/Bio-Tech
- **[2026-02-21](updates/2026-02-21.md)** — Refresh run: 11 opps (Agents & Robotics, nf-core Bio, World Bank, e-Fest, Arch Grants, Thiel)
- **[2026-02-20](updates/2026-02-20.md)** — 17 opps: GTC Golden Ticket (deadline TODAY), Google.org AI Gov challenge (NEW), hackathons, pitch comps, EU grants
