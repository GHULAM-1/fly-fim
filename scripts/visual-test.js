const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const { takeScreenshot, viewports, pages } = require('./take-screenshots');
const { compareImages, generateHTMLReport } = require('./compare-screenshots');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const REFERENCE_DIR = path.join(__dirname, '../screenshots/reference');
const DIFF_DIR = path.join(__dirname, '../screenshots/diff');
const BASE_URL = 'http://localhost:3000';

async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function waitForServer(url, maxAttempts = 30) {
  console.log('🔍 Checking if server is running...');

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log('✅ Server is ready!');
        return true;
      }
    } catch (error) {
      // Server not ready, wait and retry
    }

    console.log(`⏳ Waiting for server... (${i + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('❌ Server is not responding. Please make sure to run "npm run dev" first.');
}

async function runVisualTests(updateBaseline = false) {
  console.log('🎨 Starting comprehensive visual testing...');

  // Check if server is running
  await waitForServer(BASE_URL);

  // Ensure all directories exist
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  await ensureDirectoryExists(REFERENCE_DIR);
  await ensureDirectoryExists(DIFF_DIR);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    console.log('📸 Taking fresh screenshots...');

    // Take screenshots for all pages and viewports
    for (const pageConfig of pages) {
      for (const viewport of pageConfig.viewports) {
        const filename = `${pageConfig.name}-${viewport}.png`;
        const screenshotPath = path.join(SCREENSHOTS_DIR, filename);
        const url = `${BASE_URL}${pageConfig.path}`;

        await takeScreenshot(browser, pageConfig, viewport, url, screenshotPath);

        // If updating baseline, copy to reference directory
        if (updateBaseline) {
          const referencePath = path.join(REFERENCE_DIR, filename);
          await fs.copyFile(screenshotPath, referencePath);
          console.log(`📋 Updated baseline: ${filename}`);
        }
      }
    }

    if (updateBaseline) {
      console.log('✅ Baseline images updated successfully!');
      return;
    }

    console.log('🔍 Comparing with baseline...');

    // Compare screenshots
    const results = [];
    const files = await fs.readdir(SCREENSHOTS_DIR);
    const screenshotFiles = files.filter(file => file.endsWith('.png'));

    for (const filename of screenshotFiles) {
      const currentPath = path.join(SCREENSHOTS_DIR, filename);
      const referencePath = path.join(REFERENCE_DIR, filename);
      const diffPath = path.join(DIFF_DIR, filename);

      // Check if reference exists
      try {
        await fs.access(referencePath);
      } catch {
        console.log(`⚠️  No baseline found for ${filename}, skipping comparison...`);
        console.log(`💡 Run with --update-baseline to create baseline images`);
        continue;
      }

      const result = await compareImages(currentPath, referencePath, diffPath);
      results.push({ filename, result });

      if (result.match) {
        console.log(`✅ ${filename}: MATCH`);
      } else if (result.error) {
        console.log(`❌ ${filename}: ERROR - ${result.error}`);
      } else {
        console.log(`❌ ${filename}: VISUAL DIFF (${result.diffPercentage}% different)`);
      }
    }

    // Generate report
    if (results.length > 0) {
      const reportPath = await generateHTMLReport(results);

      console.log('\\n📊 Visual Test Summary:');
      console.log(`✅ Passed: ${results.filter(r => r.result.match).length}/${results.length}`);
      console.log(`❌ Failed: ${results.filter(r => !r.result.match).length}/${results.length}`);
      console.log(`📄 Detailed report: ${reportPath}`);

      // Exit with error code if any tests failed
      const failedTests = results.filter(r => !r.result.match);
      if (failedTests.length > 0) {
        console.log('\\n💥 Visual regression detected!');
        process.exit(1);
      } else {
        console.log('\\n🎉 All visual tests passed!');
      }
    } else {
      console.log('⚠️  No comparisons performed. Create baseline images first.');
    }

  } catch (error) {
    console.error('💥 Visual testing failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const updateBaseline = args.includes('--update-baseline') || args.includes('-u');

if (require.main === module) {
  runVisualTests(updateBaseline).catch(console.error);
}

module.exports = { runVisualTests };