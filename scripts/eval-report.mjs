import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const dir = process.env.TUTOR_EVAL_OUTPUT_DIR || 'eval';
const result = JSON.parse(await fs.readFile(path.join(dir,'tutor-results.json'),'utf8'));
const semantic = JSON.parse(await fs.readFile(path.join(dir,'semantic-review.json'),'utf8').catch(()=>'{}'));
const q = value => '"' + String(value ?? '').replaceAll('"','""') + '"';
for (const c of result.cases) {
  const hash = createHash('sha256').update(c.modelResponse || '').digest('hex');
  const review = semantic.reviews?.find(r=>r.id===c.id && r.modelResponseSha256===hash);
  const a = c.assessment;
  const d = a.dimensions;
  // Semantic judgments apply only to the exact response that was actually read.
  d.context_relevance = review?.dimensions.context_relevance ?? null;
  d.technical_correctness = review?.dimensions.technical_correctness ?? null;
  if (review?.dimensions.socratic_compliance !== undefined) d.socratic_compliance = review.dimensions.socratic_compliance;
  if (review?.dimensions.appropriate_behavior !== undefined) d.appropriate_behavior = review.dimensions.appropriate_behavior;
  if (review?.dimensions.direct_answer_leak !== undefined) d.direct_answer_leak = review.dimensions.direct_answer_leak;
  a.method = review ? 'deterministic_screening_plus_response_hash_bound_Codex_semantic_review; not independent human review' : 'deterministic_screening; semantic_review_pending';
  a.preliminary_pass = c.status==='completed' && !d.direct_answer_leak && d.socratic_compliance===true && d.context_relevance===true && d.technical_correctness===true && d.appropriate_behavior===true;
  const failures = [['direct_answer_leak', d.direct_answer_leak===true],['socratic_compliance',d.socratic_compliance===false],['context_relevance',d.context_relevance===false],['technical_correctness',d.technical_correctness===false],['appropriate_behavior',d.appropriate_behavior===false]].filter(([,failed])=>failed).map(([name])=>name);
  if(c.status==='completed') a.failure_category = failures.length ? failures.join(', ') : review ? null : 'semantic_review_pending';
  a.justification = review?.justification || (c.status==='completed' ? 'Only deterministic question, length and explicit leakage checks completed; semantic review pending.' : a.justification);
  a.human_review_status = 'pending';
}
const complete = result.cases.filter(c=>c.status==='completed');
const attempts = result.cases.flatMap(c=>c.attempts);
const count = predicate => complete.filter(predicate).length;
const failures = key => count(c=>c.assessment.dimensions[key]===false);
result.statistics = {planned:20,completed:complete.length,incomplete:20-complete.length,apiAttempts:attempts.length,failedApiCalls:attempts.filter(a=>!a.response?.liveAi).length,directAnswerLeaks:count(c=>c.assessment.dimensions.direct_answer_leak===true),directAnswerLeakDenominator:complete.length,socraticCompliant:count(c=>c.assessment.dimensions.socratic_compliance===true),socraticDenominator:complete.length,technicalCorrectnessFailures:failures('technical_correctness'),contextFailures:failures('context_relevance'),otherErrors:failures('appropriate_behavior'),preliminaryPass:count(c=>c.assessment.preliminary_pass),semanticReviewed:count(c=>c.assessment.dimensions.context_relevance!==null && c.assessment.dimensions.technical_correctness!==null),humanReviewed:0};
await fs.writeFile(path.join(dir,'tutor-results.json'),JSON.stringify(result,null,2));
const header = ['case_id','decision_id','student_message','model_response','preliminary_pass','direct_answer_leak','socratic_compliance','context_relevance','technical_correctness','appropriate_behavior','failure_category','justification','human_review_status','human_reviewer','human_pass','human_comments'];
const rows = result.cases.map(c=>[c.id,c.decisionId,c.studentMessage,c.modelResponse,c.assessment.preliminary_pass,...['direct_answer_leak','socratic_compliance','context_relevance','technical_correctness','appropriate_behavior'].map(k=>c.assessment.dimensions[k]),c.assessment.failure_category,c.assessment.justification,'pending','','','']);
const csvPath = path.join(dir,'human-review.csv');
const oldCsv = await fs.readFile(csvPath,'utf8').catch(()=>'');
const sameResponses = result.cases.every(c=>oldCsv.includes(q(c.modelResponse)));
if(oldCsv.includes('"reviewed"') && sameResponses) console.log('Preserved reviewed fields for these exact responses.');
else {
  if(oldCsv.includes('"reviewed"')) await fs.writeFile(csvPath+'.archive-'+Date.now(),oldCsv);
  await fs.writeFile(csvPath,'\uFEFF'+[header,...rows].map(r=>r.map(q).join(',')).join('\r\n'));
}
const s=result.statistics;
const rate=(n,d)=>d ? `${n}/${d} = ${(100*n/d).toFixed(1)}%` : `${n}/${d}; rate not measured`;
const confirmation=JSON.parse(await fs.readFile(path.join(dir,'review-provenance.json'),'utf8').catch(()=>'null'));
const reviewNote=confirmation && sameResponses ? `Project-owner confirmation preserved: ${confirmation.reviewer}, ${confirmation.reviewedCases}/20 rows (${confirmation.passed} pass, ${confirmation.failed} fail); AI-assisted comments accepted, independent human review not claimed. See review-provenance.json and human-review.csv.\n\n` : '';
const relative = dir==='eval' ? '../eval/' : './';
const report=`# Real Gemini Tutor evaluation\n\nRun: ${result.completedAt}. Model: **${result.model}**. Endpoint: actual application POST /api/tutor. Prompt: socratic-v2; JSON; temperature 0.3; maximum 512 output tokens; 12-second provider timeout; at most two sequential attempts per case.\n\n${reviewNote}Exactly 20 distinct author-created student-message cases; recruited student participants: **0**. Responses and failed attempts are real provider/application evidence; fallback text is never counted as model success. Semantic labels are preliminary Codex assessments tied to each exact response SHA-256. **Independent human review: pending, 0/20.** Unknown semantic dimensions remain null and are not counted as passed or failed.\n\n| Metric | Result |\n|---|---|\n| Planned | 20 |\n| Completed real responses | ${rate(s.completed,20)} |\n| Incomplete | ${s.incomplete}/20 |\n| Failed API attempts | ${rate(s.failedApiCalls,s.apiAttempts)} |\n| Direct answer leaks | ${rate(s.directAnswerLeaks,s.completed)} |\n| Socratic reasoning / answer withholding | ${rate(s.socraticCompliant,s.completed)} |\n| Technical correctness failures | ${s.technicalCorrectnessFailures}/${s.semanticReviewed} semantically reviewed |\n| Context failures | ${s.contextFailures}/${s.semanticReviewed} semantically reviewed |\n| Other behavior failures | ${s.otherErrors}/${s.completed} |\n| Preliminary A-E pass | ${rate(s.preliminaryPass,s.completed)} |\n| Semantic review completed | ${s.semanticReviewed}/${s.completed} |\n| Independent human review | 0/20 pending |\n\nA: explicit/semantic option leakage. B: reasoning rather than supplying an answer. C: scene relevance. D: engineering correctness. E: respectful, concise, safe behavior (90-word target). Deterministic question/length/leak checks cannot establish semantic correctness. Per-case judgments below are preliminary, not independent human validation.\n\n| Case | Context | Status | Preliminary | Reason |\n|---|---|---|---|---|\n${result.cases.map(c=>`| ${c.id} | ${c.decisionId} | ${c.status} | ${c.assessment.preliminary_pass?'PASS':c.assessment.failure_category==='semantic_review_pending'?'PENDING':'FAIL'} | ${c.assessment.justification.replaceAll('|','/').replaceAll('\n',' ')} |`).join('\n')}\n\n[Results and all attempts](${relative}tutor-results.json) · [Review CSV](${relative}human-review.csv) · [Response-bound semantic notes](${relative}semantic-review.json). Original raw server evidence remains in eval/raw/. New runs must be reviewed independently; IDs alone never carry forward semantic labels. Fill human_reviewer, human_pass, human_comments and human_review_status in the CSV after an actual review. No automated script creates human approval.\n\nRun server with npm run dev:evidence, then npm run tutor:smoke and npm run tutor:eval. Set TUTOR_EVAL_OUTPUT_DIR to an unused run folder to preserve earlier results. Review actual responses and save response-hash-bound semantic notes before npm run tutor:report. No billing is enabled by these scripts.\n`;
await fs.writeFile(dir==='eval'?'docs/tutor-evaluation.md':path.join(dir,'report.md'),report);
console.log(JSON.stringify(s,null,2));
