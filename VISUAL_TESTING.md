# 🎨 Visual Testing with Puppeteer

This project includes automated visual regression testing using Puppeteer to ensure your website looks consistent across different viewports and matches your design expectations.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Your Development Server
```bash
npm run dev
```

### 3. Create Baseline Images (First Time)
```bash
npm run test:visual -- --update-baseline
```

### 4. Run Visual Tests
```bash
npm run test:visual
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:visual` | Run full visual regression tests |
| `npm run test:visual -- --update-baseline` | Update baseline/reference images |
| `npm run test:screenshots` | Take fresh screenshots only |
| `npm run test:compare` | Compare existing screenshots with baseline |

## 🖼️ What Gets Tested

The visual tests automatically capture screenshots for:

- **Pages:**
  - Homepage (`/`)
  - Help page (`/help`)
  - Booking page (`/booking`)
  - Checkout pages (`/things-to-do/...`)

- **Viewports:**
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x812)

## 📁 Directory Structure

```
screenshots/
├── reference/          # Baseline images (committed to git)
├── diff/              # Difference images when tests fail
├── reports/           # HTML reports with visual comparisons
├── home-desktop.png   # Current screenshots
├── home-tablet.png
├── home-mobile.png
└── ...
```

## 🔧 Configuration

Edit `puppeteer.config.js` to customize:

- Test pages and paths
- Viewport sizes
- Screenshot settings
- Comparison thresholds
- Wait times and actions

## 📊 Understanding Results

### ✅ Test Passes
- Screenshots match baseline images exactly
- No visual differences detected

### ❌ Test Fails
- Visual differences found
- Check the HTML report for detailed comparisons
- Review difference images in `screenshots/diff/`

## 🛠️ Common Workflows

### Adding New Pages to Test
1. Edit `puppeteer.config.js`
2. Add new page configuration
3. Run `npm run test:visual -- --update-baseline`

### Updating Designs
1. Make your changes
2. Run `npm run test:visual` to see differences
3. If changes are intentional: `npm run test:visual -- --update-baseline`
4. Commit new baseline images

### Debugging Failed Tests
1. Check the HTML report in `screenshots/reports/`
2. Look at difference images in `screenshots/diff/`
3. Compare current vs baseline images side by side

## 🚨 Troubleshooting

### Server Not Running
```
❌ Server is not responding. Please make sure to run "npm run dev" first.
```
**Solution:** Start your development server with `npm run dev`

### Permission Errors
```
Error: Failed to launch the browser process
```
**Solution:** Install browser dependencies:
```bash
npx puppeteer browsers install chrome
```

### Memory Issues
If tests fail with memory errors, try:
- Closing other applications
- Increasing Node.js memory: `node --max-old-space-size=4096 scripts/visual-test.js`

## 📈 Best Practices

### 1. Consistent Testing Environment
- Always test with the same browser version
- Use consistent data and content
- Test with stable network conditions

### 2. Meaningful Baselines
- Create baselines on a stable, known-good version
- Update baselines only when designs intentionally change
- Review all changes before updating baselines

### 3. CI/CD Integration
Add to your GitHub Actions or CI pipeline:
```yaml
- name: Visual Regression Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:visual
```

### 4. Handling Dynamic Content
- Mock or stub dynamic timestamps
- Use fixed data for tests
- Hide loading spinners and animations during tests

## 📝 Reports

HTML reports include:
- ✅ Pass/fail status for each test
- 📊 Pixel difference percentages
- 🖼️ Side-by-side image comparisons
- 🔍 Highlighted difference areas
- 📈 Overall test summary

Open the latest report in `screenshots/reports/` to see detailed results!

## 🤝 Contributing

When contributing visual changes:
1. Run tests locally first
2. Update baselines if changes are intentional
3. Include baseline updates in your PR
4. Document visual changes in your commit message

## 🔗 Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Visual Regression Testing Guide](https://www.browserstack.com/guide/visual-regression-testing)
- [Best Practices for Visual Testing](https://docs.percy.io/docs/visual-testing-best-practices)