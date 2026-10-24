export type ExperienceLevel = 'beginner' | 'intermediate' | 'experienced';
export type Role = 'developer' | 'tester' | 'lead';
export type LearningGoal = 'architecture' | 'testing' | 'privacy';

export interface UserProfile {
  experience: ExperienceLevel;
  role: Role;
  goal: LearningGoal;
}

export type DecisionId = 'architecture' | 'testing' | 'privacy';
export type ChoiceId = 'A' | 'B';

export type EndingId =
  | 'ENDING_SAFE'
  | 'ENDING_FRAGILE'
  | 'ENDING_RECURRING_OUTAGE'
  | 'ENDING_PRIVACY_INCIDENT';

export interface Consequence {
  id: string;
  title: string;
  immediate: string;
  cause: string;
  caveat: string;
  technicalEffect: string;
  summary: string;
}

export interface ChoiceDefinition {
  id: ChoiceId;
  label: string;
  shortDesc?: string;
  consequence: Consequence;
  tradeoffs?: {
    positive: string;
    risk: string;
  };
  impactAnalysis?: string;
}

export interface DecisionDefinition {
  id: DecisionId;
  order: number;
  progress: string;
  timeLabel: string;
  nextTimeLabel: string;
  title: string;
  headline: string;
  subheadline: string;
  scene: string;
  technicalErrorBadge?: string;
  learningObjectives: string[];
  localTutorQuestion: string;
  beginnerHint: string;
  choices: {
    A: ChoiceDefinition;
    B: ChoiceDefinition;
  };
}

export interface EndingDefinition {
  id: EndingId;
  badgeTitle: string;
  title: string;
  epilogue: string;
  summary: string;
  reflection: string;
  followUp: string;
  doesNotImply?: string;
  metrics: {
    dbLock: string;
    dbLockSub: string;
    queue: string;
    queueSub: string;
    patientLoss: string;
    patientLossSub: string;
  };
  rankTitle: string;
  rankDesc: string;
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  decisionId: DecisionId;
  hintLevel?: number;
  isFallback?: boolean;
  timestamp: string;
}

export type GameScreen = 'ONBOARDING' | 'DECISION' | 'CONSEQUENCE' | 'ENDING';
export type ActiveTab = 'vaka' | 'telemetri' | 'tutor' | 'debrief';
