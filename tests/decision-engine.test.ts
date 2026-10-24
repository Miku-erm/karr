import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEnding } from '../src/decisionEngine';
import { DECISIONS, ENDINGS, getPersonalizedFeedback } from '../src/storyData';
const oracle = { AAA: 'ENDING_SAFE', AAB: 'ENDING_PRIVACY_INCIDENT', ABA: 'ENDING_RECURRING_OUTAGE', ABB: 'ENDING_PRIVACY_INCIDENT', BAA: 'ENDING_FRAGILE', BAB: 'ENDING_PRIVACY_INCIDENT', BBA: 'ENDING_RECURRING_OUTAGE', BBB: 'ENDING_PRIVACY_INCIDENT' };
for (const [path, expected] of Object.entries(oracle)) test(`ending ${path}`, () => {
  assert.equal(calculateEnding({ architecture: path[0], testing: path[1], privacy: path[2] } as any), expected);
});
test('rejects incomplete, invalid and unexpected input', () => {
  for (const bad of [{}, { architecture: 'A' }, { architecture: 'A', testing: 'A', privacy: 'X' }, { architecture: 'X', testing: 'A', privacy: 'A' }, { architecture: 'A', testing: 'A', privacy: 'A', extra: 'A' }]) assert.throws(() => calculateEnding(bad as any));
});
test('all six consequences contain causal explanations; four endings exist', () => {
  const ids = new Set();
  for (const d of Object.values(DECISIONS)) for (const c of Object.values(d.choices)) { ids.add(c.consequence.id); assert.ok(c.consequence.cause.length > 20); assert.ok(c.consequence.summary.length > 20); }
  assert.equal(ids.size, 6); assert.equal(Object.keys(ENDINGS).length, 4);
});
test('27 profiles preserve eight paths and emphasize only the selected goal', () => {
  for (const experience of ['beginner','intermediate','experienced']) for (const role of ['developer','tester','lead']) for (const goal of ['architecture','testing','privacy']) {
    for (const id of ['architecture','testing','privacy']) { const f = getPersonalizedFeedback({ experience, role, goal } as any, id as any); assert.ok(f.rolePerspective && f.experienceNote); assert.equal(Boolean(f.goalEmphasis), id === goal); }
    for (const [path, expected] of Object.entries(oracle)) assert.equal(calculateEnding({architecture:path[0],testing:path[1],privacy:path[2]} as any),expected);
  }
});
