import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasEnding: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasEnding,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: string; badge?: string }> = [
    { id: 'vaka', label: 'Vaka', icon: 'terminal' },
    { id: 'telemetri', label: 'Telemetri', icon: 'monitoring' },
    { id: 'tutor', label: 'Tutor', icon: 'psychology' },
    { id: 'debrief', label: 'Debrief', icon: 'assignment', badge: hasEnding ? 'Sonuç' : undefined },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full max-w-[480px] z-50 pb-safe bg-[#15130e]/95 backdrop-blur-xl border-t border-[#2c2a24] shadow-[0_-2px_16px_rgba(0,0,0,0.65)]"
      aria-label="Ana Gezinti Çubuğu"
    >
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors relative ${
                isActive ? 'text-[#ffb870]' : 'text-[#8f9098] hover:text-[#c5c6ce]'
              }`}
              data-path={item.id}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-mono text-[11px] font-medium tracking-tight">
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute -top-0.5 right-1 px-1 py-0.2 rounded-full bg-[#89d4cd] text-[#003734] font-mono text-[8px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
