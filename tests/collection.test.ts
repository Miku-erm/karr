import test from 'node:test';
import assert from 'node:assert/strict';
import { CollectionSession, CSV_HEADERS, DecisionRow, FEATURE_ORDER, STORAGE_KEY, dataSummary, mergeExports, parseCsv, serializeCsv, validateCsv, validateRow } from '../src/collection/contract';
import { deleteAllSessions, deleteSession, exportSessions, readSessions, saveSession } from '../src/collection/store';
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// In-memory schema fixtures only. Never human data; never written to data/oturumlar.csv.
const id = 'a0000000-0000-4000-8000-000000000001';
const rows = (session = id): DecisionRow[] => [1, 2, 3].map(scene => ({ session_id: session, participant_group: 'P01', scene_number: scene, decision_elapsed_seconds: 2.5, option_switch_count: 0, hint_request_count: 1, prior_high_risk_choice_count: scene - 1, experience_code: 0, difficulty_label: scene === 2 ? 0 : 1, kaynak: 'sentetik' }));
const csv = () => serializeCsv(rows());
function memoryStore() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}

test('six fixed pre-choice predictors exclude labels, IDs and endings', () => {
  assert.deepEqual(FEATURE_ORDER, ['decision_elapsed_seconds', 'option_switch_count', 'hint_request_count', 'prior_high_risk_choice_count', 'scene_number', 'experience_code']);
  assert.equal(FEATURE_ORDER.length, 6);
});
test('header-only CSV is valid but has zero genuine sessions and is not data-ready', () => {
  const parsed = validateCsv(serializeCsv([]));
  assert.deepEqual(parsed.errors, []);
  assert.equal(dataSummary(parsed.sessions).genuineSessions, 0);
  assert.equal(dataSummary(parsed.sessions).dataReady, false);
});
test('BOM/quoted cells/CRLF round trip preserves binary labels and synthetic source', () => {
  const quoted = '\uFEFF' + csv().trim().split(/\r?\n/).map(line => line.split(',').map(cell => `"${cell}"`).join(',')).join('\r\n');
  const parsed = validateCsv(quoted);
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.rows, rows());
  assert.equal(dataSummary(parsed.sessions).genuineSessions, 0);
  assert.equal(dataSummary(parsed.sessions).syntheticSessions, 1);
});
const negative: [string, (data: any[]) => void][] = [
  ['missing required field', data => { delete data[0].experience_code; }],
  ['personal identifier column', data => { data[0].email = 'forbidden fixture'; }],
  ['invalid UUID', data => { data[0].session_id = 'not-a-session'; }],
  ['name used as group', data => { data[0].participant_group = 'a name'; }],
  ['negative elapsed', data => { data[0].decision_elapsed_seconds = -1; }],
  ['elapsed over cap', data => { data[0].decision_elapsed_seconds = 120.001; }],
  ['nonfinite elapsed', data => { data[0].decision_elapsed_seconds = Infinity; }],
  ['fractional switches', data => { data[0].option_switch_count = 0.5; }],
  ['negative hint count', data => { data[0].hint_request_count = -1; }],
  ['future choice leak', data => { data[0].prior_high_risk_choice_count = 1; }],
  ['invalid experience', data => { data[0].experience_code = 3; }],
  ['invalid scene', data => { data[0].scene_number = 4; }],
  ['nonbinary label', data => { data[0].difficulty_label = 2; }],
  ['invented source', data => { data[0].kaynak = 'human'; }],
];
for (const [name, mutate] of negative) test(`rejects ${name}`, () => { const data = rows(); mutate(data); assert.ok(validateRow(data[0]).length); });
test('CSV rejects malformed headers, blank numbers, textual labels and malformed quotes', () => {
  for (const bad of [csv().replace('experience_code', 'email'), csv().replace(',2.5,', ',,'), csv().replace(',1,sentetik', ',true,sentetik'), csv().replace('P01', '"unterminated'), csv().replace('2.5', 'NaN'), csv().replace(',1,sentetik', ',0.0,sentetik')]) assert.ok(validateCsv(bad).errors.length);
  assert.throws(() => parseCsv('"closed"extra'));
});
test('CSV rejects repeated pairs, incomplete sessions and mixed session metadata', () => {
  const original = rows();
  for (const bad of [[...original, original[0]], original.slice(0, 2), original.map((r, i) => ({ ...r, participant_group: i ? 'P02' : 'P01' })), original.map((r, i) => ({ ...r, experience_code: i ? 1 : 0 }))]) assert.ok(validateCsv(serializeCsv(bad)).errors.length);
});
test('merge deduplicates full identical sessions and rejects conflicting labels or incomplete input', () => {
  assert.equal(validateCsv(mergeExports([csv(), csv()])).rows.length, 3);
  const changed = rows(); changed[1].difficulty_label = 1;
  assert.throws(() => mergeExports([csv(), serializeCsv(changed)]), /çelişkili/);
  assert.throws(() => mergeExports([serializeCsv(rows().slice(0, 2))]));
  const second = rows('a0000000-0000-4000-8000-000000000002');
  const combined = validateCsv(mergeExports([csv(), serializeCsv(second)]));
  assert.equal(combined.rows.length, 6);
  assert.ok(combined.rows.every(r => r.kaynak === 'sentetik'));
});
test('source categories are exact; synthetic rows never satisfy the genuine-data gate', () => {
  assert.deepEqual(validateRow({ ...rows()[0], kaynak: 'gercek' }), []); // Category validation only, not a collected human session.
  const parsed = validateCsv(csv());
  const summary = dataSummary(parsed.sessions);
  assert.equal(summary.genuineSessions, 0);
  assert.equal(summary.dataReady, false);
  assert.deepEqual(summary.labelBalance.map(b => b.rows), [0, 0]);
});
test('local persistence retains incomplete sessions but exports only complete sessions', () => {
  const storage = memoryStore();
  const first: CollectionSession = { session_id: id, participant_group: 'P01', kaynak: 'sentetik', status: 'incomplete', rows: rows().slice(0, 1) };
  saveSession(first, storage, 'create');
  assert.throws(() => saveSession(first, storage, 'create'), /çakışması/);
  assert.equal(readSessions(storage)[0].status, 'incomplete');
  assert.equal(validateCsv(exportSessions(storage)).rows.length, 0);
  saveSession({ ...first, status: 'completed', rows: rows() }, storage);
  assert.equal(validateCsv(exportSessions(storage)).rows.length, 3);
  const next = { ...first, session_id: 'a0000000-0000-4000-8000-000000000002', rows: [] };
  saveSession(next, storage, 'create');
  assert.equal(readSessions(storage).length, 2);
  deleteSession(next.session_id, storage);
  assert.throws(() => saveSession(next, storage), /silinmiş/);
  assert.equal(readSessions(storage).length, 1);
  deleteAllSessions(storage);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});
