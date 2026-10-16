# A&O Real Estate Solutions — Full Marketplace Plan

## Scope

Convert the current branded prototype into a server-backed marketplace MVP for Uganda property discovery and listing management.

Required product behavior:

- Visitors can browse approved land, house, apartment, rental, and commercial listings from persistent database records.
- Visitors can filter listings by location, listing mode, property type, price range, and bedrooms, sort results, and open a property detail view.
- Signed-in users authenticate through the existing Manus OAuth flow, save/unsave properties, submit inquiries, and view their saved properties and inquiry history.
- Property owners/agents can submit a listing with title, description, location, price, listing mode, property type, bedrooms, baths, area, and image URLs; new listings enter a pending approval state.
- Admin users can review pending listings and approve or reject them with a moderation note.
- Admin and owner/agent dashboards show appropriate listing, inquiry, and moderation states.
- Inquiry forms persist contact details and messages in the database and associate them with a listing and signed-in user when available.
- The current premium A&O visual language remains intact: navy, gold, white, editorial serif headlines, dense marketplace cards, and responsive mobile layouts.

## Implementation approach

- Enable the managed Server and MySQL Database resources already accepted for this project.
- Extend the existing Drizzle schema with marketplace tables: user profiles/roles, properties, property images, saved properties, inquiries, and listing moderation metadata.
- Keep Manus OAuth and the existing `webdev_app_session` cookie behavior. Add role-aware protected tRPC procedures for users, listing owners/agents, and admins.
- Add deterministic migrations and seed a small set of Uganda listings only when the properties table is empty, so development and production share consistent demo content without overwriting user-created records.
- Use the existing Express/tRPC server for all data operations. The frontend calls typed tRPC procedures through the current React Query client.
- Support image URLs in the first marketplace release and keep the schema ready for durable `/manus-storage/` asset keys; this avoids exposing storage credentials while keeping listing creation usable immediately.
- Keep the homepage as the public discovery surface and add dedicated routes for `/properties`, `/properties/:id`, `/dashboard`, `/list-property`, `/admin`, `/login`, and `/404`.
- Configure the project for container publishing with a health endpoint because the marketplace now needs a server and database at runtime.

## Project structure

- `client/src/App.tsx`: route map and shared providers.
- `client/src/pages/Home.tsx`: branded public homepage and discovery entry point.
- `client/src/pages/Properties.tsx`: persistent listing search, filters, sort, and cards.
- `client/src/pages/PropertyDetail.tsx`: listing details, gallery, save action, inquiry form, and mortgage estimator.
- `client/src/pages/Dashboard.tsx`: saved properties, inquiries, and owned listing management.
- `client/src/pages/ListProperty.tsx`: authenticated listing submission form.
- `client/src/pages/Admin.tsx`: pending listing moderation and inquiry overview.
- `client/src/components/MarketplaceShell.tsx`: shared navigation and account actions.
- `server/routers.ts`: typed public, protected, owner, and admin marketplace procedures.
- `server/db.ts`: Drizzle queries, safe seed logic, and role/listing helpers.
- `drizzle/schema.ts`: persistent marketplace schema.
- `drizzle/`: additive migrations generated from the schema.
- `client/public/manus-routes.json`: complete page route manifest.

## Design

### Design Movement
- **Editorial African modernism (0.06):** premium property journal cues, warm gold accents, and confident navy structure.
- **Quiet luxury (0.04):** restrained typography, spacious cards, and understated interaction states.
- **Civic marketplace utility (0.08):** data-forward filters, clear trust signals, and workflow-first dashboards.

Chosen direction: **Editorial African modernism**.

### Core Principles
1. **Trust before urgency:** verified states, clear prices, transparent property facts, and visible inquiry history.
2. **Editorial confidence:** serif headlines and image-led property cards make every listing feel considered.
3. **Fast decisions:** filters, sort, saves, and inquiry actions stay close to the listing context.
4. **Local relevance:** Uganda-first locations, UGX formatting, and language that reflects land, homes, rentals, and commercial property.

### Color Philosophy
Navy communicates diligence, reliability, and institutional trust; gold signals opportunity and ownership without becoming loud; white and pale blue-gray keep dense marketplace information calm and legible.

### Layout Paradigm
Use a layered marketplace canvas: an image-led hero, a floating search rail, editorial section bands, and workflow dashboards that use asymmetric split panels rather than one undifferentiated grid.

### Signature Elements
- Gold hairline eyebrow rules paired with editorial serif section titles.
- Navy listing cards with gold verification chips and compact data rows.
- Circular A&O mark repeated as a trust seal beside verified status and actions.

### Interaction Philosophy
Every action gives immediate local feedback: saved state changes in-place, filters update result counts, forms show clear validation, and moderation states are visible rather than hidden behind generic success messages.

### Animation
Use short 160–220ms lift/fade transitions for cards, buttons, filter changes, and notices. Avoid decorative motion in dashboards; use a subtle skeleton only during network fetches.

### Typography System
Use Inter/system sans for controls, metadata, and forms. Use Georgia/Times New Roman for page titles, listing titles, and editorial section headings. Keep labels uppercase and tracked, with gold or muted navy eyebrow treatments.

### Brand Essence
A&O is the trusted Ugandan property marketplace for people moving, investing, and building with confidence. Personality: **grounded, discerning, dependable**.

### Brand Voice
Headlines are confident and forward-looking; CTAs are specific and active; microcopy explains what happens next.

- “Find the place that moves your story forward.”
- “Your listing is submitted for review — we’ll keep you posted.”

### Wordmark & Logo
A compact circular A&O monogram with a small upward star/cross reference, paired with the stacked “A&O Real Estate Solutions” wordmark.

### Signature Brand Color
**A&O Gold — `#D6A51B`**, used for action, opportunity, and verification moments.
