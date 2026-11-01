import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await fs.mkdir('evidence/phase1/logs', { recursive: true });
const commands = [
  ['dependencies', ['ls', '--depth=0']], ['typecheck', ['run', 'typecheck']],
  ['build', ['run', 'build']], ['v1-unit', ['test']], ['collection-unit', ['run', 'test:data']],
  ['csv-validate', ['run', 'data:validate']], ['cypress-v1', ['run', 'cy:run']],
  ['cypress-collection', ['run', 'cy:collection']], ['security', ['run', 'security:scan']],
];
const records = [];
for (const [label, args] of commands) {
  const startedAt = new Date().toISOString();
  const windows = process.platform === 'win32';
  const result = spawnSync(windows ? 'cmd.exe' : 'npm', windows ? ['/d', '/s', '/c', `npm.cmd ${args.join(' ')}`] : args, { encoding: 'utf8', windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  const log = `evidence/phase1/logs/${label}.txt`;
  await fs.writeFile(log, (result.stdout || '') + (result.stderr || ''));
  records.push({ command: `npm ${args.join(' ')}`, label, startedAt, completedAt: new Date().toISOString(), exitCode: result.status, passed: result.status === 0, log });
  console.log(`${label}: ${result.status === 0 ? 'PASS' : 'FAIL'} (${result.status})`);
  if (label.startsWith('cypress-')) {
    const source = `artifacts/cypress/latest-${label === 'cypress-v1' ? 'e2e' : 'collection'}.json`;
    try { await fs.copyFile(source, `evidence/phase1/${label}.json`); } catch { /* The failed command and its log remain explicit. */ }
  }
}
await fs.writeFile('evidence/phase1/verification.json', JSON.stringify({ checkedAt: new Date().toISOString(), records, passed: records.every(r => r.passed) }, null, 2));
if (records.some(r => !r.passed)) process.exitCode = 1;
