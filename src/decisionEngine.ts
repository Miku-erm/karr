import { ChoiceId, DecisionId, EndingId } from './types';

export interface FinalizedChoices {
  architecture?: ChoiceId;
  testing?: ChoiceId;
  privacy?: ChoiceId;
}

/**
 * Pure deterministic ending calculation function.
 * Evaluates choices strictly according to spec.md and decision-tree.json:
 *
 * Priority 1: privacy = 'B' -> ENDING_PRIVACY_INCIDENT
 * Priority 2: testing = 'B' -> ENDING_RECURRING_OUTAGE
 * Priority 3: architecture = 'B' -> ENDING_FRAGILE
 * Priority 4: A-A-A -> ENDING_SAFE
 */
export function calculateEnding(choices: FinalizedChoices): EndingId {
  if (!choices.architecture || !choices.testing || !choices.privacy) {
    throw new Error('Eksik karar: Tüm 3 karar tamamlanmadan son hesaplanamaz.');
  }

  // Priority 1: Privacy incident (Any path where privacy is B: AAB, ABB, BAB, BBB)
  if (choices.privacy === 'B') {
    return 'ENDING_PRIVACY_INCIDENT';
  }

  // Priority 2: Recurring outage (Any path where privacy is A and testing is B: ABA, BBA)
  if (choices.testing === 'B') {
    return 'ENDING_RECURRING_OUTAGE';
  }

  // Priority 3: Fragile recovery (architecture is B, testing is A, privacy is A: BAA)
  if (choices.architecture === 'B') {
    return 'ENDING_FRAGILE';
  }

  // Priority 4: Safe recovery (AAA)
  return 'ENDING_SAFE';
}

export const COMBINATIONS_MATRIX: Array<{
  path: string;
  choices: Record<DecisionId, ChoiceId>;
  expectedEnding: EndingId;
  title: string;
}> = [
  {
    path: 'AAA',
    choices: { architecture: 'A', testing: 'A', privacy: 'A' },
    expectedEnding: 'ENDING_SAFE',
    title: 'Güvenli Kurtarma',
  },
  {
    path: 'AAB',
    choices: { architecture: 'A', testing: 'A', privacy: 'B' },
    expectedEnding: 'ENDING_PRIVACY_INCIDENT',
    title: 'Gizlilik Olayı',
  },
  {
    path: 'ABA',
    choices: { architecture: 'A', testing: 'B', privacy: 'A' },
    expectedEnding: 'ENDING_RECURRING_OUTAGE',
    title: 'Kesinti Geri Döndü',
  },
  {
    path: 'ABB',
    choices: { architecture: 'A', testing: 'B', privacy: 'B' },
    expectedEnding: 'ENDING_PRIVACY_INCIDENT',
    title: 'Gizlilik Olayı (Kesinti ile Birlikte)',
  },
  {
    path: 'BAA',
    choices: { architecture: 'B', testing: 'A', privacy: 'A' },
    expectedEnding: 'ENDING_FRAGILE',
    title: 'Kırılgan Kurtarma',
  },
  {
    path: 'BAB',
    choices: { architecture: 'B', testing: 'A', privacy: 'B' },
    expectedEnding: 'ENDING_PRIVACY_INCIDENT',
    title: 'Gizlilik Olayı',
  },
  {
    path: 'BBA',
    choices: { architecture: 'B', testing: 'B', privacy: 'A' },
    expectedEnding: 'ENDING_RECURRING_OUTAGE',
    title: 'Kesinti Geri Döndü',
  },
  {
    path: 'BBB',
    choices: { architecture: 'B', testing: 'B', privacy: 'B' },
    expectedEnding: 'ENDING_PRIVACY_INCIDENT',
    title: 'Gizlilik Olayı (Kırılgan & Kesinti ile Birlikte)',
  },
];
