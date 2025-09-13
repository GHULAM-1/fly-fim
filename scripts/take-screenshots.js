const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const BASE_URL = 'http://localhost:3000';

// Pages to test
const pages = [
  { name: 'home', path: '/', viewports: ['desktop', 'tablet', 'mobile'] },
  { name: 'help', path: '/help', viewports: ['desktop', 'tablet', 'mobile'] },
  { name: 'booking', path: '/booking?itemName=Test&city=rome&date=2025-01-15', viewports: ['desktop', 'tablet', 'mobile'] },
  { name: 'checkout', path: '/things-to-do/rome/tours/guided-tours/pompeii-amalfi-tour', viewports: ['desktop', 'tablet', 'mobile'] }
];

// Viewport configurations
const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 }
};

async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function takeScreenshot(browser, page, viewport, url, filename) {
  const tab = await browser.newPage();

  try {
    // Set viewport
    await tab.setViewport(viewports[viewport]);

    // Navigate to page
    console.log(`📸 Taking screenshot: ${filename}`);
    await tab.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for any animations or lazy loading
    await tab.waitForTimeout(2000);

    // Take screenshot
    await tab.screenshot({
      path: filename,
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ Saved: ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to screenshot ${filename}:`, error.message);
  } finally {
    await tab.close();
  }
}

async function main() {
  console.log('🚀 Starting screenshot capture...');

  // Ensure screenshots directory exists
  await ensureDirectoryExists(SCREENSHOTS_DIR);

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
    for (const pageConfig of pages) {
      for (const viewport of pageConfig.viewports) {
        const filename = path.join(SCREENSHOTS_DIR, `${pageConfig.name}-${viewport}.png`);
        const url = `${BASE_URL}${pageConfig.path}`;

        await takeScreenshot(browser, pageConfig, viewport, url, filename);
      }
    }

    console.log('🎉 All screenshots captured successfully!');
    console.log(`📁 Screenshots saved in: ${SCREENSHOTS_DIR}`);
  } catch (error) {
    console.error('💥 Error during screenshot capture:', error);
  } finally {
    await browser.close();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Screenshot capture interrupted');
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { takeScreenshot, viewports, pages };