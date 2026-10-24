import { defineConfig } from 'cypress';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
export default defineConfig({
  viewportWidth: 390,
  viewportHeight: 844,
  video: true,
  trashAssetsBeforeRuns: false,
  videosFolder: 'artifacts/cypress/videos',
  screenshotsFolder: 'artifacts/cypress/screenshots',
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 8000,
  requestTimeout: 18000,
  responseTimeout: 20000,
  retries: 0,
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/*.cy.ts',
    setupNodeEvents(on) {
      on('before:browser:launch', (browser, options) => {
        if (browser.name === 'electron' && browser.isHeadless) {
          options.preferences.width = 1280;
          options.preferences.height = 1100;
        }
        return options;
      });
      // The export uses TypeScript 7; Cypress 15's bundled ts-loader expects
      // the older compiler API. Transpile test files with existing esbuild.
      on('file:preprocessor', async file => {
        await build({ entryPoints: [file.filePath], outfile: file.outputPath, bundle: true, platform: 'browser', sourcemap: 'inline' });
        return file.outputPath;
      });
      on('after:run', results => {
        if (!('totalTests' in results)) return;
        fs.mkdirSync('artifacts/cypress', { recursive: true });
        const label = process.env.VERIFICATION_RUN || 'run';
        fs.writeFileSync(`artifacts/cypress/${label}-${Date.now()}.json`, JSON.stringify(results, null, 2));
        fs.writeFileSync(`artifacts/cypress/latest-${label}.json`, JSON.stringify(results, null, 2));
      });
      on('after:spec', (spec, results) => {
        if (spec.name !== 'demo.cy.ts' || !results.video) return;
        fs.mkdirSync('demo/raw', { recursive: true });
        fs.copyFileSync(results.video, path.join('demo/raw', `cypress-${Date.now()}.mp4`));
      });
      on('task', {
        markDemo(event) {
          fs.mkdirSync('demo/raw', { recursive: true });
          fs.appendFileSync('demo/raw/timeline.jsonl', JSON.stringify({ ...event, at: new Date().toISOString() }) + '\n');
          return null;
        },
      });
    },
  },
});