test('corrupt or privacy-expanded storage is not overwritten, and write failure propagates', () => {
  const storage = memoryStore();
  storage.setItem(STORAGE_KEY, '{broken');
  const session: CollectionSession = { session_id: id, participant_group: '', kaynak: 'sentetik', status: 'incomplete', rows: [] };
  assert.throws(() => saveSession(session, storage));
  assert.equal(storage.getItem(STORAGE_KEY), '{broken');
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sessions: [{ ...session, email: 'forbidden' }] }));
  assert.throws(() => readSessions(storage));
  const denied = { ...memoryStore(), setItem: () => { throw Error('quota'); } };
  assert.throws(() => saveSession(session, denied, 'create'), /quota/);
});
test('schema exposes exactly ten allowed CSV columns and no free-text metadata', () => {
  assert.equal(CSV_HEADERS.length, 10);
  assert.equal(CSV_HEADERS.filter(key => /message|name|email|address|ending|device/.test(key)).length, 0);
});
test('CLI returns failure for invalid CSV and insufficient real data; conflicting merge never overwrites output', async () => {
  await fs.mkdir('artifacts', { recursive: true });
  const dir = await fs.mkdtemp('artifacts/data-cli-test-');
  await fs.writeFile(`${dir}/first.csv`, csv());
  await fs.writeFile(`${dir}/invalid.csv`, csv().replace(',1,sentetik', ',2,sentetik'));
  const changed = rows(); changed[0].difficulty_label = 0;
  await fs.writeFile(`${dir}/conflict.csv`, serializeCsv(changed));
  await fs.writeFile(`${dir}/output.csv`, 'UNCHANGED');
  const run = (args: string[]) => spawnSync(process.execPath, ['--import', 'tsx', 'scripts/data-cli.ts', ...args], { encoding: 'utf8', windowsHide: true });
  assert.equal(run(['validate', `${dir}/invalid.csv`]).status, 1);
  assert.equal(run(['validate', '--require-ready', `${dir}/first.csv`]).status, 1);
  assert.equal(run(['validate', `${dir}/first.csv`]).status, 0);
  assert.equal(run(['merge', '--output', `${dir}/output.csv`, `${dir}/first.csv`, `${dir}/conflict.csv`]).status, 1);
  assert.equal(await fs.readFile(`${dir}/output.csv`, 'utf8'), 'UNCHANGED');
});
