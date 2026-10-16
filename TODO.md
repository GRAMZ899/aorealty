# A&O Real Estate Solutions — Full Marketplace TODO

## 1. Persistent marketplace data and seeded Uganda listings
- [x] Add persistent tables for properties, property images, saved properties, inquiries, and moderation metadata while preserving the existing users table and OAuth identity.
- [x] Store listing mode, property type, title, description, location, price, bedrooms, bathrooms, area, status, owner/agent, moderation note, and timestamps.
- [x] Seed a small set of approved Uganda listings only when the properties table is empty; never overwrite user-created records on restart.
- [x] Generate and apply additive Drizzle migrations against the managed MySQL database.

## 2. Public property discovery
- [x] Visitors can browse approved land, house, apartment, rental, and commercial listings from the database.
- [x] Visitors can filter by location, listing mode, property type, minimum and maximum price, and minimum bedrooms.
- [x] Visitors can sort results by recommended, newest, price low-to-high, and price high-to-low.
- [x] Visitors can open a property detail route with gallery/image, facts, location, price, owner/agent summary, and availability/status.
- [x] Public routes remain usable without login and show empty/error/loading states.

## 3. Account, saved-property, and inquiry flows
- [x] Sign in uses the existing Manus OAuth flow and the `webdev_app_session` cookie compatibility contract.
- [x] Signed-in users can save and unsave a property and view their saved properties in the dashboard.
- [x] A user can submit an inquiry with name, email, phone, and message associated with a property; the inquiry is persisted and visible in the user dashboard.
- [x] The dashboard shows saved properties, submitted inquiries, and clear status/next-step messaging.

## 4. Owner/agent listing submission
- [x] Authenticated users can submit a property listing with title, description, location, price, listing mode, property type, bedrooms, bathrooms, area, and one or more image URLs.
- [x] New listings are stored as pending and are not publicly visible until approved by an admin.
- [x] The submitter can see their listing status and moderation note in the dashboard.
- [x] Validation prevents missing required values and rejects invalid price/bedroom/area values.

## 5. Admin moderation
- [x] Admins can view pending listings with their submitter and property details.
- [x] Admins can approve a listing to make it publicly visible or reject it with a moderation note.
- [x] Non-admin users cannot access admin procedures or moderation routes.
- [x] Admins can see recent inquiries and high-level marketplace counts.

## 6. Production serving and delivery
- [x] Add the complete page route manifest for public discovery, property details, account dashboard, listing submission, and admin moderation.
- [x] Configure server-backed container publishing with `/api/health` and a runtime listener honoring `PORT`.
- [x] Run TypeScript diagnostics, tests, database migration, production build, and endpoint smoke checks.
- [x] Commit and push the finished marketplace implementation to the canonical GitHub repository and deploy the live server-backed project.
