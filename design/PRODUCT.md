# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

WordPress: a block theme with an IDX plugin, hosted on Cloudways. Confirmed by Jeremy, October 2026. The specific IDX vendor is not chosen yet.

## Users

REWAP serves people making real estate decisions anywhere in Massachusetts:

- **Buyers, including relocating and moving-up households.** Their question: where can I afford to live, and how does each town fit how we live and commute?
- **Sellers.** Their question: what is my property worth, and how do I sell it well?
- **Investors.** Their question: which blocks and building types make sense to own?
- **Agents, teams and partners working under REWAP**, for example The Oberdorfer Group.

Priority is balanced: no single audience leads. When their needs conflict, the place-based area guides (Sheets) are the shared front door, and each audience branches from there.

## Product Purpose

REWAP Brokerage LLC is a Massachusetts real estate brokerage based in Worcester, serving the whole state; coverage is not limited to Worcester or Central Massachusetts (confirmed by Jeremy, October 2026). Its website aims to make REWAP the recognized authority on understanding Massachusetts places, not just another site showing homes for sale.

Success means the site is compelling and useful even with every listing removed. Its local knowledge layer should become an organic-search and AI-answer-engine moat.

## Positioning

"We understand the place behind the property." REWAP explains places: streets, building types, landmarks, commutes and what is changing.

What a neighboring brokerage cannot truthfully copy: REWAP was founded by Hong Tran, a real estate lawyer. That supports a promise about clarity on documents and obligations ("the place and the paper") as well as local knowledge.

## Operating Context

- **Office:** 652 Park Ave, Worcester, MA 01603.
- **Public contact:** 508-509-7759 and hongtran@lehonglaw.com, both from rewapbrokerage.com.
- **Current site:** a "coming soon" page at rewapbrokerage.com.
- **Geography:** all 351 Massachusetts cities and towns, grouped into nine regions: Berkshires, Pioneer Valley, Central Massachusetts, MetroWest, North Shore & Merrimack Valley, Greater Boston, South Shore, South Coast, Cape & Islands.
- **Depth:** every region is presented with equal weight from launch, not grown outward from Worcester (confirmed by Jeremy, October 2026). That requires every region to be researched to the same depth before go-live.
- **Listings:** will come from the Massachusetts MLS (MLS PIN, expected) through IDX. That brings IDX display and attribution rules: listing brokerage and MLS number shown on every listing.
- **Public data sources:** MassGIS, municipal records, the Worcester District Registry of Deeds, MBTA, and MA DESE for schools.

## Capabilities and Constraints

**Planned capabilities**
- An interactive branded map with area hover and select, a list twin for every map view, and draw-a-search-area.
- Property search with map and list kept in sync, clustering, and saved searches and listings.
- Listing pages.
- Area guides ("Sheets") at /regions/{region}/, /areas/{town}/ and /areas/{city}/{neighborhood}/.
- An editorial layer ("Field Notes") and sourced market data panels ("Readings").
- Brokerage, team and agent relationship display.
- Structured data (JSON-LD) for search and AI answer engines.

**Data model**
- Provider-neutral entities: Brokerage, Office, Person, License, Team, Property, Listing, Area, Article, Lead, SavedSearch, IDXProvider, Site.
- Designed to power more brokerages, team sites, agent microsites and area microsites later.

**Map**
- Provider-agnostic. MapLibre with OpenStreetMap vector tiles is assumed; the final decision is open.

**Fair housing (hard constraint)**
- Content describes places, buildings and services, never residents.
- No "safe," "family-friendly," "perfect for…"
- No school ratings in REWAP's own words; link to official sources only.

**Open decisions**
- IDX vendor.
- Map tile provider.
- The research and staffing plan for covering all nine regions equally before launch.
- Languages served beyond English.

## Brand Commitments

- **Logo:** the current REWAP logo is the primary identity mark and must not be replaced. It is a navy key (#193661) carrying "REWAP" in gold (#FAAF40) and white, with a skyline on the shaft and "BROKERAGE" in sans, plus a compact circular mark. Because the logo already contains a key, roofline and skyline, the rest of the system never repeats those motifs.
- **Brand concept:** "The Massachusetts Atlas" (renamed from "The Worcester Atlas," October 2026). Identity is built around place, not houses, keys or luxury cliché. Worcester is the home office, not the boundary.
- **Voice:** specific before superlative; places, not people; every number shows its source; plain words with legal precision; confident, never pushy.
- **The Oberdorfer Group:** a confirmed affiliated team operating under REWAP Brokerage LLC. Confirmed by Jeremy, October 2026.
  - It must always be shown as a distinct team with REWAP as brokerage of record, never as the same company or a separate brokerage.
  - The brokerage name always gets equal or greater prominence.
  - Exact affiliation wording is reviewed against 254 CMR and MLS rules.

## Evidence on Hand

**Assets**
- Logo files captured byte-exact from rewapbrokerage.com: REWAP-long-logo-full-colors-web.png (380×152) and the short circular mark (300×300 original, 192 px WebP copy). Uploaded to the concept canvas as assets.
- Brand book and website concept: the canvas "REWAP — The Massachusetts Atlas" (Design artifact 8dprXYxDNhWgKZXAizeHV1), with nine artboards under project/.

**Absent (must not be fabricated)**
- Testimonials and reviews.
- Awards and rankings.
- Transaction counts, sales volume and market statistics.
- Agent roster and team member list.
- Founder biography and portrait.
- Brokerage license number and broker of record.
- Vector logo masters.
- Photography.

Demo listings and values must stay visibly labeled as demo or sample until IDX is live. Readings stay empty rather than estimated.

## Product Principles

1. **Place first, property second.** Every listing sits inside its area context; every area is useful without listings.
2. **Prove, don't claim.** Original, dated, sourced local knowledge is the differentiator. Unverifiable claims are never published.
3. **Clarity about the paper.** The lawyer-founder advantage shows up as process and plain-English explanation, never as legal advice or boasts.
4. **Relationships are explicit.** Brokerage, team, agent and listing-broker relationships are always stated, generated from data, and compliant.
5. **The map is never the only way in.** Every map interaction has a list or keyboard equivalent.

## Accessibility & Inclusion

- WCAG 2.2 AA is the floor.
- Map features need list and keyboard equivalents.
- Respect reduced-motion settings.
- Touch targets at least 44 px.
- Alt text describes spaces and views, not people.
- Fair-housing language rules apply to all content.
