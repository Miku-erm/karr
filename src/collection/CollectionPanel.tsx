import React, { useEffect, useState } from 'react';
import { CollectionSession, dataSummary, validGroup } from './contract';
import { deleteAllSessions, deleteSession, downloadCsv, readSessions } from './store';

const button = 'min-h-11 rounded-lg px-3 py-2 text-sm font-semibold border border-[#89d4cd]/40 text-[#89d4cd] disabled:opacity-40';
interface Props {
  consented: boolean;
  initialGroup: string;
  error: string;
  onConsent: (group: string, trusted: boolean) => void;
  onDecline: () => void;
  onClearError: () => void;
}
export function CollectionPanel({ consented, initialGroup, error, onConsent, onDecline, onClearError }: Props) {
  const [checked, setChecked] = useState(false);
  const [group, setGroup] = useState(initialGroup);
  const [sessions, setSessions] = useState<CollectionSession[]>([]);
  const [storageError, setStorageError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const reload = () => {
    try { setSessions(readSessions()); setStorageError(''); }
    catch { setStorageError('Tarayıcı kaydı okunamadı. Veri üzerine yazılmadı; toplam sayılar doğrulanamıyor. Normal oyun kullanılabilir.'); }
  };
  useEffect(() => {
    reload();
    window.addEventListener('storage', reload);
    window.addEventListener('primer-collection-change', reload);
    return () => { window.removeEventListener('storage', reload); window.removeEventListener('primer-collection-change', reload); };
  }, []);
  const act = (action: () => void) => {
    try { action(); reload(); onClearError(); }
    catch { setStorageError('İşlem tamamlanamadı. Tarayıcı depolama iznini kontrol et; veri kaydedilmiş veya silinmiş sayılmadı.'); }
  };
  const summary = dataSummary(sessions);
  return (
    <section data-testid="collection-panel" className="rounded-xl bg-[#002220] border border-[#89d4cd]/40 p-4 mb-5 space-y-3 text-sm leading-relaxed">
      <h2 className="font-headline text-xl text-[#89d4cd]">Veri Toplama Modu</h2>
      <p><strong>Primer Adapt — Karar Yüküne Duyarlı Öğrenme.</strong> YZM301 ödevi için gönüllü oyun davranışları toplanır. Katılım isteğe bağlıdır; reddetmek normal oyunu etkilemez.</p>
      <p>Yalnızca karar süresi (en fazla 120 saniye), seçenek değiştirme ve ipucu/Tutor isteği sayısı, önceki B sayısı, sahne, deneyim kodu ve senin verdiğin 0/1 zorluk yanıtı saklanır. Her oyun yeni rastgele UUID alır.</p>
      <p>Ad, e-posta, konum, cihaz kimliği, IP, sağlık bilgisi veya serbest metin kaydedilmez. Sayısal kayıtlar bu tarayıcıda kalır; davranış ölçümleri Gemini'ye veya sunucuya gönderilmez. İsteğe bağlı Tutor'a kendin gönderdiğin sorular mevcut Gemini servisine iletilir, veri kümesine eklenmez.</p>
      <p className="text-[#ffb870]">Dışa aktarılan anonim satırlar, herkese açık GitHub ders deposunda yayımlanabilir. Yayından önce vazgeçip bu tarayıcıdaki oturumlarını silebilirsin. Daha önce indirilen/yayımlanan kopyalar tarayıcıdan silmeyle geri alınmaz; yayımlama sorumlusuna anonim oturum UUID'sini ilet.</p>
      <p>Zorluk yanıtın öz bildirimdir; psikolojik tanı veya nesnel başarı puanı değildir. Bu aşamada model eğitilmez, otomatik uyarlama yapılmaz.</p>
      {!consented ? <>
        <label className="block" htmlFor="participant-group">İsteğe bağlı anonim grup kodu (P01–P99)</label>
        <input id="participant-group" data-testid="participant-group" value={group} maxLength={3} onChange={e => setGroup(e.target.value.toUpperCase())} placeholder="P01" autoComplete="off" className="w-full min-h-11 rounded-lg border border-[#89d4cd]/40 bg-[#100e09] px-3" aria-describedby="group-note" />
        <p id="group-note" className="text-xs text-[#c5c6ce]">Aynı gönüllü beş oyununda aynı kodu kullanabilir. Kod–gerçek kimlik eşlemesi tutma; bu alana ad yazma.</p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input data-testid="collection-consent" type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="mt-1 h-5 w-5 shrink-0" />
          <span>Bilgilendirmeyi okudum; bu oyunumun sayısal verilerinin kaydına ve belirtilen akademik kullanımına gönüllü olarak onay veriyorum.</span>
        </label>
        <button data-testid="consent-accept" type="button" disabled={!checked || !validGroup(group) || Boolean(storageError)} onClick={e => onConsent(group, e.isTrusted)} className={button + ' w-full'}>Onayla — ardından profilini seçip hikâyeye başla</button>
      </> : <p data-testid="consent-confirmed" className="text-[#89d4cd]">Bu oyun için onay alındı. Aşağıdaki üç profil alanını seçip hikâyeyi başlatabilirsin.</p>}
      <button data-testid="consent-decline" type="button" onClick={onDecline} className={button + ' w-full'}>Katılmıyorum — normal oyuna dön</button>
      <div className="border-t border-[#89d4cd]/30 pt-3 space-y-2" aria-live="polite">
        <h3 className="font-semibold">Bu tarayıcıdaki kayıtlar</h3>
        <p data-testid="collection-counts">{summary.genuineSessions} tamamlanmış gerçek oturum · {summary.genuineRows} gerçek karar satırı · {summary.syntheticSessions} tamamlanmış sentetik/test oturumu · {summary.incompleteSessions} eksik oturum</p>
        <p className="text-xs">Eksik oturumlar eğitim CSV'sine alınmaz. Otomasyon kayıtları sentetik olarak ayrı tutulur. Gerçek/sentetik ayrımı insan katılımını bağımsız olarak doğrulamaz; gönüllü toplama protokolü uygulanmalıdır.</p>
        <button data-testid="collection-export" type="button" disabled={Boolean(storageError)} onClick={() => act(downloadCsv)} className={button + ' w-full'}>Tüm tamamlanan oturumları CSV indir</button>
        <p className="text-xs text-[#c5c6ce]">CSV, bu tarayıcıdaki tüm tamamlanmış gerçek ve sentetik satırları kaynak etiketiyle içerir. Diğer cihazları birleştirme: docs/HUMAN_COLLECTION_GUIDE.md.</p>
        <details><summary className="cursor-pointer py-2">Oturumları gör / tek oturumu sil ({sessions.length})</summary>
          <ul className="space-y-2">{sessions.map(s => <li key={s.session_id} className="p-2 bg-[#100e09] rounded-lg break-all text-xs">
            <span>{s.session_id} · {s.participant_group || 'grupsuz'} · {s.kaynak} · {s.status === 'completed' ? 'tamamlandı' : 'eksik'} · {s.rows.length}/3</span>
            <button type="button" aria-label={`Oturumu sil ${s.session_id}`} onClick={() => act(() => deleteSession(s.session_id))} className={button + ' mt-1 w-full'}>Bu oturumu sil</button>
          </li>)}</ul>
        </details>
        {!confirmDelete ? <button data-testid="collection-delete-all" type="button" onClick={() => setConfirmDelete(true)} className={button + ' w-full text-[#ffb4ab]'}>Tüm toplanan verileri sil</button> : <div className="space-y-2">
          <p>Bu tarayıcıdaki gerçek, sentetik ve eksik kayıtların tamamı kalıcı olarak silinecek.</p>
          <button data-testid="collection-delete-confirm" type="button" onClick={() => act(() => { deleteAllSessions(); setConfirmDelete(false); })} className={button + ' w-full text-[#ffb4ab]'}>Evet, tüm verileri sil</button>
          <button type="button" onClick={() => setConfirmDelete(false)} className={button + ' w-full'}>Vazgeç</button>
        </div>}
      </div>
      {(error || storageError) && <p data-testid="collection-error" role="alert" className="text-[#ffb4ab]">{error || storageError}</p>}
    </section>
  );
}
