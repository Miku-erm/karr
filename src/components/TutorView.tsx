import React, { useState } from 'react';
import { DecisionId, TutorMessage, UserProfile } from '../types';

interface TutorViewProps {
  messages: TutorMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  currentDecisionId: DecisionId;
  userProfile: UserProfile;
}

export const TutorView: React.FC<TutorViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  currentDecisionId,
  userProfile,
}) => {
  const [inputVal, setInputVal] = useState('');

  const quickPrompts: Record<DecisionId, string[]> = {
    architecture: [
      'Geriye dönük şema uyumluluğu nasıl test edilir?',
      'Canlıda indeks silmek ne tür bir kilitlenmeye yol açar?',
      'Expand / Contract kalıbı nedir?',
    ],
    testing: [
      'Smoke testi ile entegrasyon testi arasındaki fark nedir?',
      'Neden birkaç başarılı istek tam toparlanmayı kanıtlamaz?',
      'Yük testi olmadan trafiği açmanın riskleri nelerdir?',
    ],
    privacy: [
      'Log paylaşırken hangi alanlar maskelenmelidir?',
      'KVKK kapsamında veri minimizasyonu ne anlama gelir?',
      'Genel Slack kanalına log atmanın yasal sorumluluğu nedir?',
    ],
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-140px)] max-h-[720px] pb-6">
      {/* Tutor Top Banner */}
      <div className="p-4 rounded-xl bg-[#002220] border border-[#89d4cd]/30 text-[#89d4cd] mb-3 flex flex-col gap-1 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          <h2 className="font-headline text-[17px] font-semibold">
            AI Mühendislik Danışmanı (Sokratik Koç)
          </h2>
        </div>
        <p className="font-body text-[12px] text-[#89d4cd]/90 leading-relaxed">
          Kurallar: Danışman doğrudan cevabı söylemez. Senin mimari ödünleşimleri, kanıtları ve riskleri düşünmen için yönlendirici Sokratik sorular sorar.
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 font-body text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'student' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="font-mono text-[10px] text-[#8f9098]">
                {msg.sender === 'student' ? 'Sen' : 'Sokratik Danışman'}
              </span>
              <span className="font-mono text-[9px] text-[#45474d]">{msg.timestamp}</span>
            </div>
            <div
              className={`p-3 rounded-xl leading-relaxed ${
                msg.sender === 'student'
                  ? 'bg-[#a35f02]/30 text-[#ffb870] border border-[#ffb870]/40 rounded-br-xs'
                  : 'bg-[#211f19] text-[#e8e2d8] border border-[#2c2a24] rounded-bl-xs'
              }`}
            >
              <p className="text-[13px]">{msg.text}</p>
              {msg.isFallback && (
                <span className="block mt-1.5 text-[10px] font-mono text-[#89d4cd]/80 italic">
                  (Yerel Sokratik Rehberlik)
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-[#89d4cd] p-3 rounded-xl bg-[#211f19] border border-[#2c2a24] w-fit">
            <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            <span className="font-mono text-xs">Danışman analiz ediyor...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 -mx-1 px-1">
        {quickPrompts[currentDecisionId]?.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(prompt)}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg bg-[#1d1b16] border border-[#2c2a24] hover:border-[#ffb870]/40 text-[#c5c6ce] hover:text-[#e8e2d8] font-mono text-[11px] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            💬 {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#1d1b16] border border-[#2c2a24] rounded-xl p-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Mühendislik sorunu sor..."
          className="bg-transparent text-[#e8e2d8] placeholder:text-[#8f9098] font-body text-[13px] flex-1 px-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="w-8 h-8 rounded-lg bg-[#89d4cd] hover:bg-[#a5f0e9] text-[#003734] flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
};
