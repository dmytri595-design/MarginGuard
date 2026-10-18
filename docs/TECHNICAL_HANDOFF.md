# Technical Handoff

## Architecture
The MVP is a static single-page application in index.html. It contains the semantic page shell, CSS design system, rendering logic, browser-local state management, and pricing calculator. It has no runtime package dependencies or build step. The optional development dependency @playwright/test supports browser smoke tests.

## State
localStorage key: marginguard.workspace.v1

Top-level model:
- version: workspace schema version (currently 1)
- settings: business name, display currency, default target margin, and default fee
- products: per-product price, direct cost, fulfillment, fixed fee, percentage fee, overhead, target margin, monthly volume, category, description, and ID
- scenarios: named calculation snapshots with a product reference, assumptions, date, current result, and baseline values

## Pricing formula
Let P be listed price, d the discount fraction, f the platform fee fraction, and C total fixed per-sale cost plus overhead and optional extra cost.
- Effective revenue R = P × (1 − d)
- Percentage fee F = R × f
- Contribution π = R − C − F
- Contribution margin = π / R × 100 for R > 0
- Break-even listed price = C / (1 − f)
- Target-margin listed price = C / (1 − f − t), where t is the target margin fraction

A target-price value is infeasible when the denominator is not positive. The UI then shows a dash. The model excludes tax, refunds, customer-acquisition costs, and expenses the operator has not entered.

## Main workflows
Product management: add, edit, or remove records through the product dialog. The form rejects missing names, non-positive listed prices, negative cost fields, and fee/target percentages at or above 100%.
Price Lab: choose a product and adjust listed price, discount, extra cost, and target margin. Results update immediately. Save scenario stores a named snapshot. Save price to product explicitly applies the proposed price and target margin.
Portability: CSV export includes assumptions and calculated unit metrics. JSON backup includes settings, products, scenarios, and version metadata. Restore validates file size and record shape and asks before replacing the current browser workspace.

## Development and tests
Start the app with Python 3: python3 -m http.server 4173
Run browser checks: npm install; npx playwright install chromium; npm run test:e2e

The CI workflow runs Playwright against Node.js 22 and uploads short-retention failure traces.

## Current hosted deployment
Production alias: https://marginguard-studio.vercel.app. Vercel reports deployment dpl_3rsNt8YVEFr3e4A2NkjhpZm4NqoY as READY. Project-level SSO protection has been disabled so the demo can be opened without team authentication; still confirm anonymous access in a private browser window. The GitHub source repository is not linked to Vercel because the current Vercel connection lacks permission to establish the GitHub login connection. The hosted site is a static snapshot; source commits do not automatically deploy.

## Deployment transfer
The app can run on any static host. To enable automatic Vercel production deploys, link this GitHub repository in the new owner's account and select main as the production branch. Verify ownership, host settings, domain, access policy, and the live URL after transfer; the existing deployment is not itself an ownership transfer.

## Security and limitations
- No secrets or API keys are needed.
- Product and scenario values are escaped before being rendered in the interface.
- Local browser storage is not encryption or access control. Anyone using the same browser profile and origin may be able to access saved data.
- Clearing browser storage can remove the workspace. Export a backup before clearing or changing browsers.
- Currency selection reformats values; it does not exchange-convert them.
- Monthly outputs multiply per-sale estimates by manually entered volume and are not based on actual transaction records.
- No account recovery, shared-workspace permissions, concurrent editing, remote backups, or billing are implemented.
- The stylesheet uses system fonts; no third-party font download is required in the application.
