import fs from 'node:fs/promises';
import path from 'node:path';
const base = process.env.APP_BASE_URL || 'http://127.0.0.1:3000';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const cases = JSON.parse(await fs.readFile('eval/tutor-cases.json', 'utf8'));
if (cases.cases.length !== 20 || new Set(cases.cases.map(c => c.id)).size !== 20) throw Error('Exactly twenty unique cases required');
const smoke = process.argv.includes('--smoke');
const selected = smoke ? [{ id: 'SMOKE', decisionId: 'architecture', experience: 'beginner', role: 'developer', goal: 'architecture', studentMessage: 'Hangi seçeneği seçmeliyim?' }] : cases.cases;
const results = { datasetSource: cases.source, planned: smoke ? 1 : 20, startedAt: new Date().toISOString(), baseUrl: base, model: null, human_review_status: 'pending', cases: [] };
const output = smoke ? 'eval/smoke.json' : 'eval/tutor-results.json';
await fs.mkdir('eval/raw', { recursive: true });
for (const c of selected) {
  const attempts = [];
  for (let i = 0; i < 2; i++) {
    const startedAt = new Date().toISOString();
    const t = Date.now();
    let response = null;
    let evidence = null;
    let transportError = null;
    let httpStatus = null;
    try {
      const res = await fetch(`${base}/api/tutor`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-tutor-eval-id': c.id }, body: JSON.stringify({ decisionId: c.decisionId, experience: c.experience, role: c.role, goal: c.goal, phase: 'before_choice', finalizedChoices: c.finalizedChoices || {}, message: c.studentMessage }), signal: AbortSignal.timeout(18000) });
      httpStatus = res.status;
      response = await res.json();
      if (response.requestId) {
        try { evidence = JSON.parse(await fs.readFile(path.join('eval/raw', `${c.id}-${response.requestId}.json`), 'utf8')); } catch { /* Missing raw evidence is explicitly recorded below. */ }
      }
    } catch (e) { transportError = e.name; }
    attempts.push({ attempt: i + 1, startedAt, latencyMs: Date.now() - t, httpStatus, response, evidence, transportError });
    if (response?.liveAi || !['RATE_LIMIT', 'TIMEOUT', 'NETWORK_OR_PROVIDER', 'PROVIDER_ERROR'].includes(response?.errorCode) && !transportError) break;
    if (i === 0) await sleep(response?.errorCode === 'RATE_LIMIT' ? 10000 : 2000);
  }
  const last = attempts.at(-1);
  const text = last.evidence?.parsedModelMessage || last.response?.messageTr || '';
  const completed = Boolean(last.response?.liveAi && last.evidence?.rawModelResponse);
  const directLeak = /(?:\b[AB]\b.{0,16}(?:seç|işaretle|doğru)|doğru (?:cevap|seçenek).{0,12}\b[AB]\b|(?:ilk|ikinci) seçeneği seç|ENDING_)/iu.test(text);
  const hasQuestion = text.includes('?');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const assessment = {
    method: 'deterministic_screening_pending_agent_semantic_review',
    dimensions: { direct_answer_leak: directLeak, socratic_compliance: hasQuestion && !directLeak, context_relevance: null, technical_correctness: null, appropriate_behavior: wordCount <= 90 && text.length > 0 },
    preliminary_pass: false, failure_category: completed ? 'semantic_review_pending' : last.response?.errorCode || last.transportError || 'missing_raw_evidence',
    justification: completed ? 'Question, length and explicit leakage screened; semantic review required.' : 'No complete real model response/evidence; fallback is not a model success.',
    human_review_status: 'pending',
  };
  results.model = last.response?.model || results.model;
  results.cases.push({ id: c.id, decisionId: c.decisionId, studentMessage: c.studentMessage, status: completed ? 'completed' : 'incomplete', modelResponse: completed ? text : null, rawModelResponse: last.evidence?.rawModelResponse || null, displayedResponse: last.response, attempts, assessment });
  results.updatedAt = new Date().toISOString();
  await fs.writeFile(output, JSON.stringify(results, null, 2));
  console.log(`${c.id}: ${completed ? 'REAL_RESPONSE' : 'INCOMPLETE'} (${attempts.length} attempt(s), ${last.response?.errorCode || 'no API error'})`);
  if (!smoke) await sleep(2000);
}
results.completedAt = new Date().toISOString();
await fs.writeFile(output, JSON.stringify(results, null, 2));
console.log(`Saved ${output}; completed ${results.cases.filter(c => c.status === 'completed').length}/${results.planned}. Human review pending.`);
