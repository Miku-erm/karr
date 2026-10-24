import { DecisionDefinition, EndingDefinition, EndingId, UserProfile } from './types';
import story from '../story/decision-tree.json';

export const STORY_OPENING = { ...story.opening, title: story.title, subtitle: story.subtitle, leadText: story.opening.text };
export const DECISIONS = Object.fromEntries(story.decisions.map((decision, i) => [decision.id, {
  ...decision,
  timeLabel: ['08:00', '08:15', '08:30'][i],
  nextTimeLabel: ['08:15', '08:30', '08:42'][i],
  headline: ['Nöbet Odası Acil Hattı', 'Trafiğe Dönüş', 'Kurgusal Log Paylaşımı'][i],
  subheadline: ['Pazartesi 08:00. Yaklaşık 300 kurgusal kişi randevu hizmetini bekliyor.', 'Toparlanma işaretleri hangi kanıtlarla doğrulanmalı?', 'Teknik inceleme için gerekli veri ve erişimi düşün.'][i],
  choices: Object.fromEntries(decision.choices.map(choice => [choice.id, choice])),
}])) as unknown as Record<'architecture' | 'testing' | 'privacy', DecisionDefinition>;

export const ENDINGS = Object.fromEntries(story.endings.map(ending => [ending.id, {
  ...ending, badgeTitle: ending.title, epilogue: 'Epilog · 08:42',
}])) as unknown as Record<EndingId, EndingDefinition>;

export function getPersonalizedFeedback(profile: UserProfile, decisionId: 'architecture' | 'testing' | 'privacy') {
  const roles = {
    developer: 'Geliştirici Gözü: Kod/şema bağımlılığı, hata izi ve değişiklik kapsamını gözden geçir.',
    tester: 'Test Mühendisi Gözü: Kritik akışın kanıtını ve test kapsamının sınırlarını gözden geçir.',
    lead: 'Teknik Lider Gözü: Koordinasyonu, erişim sorumluluğunu ve kararın ekibe gerekçesini düşün.',
  };
  const goals = {
    architecture: 'Mimari Odağın: Kod sürümü ve mevcut veri yapısı uyumlu olmadan geri dönüş güvenli varsayılamaz.',
    testing: 'Test Odağın: Hedefli doğrulama kritik akışa kanıt sağlar; test atlanırsa bu kanıt eksik kalır. Testler tüm hataları dışlamaz.',
    privacy: 'Veri Koruma Odağın: Teknik inceleme için gerekli alanları ve erişebilecek kişileri birlikte sınırla; maskeleme tam anonimlik garantisi değildir.',
  };
  const levels = {
    beginner: 'Yeni Başlayan Notu: Kararını destekleyen gözlemi düşün. Her kararın ardından nedenini birlikte inceleyeceğiz.',
    intermediate: 'Orta Seviye Notu: Kararını destekleyen teknik kanıtı ve doğrulama sınırını düşün.',
    experienced: 'Deneyimli Notu: Etki alanı, kanıtın kapsamı ve kurtarma maliyeti arasındaki ödünleşimi tart.',
  };
  return { rolePerspective: roles[profile.role], goalEmphasis: profile.goal === decisionId ? goals[profile.goal] : undefined, experienceNote: levels[profile.experience] };
}
