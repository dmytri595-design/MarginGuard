# MarginGuard — Product Brief

## Executive summary
MarginGuard is a browser-based pricing and profitability workbench for small digital businesses. It helps an operator understand modeled contribution from one sale, identify products below their own margin goals, and estimate the price needed to meet a target margin after specified costs and percentage fees.

The MVP needs no payment processor, bank feed, or AI API. It works immediately with manually supplied assumptions and can be extended into a hosted product by a buyer.

## Target customer
- Micro-SaaS founders maintaining multiple subscription plans or add-ons.
- Small agencies and studios selling packaged services.
- Creators selling digital downloads, templates, or licenses.
- Operators who sell through platforms with transaction fees.

## Problem and value proposition
A simple markup can hide payment fees, support costs, fulfillment costs, and allocated overhead. Revenue alone does not show whether each offer is meeting its contribution-margin goal. MarginGuard consolidates the assumptions for each product and makes the modeled per-sale outcome easy to compare across a portfolio.

## Current MVP capabilities
1. Overview dashboard: estimated monthly revenue/profit, weighted contribution margin, price-position chart, and margin watchlist.
2. Product portfolio: CRUD, cost and fee inputs, target margin, volume, search, and status filters.
3. Price Lab: live price, discount, extra cost, break-even, and target-price model.
4. Scenario library: named snapshots with profit, margin, target, discount, and baseline comparison.
5. Data portability: JSON backup/restore and CSV product export.
6. Responsive static UI with print styling and browser-based smoke tests.

## Out of scope
No authentication, cloud persistence, user/team management, billing, invoices, bookkeeping, tax engine, accounting integrations, live transaction ingestion, FX conversion, automated forecasting, or server-side AI. Sample data is fictional.

## Acquirer roadmap
### Phase 1 — Hosted workspace
Add accounts, team workspaces, database persistence, migrations, backups, access controls, and workspace recovery controls.
### Phase 2 — Data integrations
Import transaction CSVs and optionally integrate payment or marketplace fee information. Add reconciliation and freshness indicators. Implement FX only with source and timestamp metadata.
### Phase 3 — Monetization
Implement billing after authentication, limits, and subscription lifecycle flows exist. Add team collaboration, shareable reports, and recurring review workflows.

## Positioning note
This is a functional pre-launch prototype, not a revenue-generating SaaS. Marketing claims should stay aligned with verified usage, adoption, and production functionality.
