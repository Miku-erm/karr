import React, { useState } from 'react';
import { ExperienceLevel, LearningGoal, Role, UserProfile } from '../types';

interface OnboardingScreenProps {
  onStart: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onStart,
  initialProfile,
}) => {
  const [experience, setExperience] = useState<ExperienceLevel>(
    initialProfile?.experience || 'intermediate'
  );
  const [role, setRole] = useState<Role>(initialProfile?.role || 'developer');
  const [goal, setGoal] = useState<LearningGoal>(initialProfile?.goal || 'privacy');
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStart({ experience, role, goal });
    }, 450);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Minimalist Emergency Status Badge */}
      <div className="flex items-center justify-between bg-[#101d35]/90 border border-[#ffb870]/20 rounded-xl px-4 py-2.5 mb-4 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb870] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffb870]"></span>
          </span>
          <span className="font-mono text-[11px] tracking-wider uppercase text-[#ffb870] font-semibold">
            PAZARTESİ 08:00 • KRİTİK SEVİYE 1 INCIDENT
          </span>
        </div>
        <span className="material-symbols-outlined text-[#ffb870] text-[18px]">crisis_alert</span>
      </div>

      {/* Narrative Header Box with Ambient Sci-Fi Glow */}
      <div className="relative overflow-hidden bg-[#101d35] border border-[#2c2a24] rounded-xl p-5 mb-5 shadow-xl">
        {/* Ambient Gradient Halos */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ffb870]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#89d4cd]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-1.5 text-[#89d4cd]">
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span className="font-mono text-[12px] tracking-wider uppercase text-[#89d4cd]">
              SE Primer • İnteraktif Kurgu
            </span>
          </div>
          <h1 className="font-headline text-[30px] font-semibold text-[#e8e2d8] tracking-tight mt-1 leading-tight">
            08:00 — Kritik Karar
          </h1>
          <p className="font-body text-[15px] text-[#c5c6ce] italic">
            Yazılım Mühendisliği, Oynanan Bir Kitap
          </p>
        </div>

        {/* Cinematic Narrative Lead */}
        <div className="relative z-10 bg-[#2c2a24]/90 border border-[#37352e] rounded-lg p-3.5 mb-4 shadow-sm">
          <p className="font-body text-[15px] text-[#e8e2d8] leading-relaxed">
            Saat tam 08.00. Hastanenin merkezi randevu sistemi gece yarısı yapılan sürüm dağıtımı sonrası tamamen çöktü. Bekleme salonunda{' '}
            <strong className="text-[#ffb870] font-semibold">300 hasta</strong> ve poliklinik doktorları sisteme erişemiyor. Nöbetçi mühendis sensin. Alacağın her karar sistem mimarisini, veri güvenliğini ve hastaların hayatını doğrudan etkileyecek.
          </p>
        </div>

        {/* Stylized Telemetry / Dawn Hospital Infrastructure Visual Accent */}
        <div className="relative z-10 w-full bg-[#100e09]/80 border border-[#211f19] rounded-lg overflow-hidden p-3 flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between text-[#c5c6ce] font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb870] text-[14px]">dns</span>
              <span>POLIKLINIK-GATEWAY-TR01</span>
            </div>
            <span className="text-[#ffb4ab] font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffb4ab] animate-pulse"></span>
              OUTAGE 504
            </span>
          </div>

          {/* Sparkline Waveform */}
          <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 32">
            <defs>
              <linearGradient id="telemetryGrad" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#bac6e6" stopOpacity="0.3"></stop>
                <stop offset="60%" stopColor="#ffb870" stopOpacity="0.8"></stop>
                <stop offset="90%" stopColor="#ffb4ab" stopOpacity="1"></stop>
              </linearGradient>
            </defs>
            <path
              d="M0,16 L40,16 L55,10 L70,22 L85,16 L140,16 L150,4 L165,28 L178,16 L220,16 L230,2 L245,30 L255,16 L280,16 L290,6 L305,26 L320,16"
              fill="none"
              stroke="url(#telemetryGrad)"
              strokeLinecap="round"
              strokeWidth="2"
            ></path>
          </svg>

          <div className="flex items-center justify-between text-[#c5c6ce] font-mono text-[11px]">
            <span>Gecikme: <span className="text-[#ffb4ab] font-medium">14.820ms</span></span>
            <span>Kuyruk: <span className="text-[#ffb870] font-medium">4.218 Msg</span></span>
            <span>Sağlık: <span className="text-[#ffb4ab] font-medium">12%</span></span>
          </div>
        </div>
      </div>

      {/* Interactive Profile Configuration Segment (3 questions) */}
      <div className="flex flex-col gap-4 mb-5">
        {/* 1. Deneyim Seviyen */}
        <fieldset className="flex flex-col gap-1.5" data-testid="experience-selector">
          <legend className="font-mono text-[12px] text-[#e8e2d8] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[#ffb870] text-[16px]">stairs</span>
            Deneyim Seviyen
          </legend>
          <div className="grid grid-cols-3 gap-1.5 bg-[#100e09] p-1 rounded-xl border border-[#211f19]">
            <button
              type="button"
              onClick={() => setExperience('beginner')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                experience === 'beginner'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Yeni Başlayan
            </button>
            <button
              type="button"
              onClick={() => setExperience('intermediate')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                experience === 'intermediate'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Orta Seviye
            </button>
            <button
              type="button"
              onClick={() => setExperience('experienced')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                experience === 'experienced'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Deneyimli
            </button>
          </div>
        </fieldset>

        {/* 2. Rolün */}
        <fieldset className="flex flex-col gap-1.5" data-testid="role-selector">
          <legend className="font-mono text-[12px] text-[#e8e2d8] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[#ffb870] text-[16px]">badge</span>
            Rolün
          </legend>
          <div className="grid grid-cols-3 gap-1.5 bg-[#100e09] p-1 rounded-xl border border-[#211f19]">
            <button
              type="button"
              onClick={() => setRole('developer')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                role === 'developer'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Yazılım Geliştirici
            </button>
            <button
              type="button"
              onClick={() => setRole('tester')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                role === 'tester'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Test Mühendisi
            </button>
            <button
              type="button"
              onClick={() => setRole('lead')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                role === 'lead'
                  ? 'bg-[#ffb870] text-[#2c1600] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Teknik Lider
            </button>
          </div>
        </fieldset>

        {/* 3. Öğrenme Hedefin */}
        <fieldset className="flex flex-col gap-1.5" data-testid="goal-selector">
          <legend className="font-mono text-[12px] text-[#e8e2d8] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[#89d4cd] text-[16px]">psychology</span>
            Öğrenme Hedefin
          </legend>
          <div className="grid grid-cols-3 gap-1.5 bg-[#100e09] p-1 rounded-xl border border-[#211f19]">
            <button
              type="button"
              onClick={() => setGoal('architecture')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                goal === 'architecture'
                  ? 'bg-[#89d4cd] text-[#003734] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Mimari
            </button>
            <button
              type="button"
              onClick={() => setGoal('testing')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                goal === 'testing'
                  ? 'bg-[#89d4cd] text-[#003734] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Test & Kalite
            </button>
            <button
              type="button"
              onClick={() => setGoal('privacy')}
              className={`min-h-[46px] flex items-center justify-center text-center rounded-lg px-2 py-2 font-mono text-[12px] transition-all ${
                goal === 'privacy'
                  ? 'bg-[#89d4cd] text-[#003734] font-bold shadow-md'
                  : 'text-[#c5c6ce] hover:text-[#e8e2d8]'
              }`}
            >
              Güvenlik & KVKK
            </button>
          </div>
        </fieldset>
      </div>

      {/* Narrative Context & Friction Footnotes */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between bg-[#211f19] border border-[#2c2a24] rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb870] text-[18px]">account_tree</span>
            <span className="font-mono text-[11px] text-[#e8e2d8]">3 Kritik Karar</span>
          </div>
          <div className="h-3 w-px bg-[#37352e]"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb870] text-[18px]">timer</span>
            <span className="font-mono text-[11px] text-[#e8e2d8]">15 Dk Simülasyon</span>
          </div>
          <div className="h-3 w-px bg-[#37352e]"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb870] text-[18px]">alt_route</span>
            <span className="font-mono text-[11px] text-[#e8e2d8]">Dallanan Hikâye</span>
          </div>
        </div>

        {/* Frictionless Assurance Box */}
        <div className="flex items-start gap-3 bg-[#1d1b16] border border-[#2c2a24] rounded-xl p-3.5">
          <span className="material-symbols-outlined text-[#89d4cd] text-[20px] shrink-0 mt-0.5">verified_user</span>
          <div className="flex flex-col">
            <span className="font-body text-xs font-semibold text-[#e8e2d8]">Ön Hazırlık Gerekmez</span>
            <span className="font-body text-xs text-[#c5c6ce] leading-relaxed">
              Sıfır oturum açma, reklamsız ve doğrudan canlı sistem vaka müdahalesi.
            </span>
          </div>
        </div>
      </div>

      {/* Primary Consequential CTA */}
      <div className="flex flex-col gap-1.5 mt-auto">
        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          data-testid="start-game"
          className="w-full min-h-[54px] bg-[#ffb870] hover:bg-[#ffdcbe] active:scale-[0.98] transition-all text-[#4a2800] rounded-xl font-body text-base font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-[#ffb870]/20 disabled:opacity-75 cursor-pointer"
        >
          {isStarting ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              <span>Sistem Yükleniyor...</span>
            </>
          ) : (
            <>
              <span>HİKÂYEYE BAŞLA</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
        <p className="text-center font-mono text-[11px] text-[#8f9098] mt-1">
          Simülasyon başlatıldığında kararlar geri alınamaz.
        </p>
      </div>
    </div>
  );
};
