import React, { useState } from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  timeLabel?: string;
  stepLabel?: string;
  userProfile?: UserProfile;
  onRestart?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeLabel = '08:00',
  stepLabel = 'Acil Durum / Vaka Modu',
  userProfile,
  onRestart,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const roleLabels: Record<string, string> = {
    developer: 'Yazılım Geliştirici',
    tester: 'Test Mühendisi',
    lead: 'Teknik Ekip Lideri',
  };

  const expLabels: Record<string, string> = {
    beginner: 'Yeni Başlayan',
    intermediate: 'Orta Seviye',
    experienced: 'Deneyimli',
  };

  const goalLabels: Record<string, string> = {
    architecture: 'Mimari',
    testing: 'Test & Kalite',
    privacy: 'Güvenlik & KVKK',
  };

  return (
    <>
      <header className="fixed top-0 w-full max-w-[480px] z-50 bg-[#15130e]/90 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(0,0,0,0.45)] border-b border-[#2c2a24]">
        <div className="h-16 px-4 flex items-center justify-between">
          {/* Left: Time and Title */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#a35f02]/20 border border-[#ffb870]/30">
              <span className="w-2 h-2 rounded-full bg-[#ffb870] animate-pulse"></span>
              <span className="font-mono text-[11px] font-semibold text-[#ffb870] tracking-wider">
                {timeLabel}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[18px] tracking-tight text-[#e8e2d8] leading-tight font-medium">
                08:00 — KRİTİK KARAR
              </span>
              <div className="flex items-center gap-1 text-[#c5c6ce]">
                <span className="material-symbols-outlined text-[13px] text-[#ffb870]">warning</span>
                <span className="font-mono text-[10px] text-[#ffb870] uppercase tracking-wider">
                  {stepLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Profile Avatar Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowProfileModal(true)}
              aria-label="Kullanıcı Profili ve Rolü"
              className="w-8 h-8 rounded-full bg-[#101d35] border border-[#89d4cd]/30 flex items-center justify-center text-[#89d4cd] hover:scale-105 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile info modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-[#211f19] border border-[#37352e] p-5 shadow-2xl flex flex-col gap-4 text-[#e8e2d8]">
            <div className="flex items-center justify-between border-b border-[#37352e] pb-3">
              <div className="flex items-center gap-2 text-[#89d4cd]">
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <h3 className="font-headline text-lg font-medium">Mühendis Profil Kartı</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="w-7 h-7 rounded-lg bg-[#2c2a24] text-[#c5c6ce] hover:text-[#e8e2d8] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {userProfile ? (
              <div className="flex flex-col gap-3 font-body text-sm">
                <div className="flex justify-between items-center py-1.5 border-b border-[#2c2a24]">
                  <span className="text-[#c5c6ce] text-xs font-mono">DENEYİM SEVİYESİ</span>
                  <span className="font-semibold text-[#ffb870]">
                    {expLabels[userProfile.experience] || userProfile.experience}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#2c2a24]">
                  <span className="text-[#c5c6ce] text-xs font-mono">GÖREV / ROL</span>
                  <span className="font-semibold text-[#e8e2d8]">
                    {roleLabels[userProfile.role] || userProfile.role}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#2c2a24]">
                  <span className="text-[#c5c6ce] text-xs font-mono">ÖĞRENME HEDEFİ</span>
                  <span className="font-semibold text-[#89d4cd]">
                    {goalLabels[userProfile.goal] || userProfile.goal}
                  </span>
                </div>
                <p className="text-xs text-[#c5c6ce] leading-relaxed pt-1">
                  Bu profil, AI Danışmanı sorularını ve teknik sonuç analizlerini bakış açına göre kişiselleştirir.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#c5c6ce]">Onboarding henüz tamamlanmadı.</p>
            )}

            {onRestart && (
              <button
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                  onRestart();
                }}
                className="mt-2 w-full py-2.5 rounded-lg bg-[#37352e] hover:bg-[#a35f02]/30 text-[#ffb870] font-mono text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#ffb870]/30 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">replay</span>
                <span>Simülasyonu Sıfırla ve Başa Dön</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
