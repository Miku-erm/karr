import React from 'react';
export function DifficultyFeedback({ onAnswer, error }: { onAnswer: (label: 0 | 1, trusted: boolean) => void; error: string }) {
  const answerByKey = (label: 0 | 1, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onAnswer(label, event.isTrusted); }
  };
  return <section data-testid="difficulty-feedback" aria-labelledby="difficulty-title" className="rounded-xl p-5 bg-[#002220] border border-[#89d4cd]/40 space-y-4">
    <p className="text-xs text-[#89d4cd]">Yalnızca Veri Toplama Modu · Kararın kesinleşti</p>
    <h2 id="difficulty-title" className="font-headline text-2xl">Bu kararı verirken belirgin biçimde zorlandın mı?</h2>
    <p className="text-sm leading-relaxed">Kendi deneyimine göre yanıtla. Bu öz bildirimdir; doğru/yanlış cevap veya psikolojik tanı değildir. Teknik sonuç, yanıtından sonra gösterilecek. Yanıtın kararını ve hikâyenin sonunu değiştirmez.</p>
    <button data-testid="difficulty-yes" type="button" onClick={e => onAnswer(1, e.isTrusted)} onKeyDown={e => answerByKey(1, e)} className="w-full min-h-12 rounded-lg bg-[#89d4cd] text-[#003734] px-4 font-semibold">Evet, zorlandım</button>
    <button data-testid="difficulty-no" type="button" onClick={e => onAnswer(0, e.isTrusted)} onKeyDown={e => answerByKey(0, e)} className="w-full min-h-12 rounded-lg border border-[#89d4cd]/50 px-4 font-semibold">Hayır, zorlanmadım</button>
    {error && <p role="alert" data-testid="feedback-storage-error" className="text-sm text-[#ffb4ab]">{error}</p>}
  </section>;
}
