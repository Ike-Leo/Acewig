# Browser Testing Flow

This flow coordinates automated browser testing for UI changes in the Ralph development workflow.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     START: UI Story Implemented                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: Read Story Context                                     │
│  - What UI changes were made?                                   │
│  - What should be tested?                                       │
│  - What's the expected behavior?                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: Start Dev Server                                       │
│  - Check if already running (port 3000 or from .env)            │
│  - If not, run: npm run dev                                     │
│  - Wait for server to be ready                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: Open Browser                                           │
│  - Navigate to relevant page/URL                                │
│  - Open DevTools for console monitoring                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: Visual Inspection                                      │
│  - Does the page render correctly?                              │
│  - Are new elements visible?                                    │
│  - Is styling applied correctly?                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: Functional Testing                                     │
│  - Test all interactive elements                                │
│  - Verify form inputs work                                      │
│  - Check navigation links                                       │
│  - Test state changes (if applicable)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 6: Console Check                                          │
│  - Check for JavaScript errors                                  │
│  - Check for warnings                                           │
│  - Verify network requests complete successfully                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 7: Screenshot Documentation                               │
│  - Capture initial state                                        │
│  - Capture after key interactions                               │
│  - Document any issues found                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Decision Point: All Tests Pass?                                │
└─────────────────────────────────────────────────────────────────┘
                     │                            │
                    YES                          NO
                     │                            │
                     ▼                            ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│  Step 8: Report Success   │      │  Step 9: Report Failure      │
│  - Document what worked   │      │  - List issues found         │
│  - Mark story as PASS     │      │  - Provide reproduction steps │
│  - Return to main flow    │      │  - Mark story as FAIL        │
└──────────────────────────┘      │  - Return to main flow        │
                                  └──────────────────────────────┘
```

## Automated Testing Integration

### Option 1: Playwright End-to-End Tests

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test('renders correctly', async ({ page }) => {
    await page.goto('/feature-page');
    await expect(page.locator('.new-element')).toBeVisible();
  });

  test('handles user interaction', async ({ page }) => {
    await page.goto('/feature-page');
    await page.click('button[data-testid="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Option 2: Visual Regression Testing

```typescript
// tests/visual/example.spec.ts
import { test, expect } from '@playwright/test';

test('visual snapshot', async ({ page }) => {
  await page.goto('/feature-page');
  await expect(page).toHaveScreenshot('feature-page.png');
});
```

## Manual Testing Checklist

Use this checklist for thorough manual testing:

### Page Load
- [ ] Page loads within 3 seconds
- [ ] No white screen of death
- [ ] No console errors on load
- [ ] Assets (images, fonts) load correctly

### Content Display
- [ ] Text content is readable
- [ ] Images display with correct dimensions
- [ ] Lists and tables render properly
- [ ] Empty states show appropriate messages

### Interactive Elements
- [ ] Buttons respond to clicks
- [ ] Form inputs accept data
- [ ] Dropdowns work
- [ ] Modals open/close correctly
- [ ] Links navigate to correct pages

### Data Flow
- [ ] Data loads from API
- [ ] Loading states display
- [ ] Error states handle failures gracefully
- [ ] Real-time updates work (if applicable)

### Responsive Design
- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)
- [ ] Orientation changes handled

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] ARIA labels present where needed
- [ ] Screen reader announcements work

## Testing Commands Reference

```bash
# Start dev server
npm run dev

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Run unit tests
npm run test

# Run Playwright tests
npx playwright test

# Run Playwright UI mode (interactive)
npx playwright test --ui

# Run Playwright in headed mode
npx playwright test --headed

# Debug Playwright test
npx playwright test --debug
```

## Integration with Main Ralph Flow

The browser test flow is triggered from the main Ralph agent after implementing a UI story:

1. Main agent implements the story
2. Main agent calls: *"Run browser test flow for story [ID]"*
3. Browser test agent executes this flow
4. Browser test agent returns: PASS/FAIL report
5. Main agent uses report to decide if story is complete

## Quick Test Script

For rapid testing during development, use this script:

```bash
#!/bin/bash
# quick-test.sh

echo "Starting dev server..."
npm run dev &
DEV_PID=$!

echo "Waiting for server..."
sleep 5

echo "Opening browser..."
# On macOS
open http://localhost:3000
# On Linux
# xdg-open http://localhost:3000
# On Windows
# start http://localhost:3000

echo "Dev server running (PID: $DEV_PID)"
echo "Press Ctrl+C to stop"

wait $DEV_PID
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
npx kill-port 3000
# Or manually:
lsof -ti:3000 | xargs kill -9
```

### Browser Not Opening
- Check if server is running: `curl http://localhost:3000`
- Try opening manually: Copy URL to browser
- Check firewall settings

### Tests Flaky
- Increase timeouts: `test.slow()`
- Use `waitFor` instead of fixed delays
- Check for race conditions in data loading
- Use test IDs instead of CSS selectors

### Console Errors
- Check React hydration issues
- Verify all dependencies are imported
- Check for missing environment variables
- Look for null/undefined access in components
