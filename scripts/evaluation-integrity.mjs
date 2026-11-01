import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const dataset = JSON.parse(await fs.readFile('eval/tutor-cases.json', 'utf8'));
assert.equal(dataset.cases.length, 20);
assert.equal(new Set(dataset.cases.map(c => c.id)).size, 20);
assert.equal(new Set(dataset.cases.map(c => c.studentMessage)).size, 20);
assert.equal(new Set(dataset.cases.map(c => c.decisionId)).size, 3);
for (const c of dataset.cases) for (const field of ['experience', 'role', 'goal', 'studentMessage', 'expectedSocraticBehavior', 'forbiddenBehavior', 'rubric']) assert.ok(c[field], `${c.id}: ${field}`);
const runs = ['eval', ...(await fs.readdir('eval/runs', { withFileTypes: true })).filter(e => e.isDirectory()).map(e => `eval/runs/${e.name}`)];
const checks = [];
for (const dir of runs) {
  const result = JSON.parse(await fs.readFile(path.join(dir, 'tutor-results.json'), 'utf8'));
  const semantic = JSON.parse(await fs.readFile(path.join(dir, 'semantic-review.json'), 'utf8'));
  assert.equal(result.cases.length, 20);
  assert.equal(new Set(result.cases.map(c => c.id)).size, 20);
  let attempts = 0;
  for (const c of result.cases) {
    const source = dataset.cases.find(s => s.id === c.id);
    assert.equal(c.studentMessage, source.studentMessage);
    for (const a of c.attempts) {
      attempts++;
      if (!a.response?.requestId) continue; // Transport failures have no server record.
      const raw = JSON.parse(await fs.readFile(`eval/raw/${c.id}-${a.response.requestId}.json`, 'utf8'));
      assert.deepEqual(raw, a.evidence, `${dir}/${c.id}: raw evidence differs`);
      assert.equal(raw.request.message, source.studentMessage);
      assert.equal(raw.request.decisionId, source.decisionId);
      assert.equal(raw.model, result.model);
      assert.ok(raw.startedAt && raw.completedAt);
    }
    if (c.status === 'completed') {
      const last = c.attempts.at(-1);
      assert.equal(last.response.liveAi, true);
      assert.equal(c.rawModelResponse, last.evidence.rawModelResponse);
      assert.equal(c.modelResponse, JSON.parse(c.rawModelResponse).messageTr.trim());
      const review = semantic.reviews.find(r => r.id === c.id);
      assert.equal(review.modelResponseSha256, createHash('sha256').update(c.modelResponse).digest('hex'));
    }
  }
  checks.push({ run: dir, cases: result.cases.length, completed: result.cases.filter(c => c.status === 'completed').length, attempts, passed: true });
}
await fs.writeFile('evidence/evaluation-integrity.json', JSON.stringify({ checkedAt: new Date().toISOString(), checks, passed: true }, null, 2));
console.log(JSON.stringify(checks, null, 2));
