import React, { useState, useEffect } from 'react';
import {
  ChoiceId,
  DecisionDefinition,
  GameScreen,
  UserProfile,
} from '../types';
import { getPersonalizedFeedback } from '../storyData';

interface ChapterScreenProps {
  decision: DecisionDefinition;
  screenState: GameScreen;
  userProfile: UserProfile;
  selectedChoice: ChoiceId | null;
  onSelectChoice: (choice: ChoiceId) => void;
  onFinalizeChoice: () => void;
  onContinue: () => void;
  tutorQuestion: string;
  isTutorLoading: boolean;
  onAskTutor: (query: string) => void;
  isLastDecision: boolean;
}

export const ChapterScreen: React.FC<ChapterScreenProps> = ({
  decision,
  screenState,
  userProfile,
  selectedChoice,
  onSelectChoice,
  onFinalizeChoice,
  onContinue,
  tutorQuestion,
  isTutorLoading,
  onAskTutor,
  isLastDecision,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  // Reset hint when decision changes
  useEffect(() => {
    setShowHint(false);
    setUserQuery('');
  }, [decision.id]);

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || isTutorLoading) return;
    onAskTutor(userQuery.trim());
    setUserQuery('');
  };

  const choiceA = decision.choices.A;
  const choiceB = decision.choices.B;
  const activeChoice = selectedChoice ? decision.choices[selectedChoice] : null;

  const personalized = getPersonalizedFeedback(userProfile, decision.id);

  return (
    <div className="flex flex-col w-full pb-8 space-y-4">
      {/* 1. Telemetry Bar & Context Badge */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-[#ffb870] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb870]"></span>
            Bölüm 1 — Sistem Çöktü
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#2c2a24] text-[#e8e2d8] border border-[#37352e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb870] animate-pulse"></span>
            <span className="font-mono text-[11px] font-medium">{decision.timeLabel}</span>
            <span className="text-[#8f9098] text-[10px]">•</span>
            <span className="font-mono text-[11px] text-[#c5c6ce]">{decision.progress}</span>
          </div>
        </div>

        {/* Live Telemetry Status Grid */}
        <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-[#1d1b16] border border-[#2c2a24] shadow-sm">
          <div className="flex flex-col items-center justify-center p-1.5 rounded bg-[#211f19] text-center">
            <span className="font-mono text-[11px] text-[#ffb4ab] font-medium">%98.4 Hata</span>
            <span className="text-[10px] font-mono text-[#c5c6ce]">HTTP 500</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded bg-[#211f19] text-center">
            <span className="font-mono text-[11px] text-[#ffb870] font-medium">312 İstek/s</span>
            <span className="text-[10px] font-mono text-[#c5c6ce]">Kuyruk Baskısı</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 rounded bg-[#211f19] text-center">
            <span className="font-mono text-[11px] text-[#ffb4ab] font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">lock</span> Kilitli
            </span>
            <span className="text-[10px] font-mono text-[#c5c6ce]">DB Havuzu</span>
          </div>
        </div>
      </section>

      {/* 2. Narrative Card */}
      <article className="p-4 rounded-xl bg-[#211f19] border border-[#2c2a24] shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[#c5c6ce]">
          <span className="material-symbols-outlined text-[#ffb870] text-[20px]">notifications_active</span>
          <span className="font-mono text-[11px] uppercase tracking-wide text-[#ffb870] font-semibold">
            {decision.headline}
          </span>
        </div>
        <p className="font-headline text-[22px] font-medium text-[#e8e2d8] leading-snug">
          {decision.subheadline}
        </p>
        <div className="font-body text-[15px] text-[#c5c6ce] space-y-2 leading-relaxed">
          <p>{decision.scene}</p>
          {decision.technicalErrorBadge && (
            <div className="p-2.5 rounded bg-[#100e09] font-mono text-[11px] text-[#ffb4ab] border border-[#ffb4ab]/20 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">crisis_alert</span>
              <span>{decision.technicalErrorBadge}</span>
            </div>
          )}
        </div>
      </article>

      {/* 3. Decision Section (When in DECISION mode) */}
      {screenState === 'DECISION' && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-3.5 bg-[#ffb870] rounded-full"></span>
            <h2 className="font-body text-[14px] font-semibold text-[#e8e2d8]">
              {decision.title}
            </h2>
          </div>

          {/* Option A */}
          <div
            onClick={() => onSelectChoice('A')}
            data-testid="decision-a"
            className={`p-4 rounded-xl transition-all cursor-pointer relative border ${
              selectedChoice === 'A'
                ? 'bg-[#2c2a24] border-[#ffb870] shadow-[0_0_20px_rgba(245,163,74,0.18)]'
                : 'bg-[#211f19] border-[#2c2a24] opacity-90 hover:opacity-100 hover:border-[#37352e]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[12px] font-bold shrink-0 ${
                  selectedChoice === 'A'
                    ? 'bg-[#ffb870] text-[#2c1600] shadow-sm'
                    : 'bg-[#37352e] text-[#e8e2d8]'
                }`}
              >
                A
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-body text-[16px] font-semibold text-[#e8e2d8] leading-snug">
                    {choiceA.label}
                  </h3>
                  {selectedChoice === 'A' && (
                    <span className="flex items-center text-[#ffb870]">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </span>
                  )}
                </div>
                <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
                  {choiceA.shortDesc}
                </p>
                {choiceA.tradeoffs && (
                  <div className="flex items-center gap-1.5 pt-1 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px] text-[#89d4cd]">check</span>
                    <span className="text-[#89d4cd] font-medium">{choiceA.tradeoffs.positive}</span>
                    <span className="text-[#8f9098] text-[10px]">•</span>
                    <span className="material-symbols-outlined text-[14px] text-[#ffb870]">priority_high</span>
                    <span className="text-[#ffb870] font-medium">{choiceA.tradeoffs.risk}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Architectural Consequence Drawer if selected */}
            {selectedChoice === 'A' && choiceA.impactAnalysis && (
              <div className="mt-3.5 p-3 rounded-lg bg-[#100e09] border border-[#2c2a24] flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#ffb870]">
                  <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                  <span className="font-mono text-[11px] font-semibold uppercase">Mimari Etki Analizi</span>
                </div>
                <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
                  {choiceA.impactAnalysis}
                </p>
              </div>
            )}
          </div>

          {/* Option B */}
          <div
            onClick={() => onSelectChoice('B')}
            data-testid="decision-b"
            className={`p-4 rounded-xl transition-all cursor-pointer relative border ${
              selectedChoice === 'B'
                ? 'bg-[#2c2a24] border-[#ffb870] shadow-[0_0_20px_rgba(245,163,74,0.18)]'
                : 'bg-[#211f19] border-[#2c2a24] opacity-90 hover:opacity-100 hover:border-[#37352e]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[12px] font-bold shrink-0 ${
                  selectedChoice === 'B'
                    ? 'bg-[#ffb870] text-[#2c1600] shadow-sm'
                    : 'bg-[#37352e] text-[#e8e2d8]'
                }`}
              >
                B
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-body text-[16px] font-semibold text-[#e8e2d8] leading-snug">
                    {choiceB.label}
                  </h3>
                  {selectedChoice === 'B' && (
                    <span className="flex items-center text-[#ffb870]">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    </span>
                  )}
                </div>
                <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
                  {choiceB.shortDesc}
                </p>
                {choiceB.tradeoffs && (
                  <div className="flex items-center gap-1.5 pt-1 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">warning</span>
                    <span className="text-[#ffb4ab] font-medium">{choiceB.tradeoffs.positive}</span>
                    <span className="text-[#8f9098] text-[10px]">•</span>
                    <span className="text-[#c5c6ce] font-medium">{choiceB.tradeoffs.risk}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Architectural Consequence Drawer if selected */}
            {selectedChoice === 'B' && choiceB.impactAnalysis && (
              <div className="mt-3.5 p-3 rounded-lg bg-[#100e09] border border-[#2c2a24] flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[#ffb4ab]">
                  <span className="material-symbols-outlined text-[16px]">report</span>
                  <span className="font-mono text-[11px] font-semibold uppercase">Kritik Risk</span>
                </div>
                <p className="font-body text-[13px] text-[#c5c6ce] leading-relaxed">
                  {choiceB.impactAnalysis}
                </p>
              </div>
            )}
          </div>

          {/* AI Tutor Compact Section (Muted Teal Aesthetic) */}
          <section className="rounded-xl bg-[#002220] border border-[#89d4cd]/20 text-[#89d4cd] p-3.5 flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#89d4cd] text-[18px]">smart_toy</span>
                <span className="font-mono text-[11px] font-semibold text-[#89d4cd] tracking-wide uppercase">
                  AI Mühendislik Danışmanı
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                data-testid="concept-hint-btn"
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#2c2a24] text-[#89d4cd] font-mono text-[11px] hover:opacity-90 transition-opacity border border-[#89d4cd]/30"
              >
                <span className="material-symbols-outlined text-[13px]">lightbulb</span>
                <span>{showHint ? 'İpucunu Gizle' : 'İpucu Ver'}</span>
              </button>
            </div>

            {/* Socratic Prompt & Question */}
            <div className="p-2.5 rounded bg-[#100e09]/90 text-[#e8e2d8] border border-[#2c2a24]">
              <p className="font-body text-[13px] leading-relaxed">
                <span className="text-[#89d4cd] font-semibold">Sokratik Soru: </span>
                {isTutorLoading ? (
                  <span className="italic text-[#c5c6ce] animate-pulse">
                    Danışman analiz ediyor...
                  </span>
                ) : (
                  tutorQuestion || decision.localTutorQuestion
                )}
              </p>

              {showHint && (
                <div className="mt-2 pt-2 border-t border-[#2c2a24] text-[#c5c6ce] font-body text-[12px] leading-relaxed">
                  💡 <strong className="text-[#89d4cd]">Mühendislik Tavsiyesi: </strong>
                  {decision.beginnerHint}
                </div>
              )}
            </div>

            {/* Compact Input Bar */}
            <form onSubmit={handleAskSubmit} className="flex items-center gap-2 bg-[#100e09] border border-[#2c2a24] rounded-lg p-1.5">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Tutor'a sor: 'Geriye uyumlu migrasyon adımları...'"
                data-testid="tutor-input"
                className="bg-transparent text-[#e8e2d8] placeholder:text-[#8f9098] font-body text-[13px] flex-1 px-2 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTutorLoading || !userQuery.trim()}
                aria-label="Soruyu Gönder"
                data-testid="ask-tutor"
                className="w-7 h-7 rounded-md bg-[#89d4cd] hover:bg-[#a5f0e9] text-[#003734] flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>
          </section>

          {/* Forward Progress Confirmation Button */}
          <section className="pt-1">
            <button
              type="button"
              disabled={!selectedChoice}
              onClick={onFinalizeChoice}
              data-testid="finalize-decision"
              className={`w-full h-12 rounded-xl font-body text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all cursor-pointer ${
                selectedChoice
                  ? 'bg-[#ffb870] hover:bg-[#ffdcbe] text-[#2c1600]'
                  : 'bg-[#37352e] text-[#8f9098] opacity-60 cursor-not-allowed'
              }`}
            >
              <span>
                {selectedChoice
                  ? `Kararı Onayla ve İlerle (${decision.nextTimeLabel})`
                  : 'Lütfen A veya B Seçeneğini İşaretle'}
              </span>
              <span className="material-symbols-outlined text-[18px]">east</span>
            </button>
          </section>
        </section>
      )}

      {/* 4. Consequence / Feedback State (After Choice Finalized) */}
      {screenState === 'CONSEQUENCE' && activeChoice && (
        <section className="flex flex-col gap-4">
          {/* Confirmed Decision Card */}
          <div className="p-4 rounded-xl bg-[#211f19] border-2 border-[#89d4cd] shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#89d4cd] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Karar Kesinleştirildi ({selectedChoice})
              </span>
              <span className="font-mono text-[11px] text-[#c5c6ce]">{decision.nextTimeLabel}</span>
            </div>

            <h3 className="font-headline text-[20px] font-semibold text-[#e8e2d8]">
              {activeChoice.consequence.title}
            </h3>

            {/* Immediate outcome */}
            <div className="p-3 rounded-lg bg-[#100e09] border border-[#2c2a24] text-[14px] text-[#e8e2d8] leading-relaxed">
              <strong className="text-[#ffb870]">Teknik Sonuç: </strong>
              {activeChoice.consequence.immediate}
            </div>

            {/* Cause & Architectural Rationale */}
            <div className="font-body text-[13px] text-[#c5c6ce] space-y-2">
              <p>
                <strong className="text-[#89d4cd]">Neden: </strong>
                {activeChoice.consequence.cause}
              </p>
              <p className="text-xs text-[#8f9098] italic">
                ⚠️ <strong className="text-[#c5c6ce]">Ödünleşim / Uyarı: </strong>
                {activeChoice.consequence.caveat}
              </p>
            </div>
          </div>

          {/* Personalization Lens Box */}
          <div className="p-3.5 rounded-xl bg-[#1d1b16] border border-[#2c2a24] flex flex-col gap-2 font-body text-xs">
            <div className="flex items-center gap-1.5 text-[#ffb870] font-mono font-semibold">
              <span className="material-symbols-outlined text-[15px]">badge</span>
              <span>Kişiselleştirilmiş Bakış Açısı</span>
            </div>
            <p className="text-[#e8e2d8]">{personalized.rolePerspective}</p>
            {personalized.goalEmphasis && (
              <p className="text-[#89d4cd] pt-1 border-t border-[#2c2a24]">
                {personalized.goalEmphasis}
              </p>
            )}
          </div>

          {/* Continue CTA Button */}
          <section className="pt-2">
            <button
              type="button"
              onClick={onContinue}
              data-testid="continue"
              className="w-full h-12 rounded-xl bg-[#ffb870] hover:bg-[#ffdcbe] text-[#2c1600] font-body text-[15px] font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-transform cursor-pointer"
            >
              <span>{isLastDecision ? 'Sonucu Gör ve Post-Mortem İncele' : 'Sonraki Aşamaya Devam Et'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </section>
        </section>
      )}
    </div>
  );
};
