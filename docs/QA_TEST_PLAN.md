# QA Test Plan

## Browser smoke coverage
Run npm install, npx playwright install chromium, and npm run test:e2e.

1. Dashboard renders seeded metrics, a price-positioning chart, a portfolio table, and primary navigation.
2. Portfolio navigation and search/filter controls work.
3. A product can be added through the form; its price and name appear in the table.
4. Price Lab updates profit, margin, break-even, and target price as assumptions change.
5. A named scenario can be saved, viewed in the scenario library, loaded into Price Lab, and deleted.
6. Product export creates a CSV download; workspace backup creates a JSON download.
7. Settings can be saved; local workspace backup restore prompts before replacing data.

## Manual pre-sale checklist
- Test a positive-margin, below-target, and loss-making product.
- Add, edit, and delete a product; test blank and out-of-range form values.
- Test both no-discount and discounted models.
- Save, load, and delete a scenario; confirm it references the expected product.
- Export a JSON backup, make a change, restore the backup, and verify it is reverted after confirmation.
- Export the CSV and inspect key columns.
- Change display currency and confirm values are reformatted but not converted.
- Reset demo data after creating edits and confirm seeded examples return.
- Inspect desktop, mobile, keyboard navigation, and print output.
- Verify the hosted URL and deployment access with an unauthenticated browser before advertising it as a public demo.

## Known QA gaps
The automated browser suite is smoke coverage, not exhaustive cross-browser/visual regression or assistive-technology testing. Server-side concerns such as auth, permissions, data retention, billing, and multi-tenant isolation are not tested because those components do not exist. Demo data is illustrative.
