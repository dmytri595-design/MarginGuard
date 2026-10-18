# MarginGuard — Pricing & Profitability Studio

MarginGuard is a local-first pricing workbench for freelancers, agencies, micro-SaaS operators, and sellers of digital products. It turns price and cost assumptions into per-sale contribution economics, highlights products below their own margin goals, and keeps a record of pricing what-if scenarios.

**Stage:** Functional browser prototype / pre-launch. No customers, revenue, or production backend are represented.

## What works
- Portfolio dashboard with estimated monthly revenue and profit, weighted contribution margin, price positioning, and a margin-health watchlist.
- Product create/edit/delete workflows with listed price, direct cost, fulfillment, fixed fee, platform fee rate, allocated overhead, target margin, and estimated monthly sales volume.
- Price Lab for live price, discount, additional cost, break-even, and target-price calculations.
- Named scenario snapshots and comparisons against the product baseline.
- Product search and margin-status filtering.
- CSV export for product assumptions and computed metrics; JSON backup and restore for the local workspace.
- Workspace preferences, resettable demo data, responsive layout, and print-friendly styling.
- Browser smoke tests and a GitHub Actions workflow.

## Run locally
No production build step is needed. The application is contained in **index.html**.

~~~bash
python3 -m http.server 4173
# Open http://localhost:4173
~~~

For automated browser checks:

~~~bash
npm install
npx playwright install chromium
npm run test:e2e
~~~

## Calculation model
For one sale, let P be the listed price, d the discount rate, f the percentage fee, and C the sum of direct cost, fulfillment, fixed transaction fee, allocated overhead, and any additional modeled cost.

- Effective revenue = P × (1 − d)
- Percentage fee = effective revenue × f
- Contribution = effective revenue − C − percentage fee
- Contribution margin = contribution ÷ effective revenue × 100
- Break-even listed price = C ÷ (1 − f)
- Listed price for a target margin t = C ÷ (1 − f − t)

The target-price value is undefined when target margin plus percentage fees reach or exceed 100%; the interface displays a dash rather than a misleading monetary value.

## Data and privacy
All products, preferences, and saved scenarios are stored in localStorage in the current browser. There is no login, cloud sync, remote database, analytics service, billing, email delivery, or server-side AI. Clearing browser data can erase the workspace, so export a JSON backup before clearing site storage or changing browsers.

The currency preference only changes number formatting; it does not convert saved figures. The model excludes taxes, refunds, chargebacks, acquisition cost, and costs not entered by the user. It is decision support, not accounting or tax advice. Demo records are illustrative, not verified business performance.

## Documentation
- Product overview: docs/PRODUCT_BRIEF.md
- Technical transfer guide: docs/TECHNICAL_HANDOFF.md
- QA plan and known limitations: docs/QA_TEST_PLAN.md
- Draft acquisition listing: docs/SALE_LISTING.md
- IP and licensing notes: docs/IP_AND_LICENSE.md

## Hosted demo
Production deployment: https://marginguard-studio.vercel.app

Vercel reports the deployment as READY and the project access setting is configured without SSO protection. The Vercel/GitHub login connection is not linked, so this deployment is a static snapshot; new source commits do not automatically redeploy it. Open the URL in a private browser window before putting it on an acquisition listing.

## Deployment
The application is static and can run on Vercel, Netlify, Cloudflare Pages, or any static web server. Connect this GitHub repository to the buyer's hosting account and verify the deployment URL and production branch before sharing a demo as live.

## Acquisition handoff
The repository uses a restrictive evaluation notice rather than an open-source license. An acquisition still needs an explicit written IP assignment or commercial license and a review of third-party notices. No user base, recurring revenue, customer contracts, or domain ownership is included or claimed.
