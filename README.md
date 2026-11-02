# RescuePlate — Every Meal Matters 🍲🌱

> **Hackathon Theme:** *"A Better Tomorrow: Build a website that addresses a social or moral issue and inspires people to take small steps toward creating positive change."*  
> **Product Tagline:** *Every Meal Matters.*  
> **Core Message:** *Good food deserves another chance.*

---

## 🌟 Executive Summary

**RescuePlate** connects commercial food donors (restaurants, hotels, college hostels, event caterers) with eligible recipient organizations (community kitchens, night shelters, youth centers) and authorized volunteer runners to coordinate the responsible redistribution of surplus edible food.

Every day, vast quantities of freshly prepared, high-quality food are discarded due to communication gaps, coordination bottlenecks, and liability concerns, while millions in vulnerable communities face food insecurity. RescuePlate solves this using a **closed-loop verification architecture** featuring:
- Strict **HACCP food safety & allergen specifications**
- **Smart Rescue Matching** (an explainable, transparent deterministic scoring engine)
- **Cryptographic 6-character pickup verification codes** to prevent unauthorized collections
- **Real-time Impact Dashboards** tracking meals rescued, kilograms saved, and avoided greenhouse gas emissions (EPA WARM model).

---

## 🎨 Visual Identity & Brand Design

- **Deep Forest Green** (`#153E35`): Trust, sustainability, and longevity.
- **Primary Green** (`#27835D`): Vitality, action, and nature.
- **Fresh Mint** (`#C8F0B8`): Warm accents, badges, and positive alerts.
- **Warm Off-White** (`#FAF9F4`): Generous, approachable whitespace.
- **Charcoal** (`#202A27`): High-contrast, accessible typography.
- **Soft Coral** (`#F28B75`): Subtle urgency alerts and donation highlights.

---

## 🚀 2-Minute Judge Demonstration Walkthrough

You can test the entire end-to-end platform workflow in the browser without any setup or third-party accounts:

### Step 1: Donor Lists Surplus Food (`/donate`)
1. Ensure the **Active Persona** in the top Demo Bar is set to **Donor** (Chef Marcus Vance — *The Grand Pavilion Hotel*).
2. Click **"Donate Surplus Food"** or navigate to `/donate`.
3. Review the pre-filled fields (or customize your own batch: title, category, quantity, hot holding/cold storage, allergens, and pickup deadline).
4. Check the **Food Safety & Good Samaritan Affirmation** box.
5. Click **"Publish Surplus Food Listing"**. Your new listing is immediately saved and published to the live marketplace!

### Step 2: Recipient Discovers & Claims (`/donations`)
1. In the top Demo Bar, switch to **Recipient Org** (Elena Rostova — *Hope Community Kitchen & Shelter*).
2. Go to **Explore Donations** (`/donations`).
3. Click the **"Match"** button on any listing to inspect the **Smart Rescue Matching Engine**, displaying transparent compatibility scores based on transit distance, kitchen intake capacity, and cold storage feasibility.
4. Click **"View Details"** on any available donation and click **"Claim Donation for Organization"**.
5. The platform confirms the claim, locks the listing from duplicate claims, and issues a **unique 6-character cryptographic pickup code** (e.g., `RP-4829`).

### Step 3: Volunteer Collects & Verifies (`/pickups`)
1. Switch to **Volunteer** (David Chen — *Metro Food Runners*).
2. Go to **Pickups & Deliveries** (`/pickups`).
3. Click **"Verify & Collect Handover"**.
4. Enter the donor's 6-character pickup code (e.g., `RP-4829`). The system authenticates the code against the database, updates the batch to `IN TRANSIT`, and logs the physical handover.
5. Once arrived at the shelter, click **"Confirm Safe Recipient Delivery"**.

### Step 4: Live Impact Updates (`/impact`)
1. Go to the **Impact Dashboard** (`/impact`).
2. Observe how **Total Rescued Meals**, **Food Saved (kg)**, and **Avoided CO2e (kg)** update immediately reflecting your newly completed delivery.
3. Inspect the **Verified Handover Records Ledger** to view the signed audit receipt.

*(To start over at any time, click **"Reset Demo"** in the top bar).*

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Client Routing:** PushState Router with full deep-linking (`/`, `/donations`, `/donations/:id`, `/donate`, `/pickups`, `/impact`, `/about`, `/how-it-works`, `/dashboard`, `/profile`, `/admin`)
- **Data Architecture:** Reactive in-memory & `localStorage` store with live event emitters; Supabase Postgres schema & migrations included for production deployment.
- **Charts:** Custom responsive SVG data visualizations (monthly redistribution trends & food category distribution).
- **Validation:** Type-safe checks for positive quantities, valid chronological deadlines, and food safety checklists.

---

## 📦 Installation & Running Locally

### Development Server
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Automated Logic & State Machine Tests
```bash
npm test
```

---

## 🗄️ Database Schema & Supabase Setup

Full production migrations are located in `supabase/migrations/20261102000000_create_rescueplate_schema.sql`:
- **`profiles`**: User identities, roles (`donor`, `recipient`, `volunteer`, `admin`), verification flags.
- **`organizations`**: Certified venues, coordinates, refrigeration status, and intake capacities.
- **`donations`**: Surplus listings with HACCP storage requirements, allergens, and collection deadlines.
- **`donation_claims`**: Recipient claims with unique pickup security codes.
- **`pickups`**: Delivery milestones (`pending` &rarr; `scheduled` &rarr; `in_transit` &rarr; `delivered`).
- **`impact_events`**: Immutable records of meals served, kg diverted, and CO2e avoided.
- **`audit_logs` & `reports`**: Tamper-evident ledger of administrative actions and community safety flags.
- **Row Level Security (RLS)**: Fine-grained policies ensuring donors only edit their own listings and recipients cannot tamper with other claims.

---

## ⚖️ Legal Protections & Food Safety (HACCP)

RescuePlate operates within the legal protections established by the **Bill Emerson Good Samaritan Food Donation Act** (42 U.S. Code § 1791), shielding donors and non-profit distributors from civil and criminal liability when donating wholesome food in good faith.

