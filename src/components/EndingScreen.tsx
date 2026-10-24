import React, { useState } from 'react';
import { ChoiceId, EndingDefinition, EndingId, UserProfile } from '../types';
import { ENDINGS } from '../storyData';

interface EndingScreenProps {
  achievedEnding: EndingDefinition;
  choices: Record<'architecture' | 'testing' | 'privacy', ChoiceId>;
  userProfile: UserProfile;
  onRestart: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  achievedEnding,
  choices,
  userProfile,
  onRestart,
}) => {
  // Allow inspecting other permutations while showing achieved ending as active
  const [activeEndingId, setActiveEndingId] = useState<EndingId>(achievedEnding.id);
  const [copiedToast, setCopiedToast] = useState(false);

  const currentEnding = ENDINGS[activeEndingId] || achievedEnding;

  const isAchieved = activeEndingId === achievedEnding.id;

  const handleExportPostMortem = () => {
    const reportText = `# POST-MORTEM RAPORU: 08:00 — Kritik Karar
Tarih: 24 Ekim 2026, 08:00 - 08:42
Nöbetçi Mühendis: ${userProfile.role.toUpperCase()} (${userProfile.experience})
Öğrenme Odak Noktası: ${userProfile.goal.toUpperCase()}

## 1. SONUÇ
Nihai Durum: ${currentEnding.badgeTitle}
Epilog: ${currentEnding.summary}

## 2. TRIYAJ VE KARAR PATİKASI
- Karar 1 (Mimari): ${choices.architecture === 'A' ? 'A (Eski sürüme dön / Rollback)' : 'B (Canlıda acil yama / Hotfix)'}
- Karar 2 (Test): ${choices.testing === 'A' ? 'A (Hedefli smoke & entegrasyon testleri)' : 'B (Testleri atla / Doğrudan trafik)'}
- Karar 3 (Gizlilik): ${choices.privacy === 'A' ? 'A (Tanımlayıcıları maskele & erişimi sınırla)' : 'B (Ham logları genel sohbete gönder)'}

## 3. MÜHENDİSLİK DERSLERİ (DEBRIEF)
1. Mimari: Expand & Contract deseni ile şema ve kod bağımsızlığı.
2. Test: Yük altında transaction kilitlenmelerini simüle eden kaos testleri.
3. Güvenlik: Hata loglarında kişisel sağlık verilerinin (PII) maskelenmesi.

SIM_ID: MED-PROD-2024-0800 • v1.4.2
`;

    navigator.clipboard?.writeText(reportText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-12">
      {/* 1. Atmospheric Status Canvas */}
      <div className="relative overflow-hidden rounded-xl bg-[#2c2a24] border border-[#37352e] p-5 shadow-xl">
        {/* Ambient Radial Glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#ffb870]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#89d4cd]/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Resolution Outcome Badge */}
          <div className="flex items-center justify-between">
            <div
              data-testid="ending-title"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md font-mono text-[11px] font-semibold tracking-wider uppercase ${
                activeEndingId === 'ENDING_SAFE'
                  ? 'bg-[#002220] text-[#89d4cd] border border-[#89d4cd]/30'
                  : activeEndingId === 'ENDING_FRAGILE'
                  ? 'bg-[#a35f02]/30 text-[#ffb870] border border-[#ffb870]/30'
                  : 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {activeEndingId === 'ENDING_SAFE'
                  ? 'verified_user'
                  : activeEndingId === 'ENDING_FRAGILE'
                  ? 'warning'
                  : 'crisis_alert'}
              </span>
              <span>{currentEnding.badgeTitle}</span>
            </div>

            <span className="font-mono text-[11px] text-[#c5c6ce] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#89d4cd]"></span>
              {isAchieved ? 'Senin Sonucun' : 'Alternatif Senaryo'}
            </span>
          </div>

          {/* Ending Permutations Capsule Switcher */}
          <div className="w-full overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex items-center gap-1.5 bg-[#100e09] border border-[#211f19] p-1 rounded-lg w-max min-w-full">
              {(
                [
                  { id: 'ENDING_SAFE', label: 'Güvenli Kurtarma', color: 'bg-[#89d4cd]' },
                  { id: 'ENDING_FRAGILE', label: 'Kırılgan Kurtarma', color: 'bg-[#ffb870]' },
                  { id: 'ENDING_RECURRING_OUTAGE', label: 'Tekrarlayan Kesinti', color: 'bg-[#ffb4ab]' },
                  { id: 'ENDING_PRIVACY_INCIDENT', label: 'KVKK İhlali', color: 'bg-[#ff5555]' },
                ] as const
              ).map((item) => {
                const isSelected = activeEndingId === item.id;
                const isUserOutcome = achievedEnding.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveEndingId(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[11px] whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-[#37352e] text-[#e8e2d8] shadow-sm font-semibold'
                        : 'text-[#8f9098] hover:text-[#e8e2d8] opacity-75'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span>{item.label}</span>
                    {isUserOutcome && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#ffb870] text-[#2c1600] font-bold">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative Epilogue */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#ffb870] tracking-widest uppercase">
                {currentEnding.epilogue}
              </span>
              <span className="h-px flex-1 bg-[#37352e]"></span>
            </div>
            <p className="font-headline text-[24px] text-[#e8e2d8] font-medium italic">
              "{currentEnding.title}"
            </p>
            <p className="font-body text-[14px] text-[#c5c6ce] leading-relaxed">
              {currentEnding.summary}
            </p>
          </div>

          {/* Telemetry Recovered Metrics Row */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col bg-[#211f19] border border-[#37352e] p-2.5 rounded-lg shadow-sm">
              <span className="font-mono text-[11px] text-[#8f9098]">DB Kilidi</span>
              <span className="font-mono text-[12px] text-[#89d4cd] font-semibold mt-0.5">
                {currentEnding.metrics.dbLock}
              </span>
              <span className="font-mono text-[10px] text-[#89d4cd]/75">
                {currentEnding.metrics.dbLockSub}
              </span>
            </div>
            <div className="flex flex-col bg-[#211f19] border border-[#37352e] p-2.5 rounded-lg shadow-sm">
              <span className="font-mono text-[11px] text-[#8f9098]">Kuyruk</span>
              <span className="font-mono text-[12px] text-[#89d4cd] font-semibold mt-0.5">
                {currentEnding.metrics.queue}
              </span>
              <span className="font-mono text-[10px] text-[#c5c6ce]">
                {currentEnding.metrics.queueSub}
              </span>
            </div>
            <div className="flex flex-col bg-[#211f19] border border-[#37352e] p-2.5 rounded-lg shadow-sm">
              <span className="font-mono text-[11px] text-[#8f9098]">Hasta Kaybı</span>
              <span className="font-mono text-[12px] text-[#89d4cd] font-semibold mt-0.5">
                {currentEnding.metrics.patientLoss}
              </span>
              <span className="font-mono text-[10px] text-[#89d4cd]/75">
                {currentEnding.metrics.patientLossSub}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Editorial Incident Log: Critical Decision Path */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#ffb870]">alt_route</span>
            <h2 className="font-body text-[14px] uppercase tracking-wider font-semibold text-[#e8e2d8]">
              Karar Geçmişi (Triage Patikası)
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#ffb870] bg-[#a35f02]/20 border border-[#ffb870]/30 px-2 py-0.5 rounded">
            3/3 Adım Tamamlandı
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#2c2a24] text-[#ffb870] font-mono text-[12px] font-semibold">
              01
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[#ffb870] font-medium">08:00 • Adım 1</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#89d4cd]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {choices.architecture === 'A' ? 'Mimari Refleks' : 'Hotfix Riski'}
                </span>
              </div>
              <p className="font-body text-[14px] text-[#e8e2d8] font-medium">
                {choices.architecture === 'A'
                  ? 'Şema doğrulama sonrası kontrollü rollback'
                  : 'Canlı ortamda plansız acil yama (Hotfix)'}
              </p>
              <p className="font-body text-[12px] text-[#c5c6ce] leading-relaxed">
                {choices.architecture === 'A'
                  ? 'Ham drop yerine çift yönlü migrasyon uyumu gözetildi, hasta kayıt blokajı çözüldü.'
                  : 'Kilitli indeksler silinerek kuyruk boşaltıldı; fakat derin mimari risk ve bellek baskısı kaldı.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#2c2a24] text-[#ffb870] font-mono text-[12px] font-semibold">
              02
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[#ffb870] font-medium">08:20 • Adım 2</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#89d4cd]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {choices.testing === 'A' ? 'Kaskad Engellendi' : 'Regresyon Kaçırıldı'}
                </span>
              </div>
              <p className="font-body text-[14px] text-[#e8e2d8] font-medium">
                {choices.testing === 'A'
                  ? 'Hedefli smoke ve entegrasyon testleri başarıyla tamamlandı'
                  : 'Testler atlandı ve doğrudan tam trafik açıldı'}
              </p>
              <p className="font-body text-[12px] text-[#c5c6ce] leading-relaxed">
                {choices.testing === 'A'
                  ? 'Yeniden deneme fırtınası (retry storm) durduruldu; veritabanı havuzu tükenmeden teyit edildi.'
                  : 'Sadece yüzeysel toparlanmaya güvenildi; doğrulanmayan randevu akışı ikinci bir kesintiye yol açtı.'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#2c2a24] text-[#ffb870] font-mono text-[12px] font-semibold">
              03
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-[#ffb870] font-medium">08:35 • Adım 3</span>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#89d4cd]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {choices.privacy === 'A' ? 'Veri Güvenliği' : 'KVKK İhlali'}
                </span>
              </div>
              <p className="font-body text-[14px] text-[#e8e2d8] font-medium">
                {choices.privacy === 'A'
                  ? "KVKK log maskelemesi ve yetkili olay triyaj kanalı kullanımı"
                  : "Ham, maskelenmemiş hasta loglarının genel takıma gönderilmesi"}
              </p>
              <p className="font-body text-[12px] text-[#c5c6ce] leading-relaxed">
                {choices.privacy === 'A'
                  ? 'Hata izleme (APM) kayıtlarına ham kimlik ve sağlık verisinin sızması kesin bir filtrelemeyle durduruldu.'
                  : 'Tanı kodları ve kimlikler 120 kişilik kanala yayıldı; ayrı bir resmi adli soruşturma başladı.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Architectural Visual Metaphor (Inline SVG Blueprint) */}
      <div className="flex flex-col p-4 rounded-xl bg-[#101d35] border border-[#2c2a24] shadow-lg">
        <div className="flex items-center justify-between pb-2">
          <span className="font-mono text-[11px] text-[#bac6e6] uppercase tracking-wider font-semibold">
            MİMARİ AKIŞ TOPOLOJİSİ
          </span>
          <span className="font-mono text-[11px] text-[#89d4cd]">
            Expand-Contract Aktif
          </span>
        </div>
        <div className="w-full bg-[#100e09]/80 border border-[#211f19] rounded-lg p-3 flex items-center justify-center">
          <svg className="w-full max-w-[320px] h-20 text-[#e8e2d8]" fill="none" viewBox="0 0 320 80">
            {/* V1 App */}
            <rect fill="#211f19" height="26" rx="4" width="68" x="10" y="8" stroke="#37352e"></rect>
            <text fill="#bac6e6" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="44" y="25">
              V1 [Eski]
            </text>
            {/* V2 App */}
            <rect fill="#211f19" height="26" rx="4" width="68" x="10" y="46" stroke="#ffb870"></rect>
            <text fill="#ffb870" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="44" y="63">
              V2 [Rollback]
            </text>
            {/* Connecting Beams */}
            <path d="M 82 21 L 140 38" stroke="#89d4cd" strokeDasharray="2 2" strokeWidth="1.5"></path>
            <path d="M 82 59 L 140 42" stroke="#ffb870" strokeWidth="1.5"></path>
            {/* Abstraction Layer / Adapter */}
            <rect fill="#37352e" height="32" rx="4" width="76" x="142" y="24"></rect>
            <text fill="#e8e2d8" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="180" y="44">
              Adapter
            </text>
            {/* DB Connection */}
            <path d="M 220 40 L 246 40" stroke="#89d4cd" strokeWidth="2"></path>
            {/* Database Engine */}
            <rect fill="#002220" height="48" rx="6" width="62" x="248" y="16" stroke="#46918c"></rect>
            <ellipse cx="279" cy="28" fill="#46918c" rx="20" ry="6"></ellipse>
            <text fill="#89d4cd" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="279" y="52">
              ACID DB
            </text>
          </svg>
        </div>
      </div>

      {/* 4. Three Core Engineering Lessons */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-[18px] text-[#89d4cd]">menu_book</span>
          <h2 className="font-body text-[14px] uppercase tracking-wider font-semibold text-[#e8e2d8]">
            Mühendislik Dersleri (Debrief)
          </h2>
        </div>

        {/* Lesson 1: Architecture */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2c2a24] flex items-center justify-center text-[#bac6e6]">
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
              </span>
              <span className="font-body text-[14px] text-[#e8e2d8] font-semibold">
                1. Mimari Ders: Expand & Contract
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#bac6e6] bg-[#101d35] px-2 py-0.5 rounded border border-[#bac6e6]/20">
              P0 Architecture
            </span>
          </div>
          <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
            <strong className="text-[#e8e2d8] font-semibold">Geriye Dönük Uyumluluk: </strong>
            Veritabanı şema değişiklikleri kod dağıtımından bağımsız fazlarda yapılmalıdır. Bir kolon eklenirken önce{' '}
            <code className="font-mono text-[11px] bg-[#100e09] px-1.5 py-0.5 rounded text-[#ffb870]">nullable</code>{' '}
            tanımlanmalı; eski ve yeni kod aynı anda sorunsuz çalışabilecek toleransta tutulmalıdır.
          </p>
        </div>

        {/* Lesson 2: Testing */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2c2a24] flex items-center justify-center text-[#ffb870]">
                <span className="material-symbols-outlined text-[16px]">science</span>
              </span>
              <span className="font-body text-[14px] text-[#e8e2d8] font-semibold">
                2. Test Dersi: Kaos & Yük Testi
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#ffb870] bg-[#a35f02]/20 px-2 py-0.5 rounded border border-[#ffb870]/30">
              Verification
            </span>
          </div>
          <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
            <strong className="text-[#e8e2d8] font-semibold">Sessiz Ortam Yanılgısı: </strong>
            Gece 03:00'te sıfır yük altında çalışan servis, sabah 08:00'deki 300 eşzamanlı oturum açılışında meydana gelen transaction kilitlenmelerini simüle eden stres testleri ve kaos denemeleri olmadan canlıya alınmamalıydı.
          </p>
        </div>

        {/* Lesson 3: Legal & KVKK */}
        <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#2c2a24] flex items-center justify-center text-[#89d4cd]">
                <span className="material-symbols-outlined text-[16px]">security</span>
              </span>
              <span className="font-body text-[14px] text-[#e8e2d8] font-semibold">
                3. Güvenlik Dersi: KVKK & Gizlilik
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#89d4cd] bg-[#002220] px-2 py-0.5 rounded border border-[#89d4cd]/30">
              Compliance
            </span>
          </div>
          <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
            <strong className="text-[#e8e2d8] font-semibold">Hata Loglarında Hassas Veri Koruması: </strong>
            Kriz anında loglara düşen stack trace'lerde TC Kimlik ve hasta tanı kodlarının maskelenmiş (redacted) kalması, olası bir resmi veri ihlali soruşturmasını ve ağır idari yaptırımları engelledi.
          </p>
        </div>
      </div>

      {/* 5. Narrative Certificate Card */}
      <div className="p-4 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex items-center gap-3.5 shadow-md">
        <div className="w-12 h-12 rounded-full bg-[#ffb870]/10 border border-[#ffb870]/30 flex items-center justify-center flex-shrink-0 text-[#ffb870]">
          <span className="material-symbols-outlined text-[26px]">military_tech</span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] text-[#8f9098] uppercase tracking-wider">Kıdem Seviyesi</span>
          <span className="font-body text-[15px] text-[#e8e2d8] font-semibold">
            {currentEnding.rankTitle}
          </span>
          <span className="font-body text-[12px] text-[#c5c6ce]">
            {currentEnding.rankDesc}
          </span>
        </div>
      </div>

      {/* 6. Primary Action Triggers */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Replay Button */}
        <button
          type="button"
          onClick={onRestart}
          data-testid="restart-game"
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#ffb870] hover:bg-[#ffdcbe] text-[#2c1600] font-body text-[15px] font-bold tracking-wide shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">replay</span>
          <span>Tekrar Oyna (Farklı Senaryoları Keşfet)</span>
        </button>

        {/* Export Post-Mortem */}
        <button
          type="button"
          onClick={handleExportPostMortem}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-[#2c2a24] hover:bg-[#37352e] text-[#e8e2d8] border border-[#37352e] font-body text-[14px] font-medium shadow-md active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px]">file_download</span>
          <span>{copiedToast ? 'Rapor Kopyalandı ✓' : 'Post-Mortem Raporunu Paylaş / Dışa Aktar'}</span>
        </button>
      </div>

      {/* Editorial Sub-Footer */}
      <div className="flex flex-col items-center justify-center text-center pt-2 pb-1 gap-1">
        <span className="font-mono text-[11px] text-[#8f9098] font-medium">
          SE Primer: 08:00 Kritik Karar • Yazılım Mühendisliği Simülasyonu
        </span>
        <span className="font-mono text-[10px] text-[#45474d]">
          SIM_ID: MED-PROD-2024-0800 • v1.4.2
        </span>
      </div>
    </div>
  );
};
