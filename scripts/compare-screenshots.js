const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const REFERENCE_DIR = path.join(__dirname, '../screenshots/reference');
const DIFF_DIR = path.join(__dirname, '../screenshots/diff');
const REPORT_DIR = path.join(__dirname, '../screenshots/reports');

async function ensureDirectoryExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function readPNG(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return PNG.sync.read(data);
  } catch (error) {
    throw new Error(`Failed to read PNG file ${filePath}: ${error.message}`);
  }
}

async function writePNG(filePath, png) {
  const buffer = PNG.sync.write(png);
  await fs.writeFile(filePath, buffer);
}

async function compareImages(currentPath, referencePath, diffPath) {
  console.log(`🔍 Comparing: ${path.basename(currentPath)}`);

  try {
    const current = await readPNG(currentPath);
    const reference = await readPNG(referencePath);

    const { width, height } = current;

    // Ensure both images have the same dimensions
    if (current.width !== reference.width || current.height !== reference.height) {
      return {
        match: false,
        error: `Dimension mismatch: current(${current.width}x${current.height}) vs reference(${reference.width}x${reference.height})`,
        pixelDifference: null,
        diffPercentage: null
      };
    }

    const diff = new PNG({ width, height });

    const pixelDifference = pixelmatch(
      current.data,
      reference.data,
      diff.data,
      width,
      height,
      {
        threshold: 0.1,
        includeAA: false,
        diffColor: [255, 0, 0], // Red for differences
        diffColorAlt: [255, 255, 0] // Yellow for anti-aliasing differences
      }
    );

    // Save diff image
    await writePNG(diffPath, diff);

    const totalPixels = width * height;
    const diffPercentage = (pixelDifference / totalPixels) * 100;

    return {
      match: pixelDifference === 0,
      pixelDifference,
      diffPercentage: diffPercentage.toFixed(2),
      dimensions: { width, height },
      totalPixels,
      error: null
    };
  } catch (error) {
    return {
      match: false,
      error: error.message,
      pixelDifference: null,
      diffPercentage: null
    };
  }
}

async function generateHTMLReport(results) {
  const timestamp = new Date().toISOString();
  const reportPath = path.join(REPORT_DIR, `visual-test-report-${Date.now()}.html`);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Test Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', roboto, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff; }
        .test-case { margin-bottom: 40px; border: 1px solid #e1e5e9; border-radius: 6px; overflow: hidden; }
        .test-header { background: #f8f9fa; padding: 15px; border-bottom: 1px solid #e1e5e9; }
        .test-content { padding: 20px; }
        .status-pass { color: #28a745; font-weight: bold; }
        .status-fail { color: #dc3545; font-weight: bold; }
        .images { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .image-container { text-align: center; }
        .image-container img { max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }
        .image-title { font-weight: 500; margin-bottom: 10px; color: #495057; }
        .error { background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px; margin-top: 10px; }
        .metrics { background: #e7f3ff; padding: 10px; border-radius: 4px; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎨 Visual Regression Test Report</h1>
            <p><strong>Generated:</strong> ${timestamp}</p>
            <p><strong>Total Tests:</strong> ${results.length}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>✅ Passed</h3>
                <div style="font-size: 24px; font-weight: bold; color: #28a745;">
                    ${results.filter(r => r.result.match).length}
                </div>
            </div>
            <div class="summary-card">
                <h3>❌ Failed</h3>
                <div style="font-size: 24px; font-weight: bold; color: #dc3545;">
                    ${results.filter(r => !r.result.match).length}
                </div>
            </div>
            <div class="summary-card">
                <h3>🔍 Average Diff</h3>
                <div style="font-size: 24px; font-weight: bold; color: #007bff;">
                    ${(results.reduce((sum, r) => sum + (parseFloat(r.result.diffPercentage) || 0), 0) / results.length).toFixed(2)}%
                </div>
            </div>
        </div>

        ${results.map(({ filename, result }) => `
            <div class="test-case">
                <div class="test-header">
                    <h3>${filename}</h3>
                    <span class="${result.match ? 'status-pass' : 'status-fail'}">
                        ${result.match ? '✅ PASS' : '❌ FAIL'}
                    </span>
                </div>
                <div class="test-content">
                    ${result.error ? `
                        <div class="error">
                            <strong>Error:</strong> ${result.error}
                        </div>
                    ` : ''}

                    ${result.diffPercentage !== null ? `
                        <div class="metrics">
                            <strong>Pixel Difference:</strong> ${result.pixelDifference} pixels (${result.diffPercentage}%)<br>
                            <strong>Dimensions:</strong> ${result.dimensions.width} × ${result.dimensions.height}
                        </div>
                    ` : ''}

                    <div class="images">
                        <div class="image-container">
                            <div class="image-title">Current</div>
                            <img src="../${filename}" alt="Current" />
                        </div>
                        <div class="image-container">
                            <div class="image-title">Reference</div>
                            <img src="../reference/${filename}" alt="Reference" />
                        </div>
                        <div class="image-container">
                            <div class="image-title">Difference</div>
                            <img src="../diff/${filename}" alt="Difference" />
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

  await fs.writeFile(reportPath, html);
  return reportPath;
}

async function main() {
  console.log('🔍 Starting visual comparison...');

  // Ensure directories exist
  await ensureDirectoryExists(DIFF_DIR);
  await ensureDirectoryExists(REPORT_DIR);

  try {
    // Get all current screenshots
    const files = await fs.readdir(SCREENSHOTS_DIR);
    const screenshotFiles = files.filter(file => file.endsWith('.png') && !file.includes('diff-'));

    if (screenshotFiles.length === 0) {
      console.log('❌ No screenshots found. Run "npm run test:screenshots" first.');
      return;
    }

    const results = [];

    for (const filename of screenshotFiles) {
      const currentPath = path.join(SCREENSHOTS_DIR, filename);
      const referencePath = path.join(REFERENCE_DIR, filename);
      const diffPath = path.join(DIFF_DIR, filename);

      // Check if reference exists
      try {
        await fs.access(referencePath);
      } catch {
        console.log(`⚠️  No reference found for ${filename}, skipping...`);
        continue;
      }

      const result = await compareImages(currentPath, referencePath, diffPath);
      results.push({ filename, result });

      if (result.match) {
        console.log(`✅ ${filename}: MATCH`);
      } else {
        console.log(`❌ ${filename}: DIFF (${result.diffPercentage}%)`);
      }
    }

    // Generate HTML report
    const reportPath = await generateHTMLReport(results);

    console.log('\\n📊 Comparison Summary:');
    console.log(`✅ Passed: ${results.filter(r => r.result.match).length}`);
    console.log(`❌ Failed: ${results.filter(r => !r.result.match).length}`);
    console.log(`📄 Report: ${reportPath}`);

  } catch (error) {
    console.error('💥 Error during comparison:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { compareImages, generateHTMLReport };