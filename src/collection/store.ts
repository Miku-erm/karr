import { CollectionSession, dataSummary, serializeCsv, STORAGE_KEY, validateSession } from './contract';

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const notify = () => { if (typeof window !== 'undefined') window.dispatchEvent(new Event('primer-collection-change')); };
export function readSessions(storage: Store = window.localStorage): CollectionSession[] {
  const text = storage.getItem(STORAGE_KEY);
  if (text === null) return [];
  const state = JSON.parse(text);
  if (!state || state.version !== 1 || !Array.isArray(state.sessions) || Object.keys(state).sort().join(',') !== 'sessions,version') throw Error('Kayıt biçimi okunamadı; mevcut veri üzerine yazılmadı.');
  const sessions: CollectionSession[] = state.sessions;
  if (new Set(sessions.map(s => s.session_id)).size !== sessions.length || sessions.some(s => validateSession(s).length)) throw Error('Kayıt bütünlüğü doğrulanamadı; mevcut veri üzerine yazılmadı.');
  return sessions;
}
export function saveSession(session: CollectionSession, storage: Store = window.localStorage, operation: 'create' | 'update' = 'update') {
  if (validateSession(session).length) throw Error('Geçersiz oturum kaydedilemez.');
  const current = readSessions(storage);
  const exists = current.some(s => s.session_id === session.session_id);
  if (operation === 'create' && exists) throw Error('Oturum UUID çakışması; eski kayıt korunur.');
  if (operation === 'update' && !exists) throw Error('Oturum silinmiş; yeniden oluşturulmaz.');
  const sessions = current.filter(s => s.session_id !== session.session_id);
  const payload = JSON.stringify({ version: 1, sessions: [...sessions, session] });
  storage.setItem(STORAGE_KEY, payload); // Quota/private-mode errors propagate; no success is fabricated.
  if (storage.getItem(STORAGE_KEY) !== payload) throw Error('Kalıcı kayıt doğrulanamadı.');
  notify();
}
export function deleteSession(id: string, storage: Store = window.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sessions: readSessions(storage).filter(s => s.session_id !== id) }));
  notify();
}
export function deleteAllSessions(storage: Store = window.localStorage) { storage.removeItem(STORAGE_KEY); notify(); }
export function exportSessions(storage: Store = window.localStorage) {
  return serializeCsv(readSessions(storage).filter(s => s.status === 'completed').flatMap(s => s.rows));
}
export function summarizeStored(storage: Store = window.localStorage) { return dataSummary(readSessions(storage)); }

export function isHumanInteraction(trusted: boolean) {
  return trusted && !navigator.webdriver && !('Cypress' in window);
}

export function downloadCsv() {
  const text = exportSessions();
  const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'oturumlar.csv';
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
