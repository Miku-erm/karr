// Codex/VS Code can set this for their own Electron process. It breaks Cypress.
// Clear it only in this child process; never modify the machine/user environment.
delete process.env.ELECTRON_RUN_AS_NODE;
const mode = process.argv[2] || 'e2e';
process.env.VERIFICATION_RUN = mode;
const { default: cypress } = await import('cypress');
const specs = { e2e: ['cypress/e2e/story.cy.ts', 'cypress/e2e/features.cy.ts'], live: ['cypress/e2e/live.cy.ts'], demo: ['cypress/e2e/demo.cy.ts'] };
if (!specs[mode]) throw Error('Use e2e, live or demo');
const results = await cypress.run({ browser: 'electron', spec: specs[mode], headless: true });
if ('totalFailed' in results) process.exitCode = results.totalFailed > 0 ? 1 : 0;
else process.exitCode = 1;
