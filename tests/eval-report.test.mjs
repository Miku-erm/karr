import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

test('report preserves exact-response reviews and invalidates changed-response labels', async () => {
  await fs.mkdir('artifacts', { recursive: true });
  const dir = await fs.mkdtemp('artifacts/eval-report-test-');
  const original = JSON.parse(await fs.readFile('eval/tutor-results.json', 'utf8'));
  const csv = await fs.readFile('eval/human-review.csv', 'utf8');
  assert.ok(csv.includes('"reviewed"'), 'historical reviewed fixture exists');
  await fs.writeFile(`${dir}/tutor-results.json`, JSON.stringify(original));
  await fs.copyFile('eval/semantic-review.json', `${dir}/semantic-review.json`);
  await fs.writeFile(`${dir}/human-review.csv`, csv);
  const run = () => {
    const result = spawnSync(process.execPath, ['scripts/eval-report.mjs'], {
      env: { ...process.env, TUTOR_EVAL_OUTPUT_DIR: dir }, encoding: 'utf8', windowsHide: true,
    });
    assert.equal(result.status, 0, result.stderr);
  };
  run();
  assert.equal(await fs.readFile(`${dir}/human-review.csv`, 'utf8'), csv);
  original.cases[0].modelResponse = 'Changed response: requires a separate semantic review?';
  await fs.writeFile(`${dir}/tutor-results.json`, JSON.stringify(original));
  run();
  const changed = JSON.parse(await fs.readFile(`${dir}/tutor-results.json`, 'utf8'));
  assert.equal(changed.cases[0].assessment.dimensions.technical_correctness, null);
  assert.equal(changed.cases[0].assessment.preliminary_pass, false);
  assert.equal((await fs.readFile(`${dir}/human-review.csv`, 'utf8')).includes('"reviewed"'), false);
  assert.ok((await fs.readdir(dir)).some(name => name.startsWith('human-review.csv.archive-')));
});
