// Puppeteer configuration for visual testing
module.exports = {
  // Browser configuration
  launch: {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding'
    ],
    defaultViewport: null,
    timeout: 30000
  },

  // Test configuration
  testConfig: {
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    retries: 2,

    // Screenshot settings
    screenshot: {
      type: 'png',
      fullPage: true,
      quality: 90
    },

    // Comparison settings
    comparison: {
      threshold: 0.1,
      includeAA: false,
      diffColor: [255, 0, 0],
      diffColorAlt: [255, 255, 0]
    }
  },

  // Viewport presets
  viewports: {
    desktop: { width: 1920, height: 1080 },
    laptop: { width: 1366, height: 768 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 },
    mobileLarge: { width: 414, height: 896 }
  },

  // Pages to test
  testPages: [
    {
      name: 'home',
      path: '/',
      description: 'Homepage',
      viewports: ['desktop', 'tablet', 'mobile'],
      waitFor: 2000,
      excludeSelectors: ['.loading-spinner', '.dynamic-timestamp']
    },
    {
      name: 'help',
      path: '/help',
      description: 'Help page',
      viewports: ['desktop', 'tablet', 'mobile'],
      waitFor: 1500
    },
    {
      name: 'booking',
      path: '/booking?itemName=Test Experience&city=rome&date=2025-01-15',
      description: 'Booking page',
      viewports: ['desktop', 'tablet', 'mobile'],
      waitFor: 3000
    },
    {
      name: 'checkout-rome',
      path: '/things-to-do/rome/tours/guided-tours/pompeii-amalfi-tour',
      description: 'Checkout page - Rome experience',
      viewports: ['desktop', 'tablet', 'mobile'],
      waitFor: 3000,
      actions: [
        { type: 'click', selector: '#timeline-tab', optional: true },
        { type: 'wait', duration: 1000 }
      ]
    }
  ],

  // Directories
  directories: {
    screenshots: './screenshots',
    reference: './screenshots/reference',
    diff: './screenshots/diff',
    reports: './screenshots/reports'
  }
};