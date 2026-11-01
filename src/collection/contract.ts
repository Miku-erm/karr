export const FEATURE_ORDER = ['decision_elapsed_seconds', 'option_switch_count', 'hint_request_count', 'prior_high_risk_choice_count', 'scene_number', 'experience_code'] as const;
export const CSV_HEADERS = ['session_id', 'participant_group', 'scene_number', 'decision_elapsed_seconds', 'option_switch_count', 'hint_request_count', 'prior_high_risk_choice_count', 'experience_code', 'difficulty_label', 'kaynak'] as const;
export const STORAGE_KEY = 'primer-adapt.collection.v1';
export type Source = 'gercek' | 'sentetik';
export interface DecisionRow {
  session_id: string;
  participant_group: string;
  scene_number: number;
  decision_elapsed_seconds: number;
  option_switch_count: number;
  hint_request_count: number;
  prior_high_risk_choice_count: number;
  experience_code: number;
  difficulty_label: 0 | 1;
  kaynak: Source;
}
export type Observation = Pick<DecisionRow, typeof FEATURE_ORDER[number]>;
export interface CollectionSession {
  session_id: string;
  participant_group: string;
  kaynak: Source;
  status: 'incomplete' | 'completed';
  rows: DecisionRow[];
}
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const validGroup = (value: string) => value === '' || /^P(?:0[1-9]|[1-9][0-9])$/.test(value);

export function validateRow(row: DecisionRow): string[] {
  const errors: string[] = [];
  if (!row || typeof row !== 'object' || Object.keys(row).length !== CSV_HEADERS.length || CSV_HEADERS.some(key => !(key in row))) return ['Beklenmeyen/eksik sütun; kişisel veri alanları kabul edilmez.'];
  if (typeof row.session_id !== 'string' || !UUID_PATTERN.test(row.session_id)) errors.push('session_id UUID v4 olmalı.');
  if (typeof row.participant_group !== 'string' || !validGroup(row.participant_group)) errors.push('participant_group boş veya P01–P99 olmalı.');
  if (!['gercek', 'sentetik'].includes(row.kaynak)) errors.push('kaynak yalnız gercek/sentetik olabilir.');
  for (const key of FEATURE_ORDER) if (typeof row[key] !== 'number' || !Number.isFinite(row[key])) errors.push(`${key} sonlu sayı olmalı.`);
  if (row.decision_elapsed_seconds < 0 || row.decision_elapsed_seconds > 120) errors.push('Süre 0–120 saniye olmalı.');
  for (const key of ['option_switch_count', 'hint_request_count'] as const) if (!Number.isSafeInteger(row[key]) || row[key] < 0) errors.push(`${key} negatif olmayan güvenli tamsayı olmalı.`);
  if (![1, 2, 3].includes(row.scene_number)) errors.push('scene_number 1/2/3 olmalı.');
  if (![0, 1, 2].includes(row.experience_code)) errors.push('experience_code 0/1/2 olmalı.');
  if (!Number.isInteger(row.prior_high_risk_choice_count) || row.prior_high_risk_choice_count < 0 || row.prior_high_risk_choice_count >= row.scene_number) errors.push('Önceki B sayısı 0 ile scene_number-1 arasında olmalı.');
  if (row.difficulty_label !== 0 && row.difficulty_label !== 1) errors.push('difficulty_label bağımsız 0/1 olmalı.');
  return errors;
}

export function validateSession(session: CollectionSession): string[] {
  if (!session || typeof session !== 'object' || !Array.isArray(session.rows) || Object.keys(session).sort().join(',') !== 'kaynak,participant_group,rows,session_id,status') return ['Geçersiz oturum yapısı.'];
  const errors: string[] = [];
  if (!UUID_PATTERN.test(session.session_id) || !validGroup(session.participant_group) || !['gercek', 'sentetik'].includes(session.kaynak)) errors.push('Geçersiz oturum kimlik/grup/kaynak alanı.');
  if (!['incomplete', 'completed'].includes(session.status)) errors.push('Geçersiz oturum durumu.');
  if (session.rows.length > 3 || (session.status === 'completed') !== (session.rows.length === 3)) errors.push('Tamamlanan oturum tam üç satır olmalı.');
  session.rows.forEach((row, index) => {
    const rowErrors = validateRow(row);
    errors.push(...rowErrors);
    if (!row || typeof row !== 'object') return;
    if (row.session_id !== session.session_id || row.participant_group !== session.participant_group || row.kaynak !== session.kaynak || row.scene_number !== index + 1) errors.push('Oturum satırları aynı kimlik/grup/kaynak ve sıralı sahneler içermeli.');
    if (index && row.experience_code !== session.rows[0]?.experience_code) errors.push('Oturum deneyim kodu değişemez.');
  });
  return errors;
}

