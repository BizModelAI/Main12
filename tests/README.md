# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests using Playwright to catch real user experience issues that automated API tests might miss.

## 🎯 Why E2E Testing?

While API tests are great for backend validation, they don't capture:
- **Frontend interactions** (clicks, form submissions, navigation)
- **localStorage behavior** (like the payment flow issue we just fixed)
- **Browser-specific issues** (CORS, authentication state)
- **User experience flows** (complete user journeys)
- **Visual regressions** and responsive design issues

## 🚀 Quick Start

### Run All Tests
```bash
npm run test:e2e
```

### Run Tests with UI (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

### Debug Tests
```bash
npm run test:e2e:debug
```

### View Test Reports
```bash
npm run test:e2e:report
```

## 📁 Test Structure

```
tests/e2e/
├── payment-flow.spec.ts      # Payment and unlock logic tests
├── navigation.spec.ts        # Basic navigation and user flows
└── unlock-logic.spec.ts      # localStorage and unlock behavior
```

## 🧪 Test Categories

### 1. Payment Flow Tests (`payment-flow.spec.ts`)
- Complete quiz flow with payment
- Authentication state handling
- Payment success and unlock verification
- localStorage flag validation

### 2. Navigation Tests (`navigation.spec.ts`)
- Landing page functionality
- Quiz navigation
- Mobile responsiveness
- Authentication flows
- Error handling

### 3. Unlock Logic Tests (`unlock-logic.spec.ts`)
- localStorage flag behavior
- Payment success simulation
- Debug logging verification
- Pricing display logic
- Edge cases

## 🔧 Configuration

The tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:5175` (your frontend)
- **Web Server**: Automatically starts `npm run dev`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On retry

## 🎨 Test Features

### Automatic Browser Management
- Tests run in multiple browsers automatically
- Mobile viewport testing included
- Cross-browser compatibility verification

### Visual Testing
- Screenshots on failure
- Video recordings for debugging
- Responsive design validation

### State Management
- Automatic localStorage clearing between tests
- Cookie management
- Clean test isolation

### Debug Capabilities
- Interactive UI mode for debugging
- Step-by-step execution
- Console log capture
- Network request monitoring

## 🐛 Debugging Tests

### Interactive Mode
```bash
npm run test:e2e:ui
```
Opens Playwright's interactive UI where you can:
- Run tests step by step
- Inspect elements
- View console logs
- Debug network requests

### Debug Mode
```bash
npm run test:e2e:debug
```
Runs tests in headed mode with debugging enabled.

### View Reports
```bash
npm run test:e2e:report
```
Opens the HTML test report with:
- Test results
- Screenshots
- Videos
- Traces
- Console logs

## 📝 Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('test description', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Interact with elements
    await page.click('button:has-text("Click Me")');
    
    // Assert results
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

### Best Practices
1. **Clear state**: Use `beforeEach` to clear localStorage/cookies
2. **Wait for elements**: Use `waitForLoadState` and `waitForSelector`
3. **Meaningful assertions**: Test user-visible behavior
4. **Handle async**: Use proper awaits for all async operations
5. **Test edge cases**: Include error scenarios and edge cases

### Common Patterns

#### localStorage Testing
```typescript
// Set localStorage
await page.evaluate(() => {
  localStorage.setItem('key', 'value');
});

// Check localStorage
const value = await page.evaluate(() => localStorage.getItem('key'));
expect(value).toBe('value');
```

#### Form Filling
```typescript
await page.fill('input[name="email"]', 'test@example.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
```

#### Conditional Testing
```typescript
const element = page.locator('.some-element');
if (await element.isVisible()) {
  // Element is visible, test it
  await expect(element).toContainText('Expected');
} else {
  // Element is not visible, test alternative
  await expect(page.locator('.alternative')).toBeVisible();
}
```

## 🚨 Common Issues

### Timing Issues
- Use `waitForLoadState('networkidle')` after navigation
- Use `waitForSelector()` for dynamic elements
- Add appropriate timeouts for slow operations

### Selector Issues
- Use text-based selectors when possible: `button:has-text("Submit")`
- Use data attributes for reliable selection: `[data-testid="submit-button"]`
- Avoid CSS classes that might change

### State Issues
- Clear localStorage/cookies in `beforeEach`
- Don't rely on test order
- Each test should be independent

## 📊 Continuous Integration

The tests are configured to run in CI environments:
- Automatic retries on failure
- Parallel execution
- HTML report generation
- Screenshot and video artifacts

## 🎯 What These Tests Catch

1. **Payment Flow Issues**: Like the localStorage unlock problem we just fixed
2. **Authentication Problems**: Login/logout state management
3. **Navigation Bugs**: Broken links and routing issues
4. **Responsive Design**: Mobile layout problems
5. **Browser Compatibility**: Cross-browser issues
6. **User Experience**: Complete user journey validation
7. **Visual Regressions**: UI changes that break functionality

## 🔄 Integration with Development

### Pre-commit Testing
Consider adding to your git hooks:
```bash
npm run test:e2e -- --grep "critical"
```

### CI/CD Pipeline
Add to your deployment pipeline:
```yaml
- name: Run E2E Tests
  run: npm run test:e2e
```

### Development Workflow
1. Write code
2. Run E2E tests: `npm run test:e2e:headed`
3. Fix any issues
4. Commit and push

This testing setup will help catch the types of issues that automated API tests miss, ensuring a robust user experience across all browsers and devices. 