// Accept BOM, CRLF and standard CSV quoting; never execute or infer cell contents.
export function parseCsv(text: string): string[][] {
  text = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false, closed = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else cell += ch;
    } else if (ch === '"' && cell === '' && !closed) quoted = true;
    else if (ch === ',' || ch === '\n' || ch === '\r') {
      row.push(cell); cell = ''; closed = false;
      if (ch !== ',') { rows.push(row); row = []; if (ch === '\r' && text[i + 1] === '\n') i++; }
    } else {
      if (closed || ch === '"') throw Error('Geçersiz CSV tırnak yapısı.');
      cell += ch;
    }
  }
  if (quoted) throw Error('Kapanmamış CSV tırnağı.');
  if (cell !== '' || row.length || closed) { row.push(cell); rows.push(row); }
  return rows;
}

export function validateCsv(text: string) {
  const errors: string[] = [];
  let cells: string[][];
  try { cells = parseCsv(text); } catch (e) { return { errors: [(e as Error).message], rows: [] as DecisionRow[], sessions: [] as CollectionSession[] }; }
  if (!cells.length || cells[0].join(',') !== CSV_HEADERS.join(',')) return { errors: ['CSV başlığı sabit sözleşmeyle tam eşleşmeli; ek kişisel alan kabul edilmez.'], rows: [] as DecisionRow[], sessions: [] as CollectionSession[] };
  const rows: DecisionRow[] = [];
  const seen = new Set<string>();
  cells.slice(1).forEach((values, index) => {
    if (values.length !== CSV_HEADERS.length) { errors.push(`Satır ${index + 2}: sütun sayısı yanlış.`); return; }
    const row = Object.fromEntries(CSV_HEADERS.map((key, i) => [key, ['session_id', 'participant_group', 'kaynak'].includes(key) ? values[i] : values[i].trim() === '' ? NaN : Number(values[i])])) as unknown as DecisionRow;
    // Labels are explicitly encoded, never coerced from blank/boolean/decimal text.
    if (!['0', '1'].includes(values[8])) errors.push(`Satır ${index + 2}: etiket yalnız 0/1 olmalı.`);
    errors.push(...validateRow(row).map(error => `Satır ${index + 2}: ${error}`));
    row.session_id = row.session_id.toLowerCase();
    const pair = `${row.session_id}/${row.scene_number}`;
    if (seen.has(pair)) errors.push(`Satır ${index + 2}: tekrarlı oturum/sahne çifti.`);
    seen.add(pair); rows.push(row);
  });
  const grouped = new Map<string, DecisionRow[]>();
  for (const row of rows) grouped.set(row.session_id, [...(grouped.get(row.session_id) || []), row]);
  const sessions: CollectionSession[] = [];
  for (const [id, records] of grouped) {
    const sorted = records.sort((a, b) => a.scene_number - b.scene_number);
    const session: CollectionSession = { session_id: id, participant_group: sorted[0].participant_group, kaynak: sorted[0].kaynak, status: 'completed', rows: sorted };
    errors.push(...validateSession(session).map(error => `Oturum denetimi: ${error}`));
    sessions.push(session);
  }
  return { errors, rows, sessions };
}

export function serializeCsv(rows: DecisionRow[]) {
  const quote = (value: string | number) => /[",\r\n]/.test(String(value)) ? `"${String(value).replaceAll('"', '""')}"` : String(value);
  for (const row of rows) if (validateRow(row).length) throw Error('Geçersiz satır export edilemez.');
  return CSV_HEADERS.join(',') + '\r\n' + rows.map(row => CSV_HEADERS.map(key => quote(row[key])).join(',')).join('\r\n') + (rows.length ? '\r\n' : '');
}

export function dataSummary(sessions: CollectionSession[]) {
  const completed = sessions.filter(s => s.status === 'completed');
  const genuine = completed.filter(s => s.kaynak === 'gercek');
  const rows = genuine.flatMap(s => s.rows);
  const balance = [0, 1].map(label => ({ label, rows: rows.filter(r => r.difficulty_label === label).length, sessions: genuine.filter(s => s.rows.some(r => r.difficulty_label === label)).length }));
  return { genuineSessions: genuine.length, syntheticSessions: completed.length - genuine.length, completedRows: completed.length * 3, genuineRows: rows.length, incompleteSessions: sessions.length - completed.length, labelBalance: balance, dataReady: genuine.length >= 15 && balance.every(b => b.rows >= 5 && b.sessions >= 3) };
}

export function mergeExports(texts: string[]) {
  const sessions = new Map<string, CollectionSession>();
  for (const text of texts) {
    const parsed = validateCsv(text);
    if (parsed.errors.length) throw Error(parsed.errors.join('\n'));
    for (const session of parsed.sessions) {
      const old = sessions.get(session.session_id);
      if (old && JSON.stringify(old) !== JSON.stringify(session)) throw Error('Aynı session_id için çelişkili satırlar; birleştirme durduruldu.');
      sessions.set(session.session_id, session);
    }
  }
  return serializeCsv([...sessions.values()].flatMap(s => s.rows));
}
