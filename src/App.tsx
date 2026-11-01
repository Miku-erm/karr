/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  ActiveTab,
  ChoiceId,
  DecisionId,
  EndingId,
  GameScreen,
  TutorMessage,
  UserProfile,
} from './types';
import { DECISIONS, ENDINGS } from './storyData';
import { calculateEnding } from './decisionEngine';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ChapterScreen } from './components/ChapterScreen';
import { EndingScreen } from './components/EndingScreen';
import { TelemetryView } from './components/TelemetryView';
import { TutorView } from './components/TutorView';
import { CollectionPanel } from './collection/CollectionPanel';
import { DifficultyFeedback } from './collection/DifficultyFeedback';
import { CollectionSession, Observation } from './collection/contract';
import { deleteSession, isHumanInteraction, saveSession } from './collection/store';

const DECISION_KEYS: DecisionId[] = ['architecture', 'testing', 'privacy'];

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    experience: 'intermediate',
    role: 'developer',
    goal: 'architecture',
  });

  const [gameScreen, setGameScreen] = useState<GameScreen>('ONBOARDING');
  const [activeTab, setActiveTab] = useState<ActiveTab>('vaka');
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState<number>(0);
  const [pendingChoice, setPendingChoice] = useState<ChoiceId | null>(null);
  const [choices, setChoices] = useState<Record<DecisionId, ChoiceId>>({
    architecture: 'A',
    testing: 'A',
    privacy: 'A',
  });
  const [finalizedChoices, setFinalizedChoices] = useState<Partial<Record<DecisionId, ChoiceId>>>({});
  const [sessionId, setSessionId] = useState<string>(() => 'sess_' + Math.random().toString(36).substring(2, 9));
  const [collectionOpen, setCollectionOpen] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'collection');
  const [collectionConsent, setCollectionConsent] = useState<{ group: string; trusted: boolean } | null>(null);
  const [lastGroup, setLastGroup] = useState('');
  const [collectionError, setCollectionError] = useState('');
  const collectedSession = useRef<CollectionSession | null>(null);
  const observation = useRef({ startedAt: 0, switches: 0, hints: 0, previous: null as ChoiceId | null });
  const frozenObservation = useRef<Observation | null>(null);

  useLayoutEffect(() => {
    if (gameScreen === 'DECISION' && collectedSession.current) observation.current = { startedAt: performance.now(), switches: 0, hints: 0, previous: null };
  }, [gameScreen, currentDecisionIndex]);

  const recordInteractionSource = (trusted: boolean) => {
    const session = collectedSession.current;
    if (session && session.kaynak === 'gercek' && !isHumanInteraction(trusted)) {
      session.kaynak = 'sentetik';
      session.rows = session.rows.map(row => ({ ...row, kaynak: 'sentetik' }));
      try { saveSession(session); } catch { setCollectionError('Kaynak değişimi kaydedilemedi; kayıt tamamlanmış sayılmadı.'); }
    }
  };
  const countHintRequest = (trusted: boolean) => {
    if (gameScreen !== 'DECISION' || !collectedSession.current) return;
    recordInteractionSource(trusted);
    observation.current.hints += 1;
  };

  // Tutor state
  const currentDecisionId = DECISION_KEYS[currentDecisionIndex] || 'architecture';
  const currentDecision = DECISIONS[currentDecisionId];

  const [tutorQuestion, setTutorQuestion] = useState<string>(
    currentDecision.localTutorQuestion
  );
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [tutorFallback, setTutorFallback] = useState(true);
  const tutorAbort = useRef<AbortController | null>(null);
  const tutorVersion = useRef(0);
  const invalidateTutor = () => {
    tutorVersion.current += 1;
    tutorAbort.current?.abort();
    setIsTutorLoading(false);
    setTutorFallback(true);
  };
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      id: 'init_1',
      sender: 'tutor',
      text: 'Pazartesi 08:00 krizine hoş geldin. Nöbetçi mühendis olarak alacağın her kararda sana düşünce egzersizleri ve Sokratik sorularla eşlik edeceğim.',
      decisionId: 'architecture',
      timestamp: '08:00',
    },
  ]);

  // Start the simulation after onboarding
  const handleStartGame = (profile: UserProfile, trusted: boolean) => {
    if (collectionOpen) {
      if (!collectionConsent) return false;
      try {
        const session: CollectionSession = { session_id: crypto.randomUUID(), participant_group: collectionConsent.group, kaynak: isHumanInteraction(trusted) && collectionConsent.trusted ? 'gercek' : 'sentetik', status: 'incomplete', rows: [] };
        saveSession(session, window.localStorage, 'create');
        collectedSession.current = session;
        setCollectionError('');
      } catch {
        setCollectionError('Kalıcı tarayıcı kaydı açılamadı. Veri kaydı başlamadı; depolama iznini kontrol et veya normal oyuna dön.');
        return false;
      }
    }
    invalidateTutor();
    setUserProfile(profile);
    setCurrentDecisionIndex(0);
    setPendingChoice(null);
    setFinalizedChoices({});
    setGameScreen('DECISION');
    setActiveTab('vaka');
    setTutorQuestion(DECISIONS.architecture.localTutorQuestion);
    return true;
  };

  // Option selection before commit
  const handleSelectChoice = (choice: ChoiceId, trusted: boolean) => {
    if (gameScreen !== 'DECISION' || finalizedChoices[currentDecisionId]) return;
    if (collectedSession.current) {
      recordInteractionSource(trusted);
      const metrics = observation.current;
      if (metrics.previous && metrics.previous !== choice) metrics.switches += 1;
      metrics.previous = choice;
    }
    setPendingChoice(choice);
  };

  // Finalize selected option
  const handleFinalizeChoice = (trusted: boolean) => {
    if (!pendingChoice || gameScreen !== 'DECISION' || finalizedChoices[currentDecisionId]) return;
    if (collectedSession.current) {
      recordInteractionSource(trusted);
      const metrics = observation.current;
      frozenObservation.current = {
        decision_elapsed_seconds: Math.round(Math.min(120, Math.max(0, (performance.now() - metrics.startedAt) / 1000)) * 1000) / 1000,
        option_switch_count: metrics.switches, hint_request_count: metrics.hints,
        prior_high_risk_choice_count: Object.values(finalizedChoices).filter(choice => choice === 'B').length,
        scene_number: currentDecisionIndex + 1,
        experience_code: { beginner: 0, intermediate: 1, experienced: 2 }[userProfile.experience],
      };
    }
    invalidateTutor();

    const updated = {
      ...finalizedChoices,
      [currentDecisionId]: pendingChoice,
    };
    setFinalizedChoices(updated);
    setChoices((prev) => ({
      ...prev,
      [currentDecisionId]: pendingChoice,
    }));
    setGameScreen(collectedSession.current ? 'DIFFICULTY_FEEDBACK' : 'CONSEQUENCE');
  };

  const handleDifficultyAnswer = (label: 0 | 1, trusted: boolean) => {
    if (gameScreen !== 'DIFFICULTY_FEEDBACK' || !collectedSession.current || !frozenObservation.current) return;
    recordInteractionSource(trusted);
    const session = collectedSession.current;
    const updated: CollectionSession = { ...session, status: session.rows.length === 2 ? 'completed' : 'incomplete', rows: [...session.rows, { ...frozenObservation.current, session_id: session.session_id, participant_group: session.participant_group, kaynak: session.kaynak, difficulty_label: label }] };
    try {
      saveSession(updated);
      collectedSession.current = updated;
      frozenObservation.current = null;
      setCollectionError('');
      setGameScreen('CONSEQUENCE');
    } catch {
      setCollectionError('Yanıt kalıcı kaydedilemedi. Sonuç henüz açılmadı; tekrar dene veya üstteki vazgeçme düğmesiyle bu oturumun kaydını silerek normal oyuna geç.');
    }
  };

  const withdrawCollection = () => {
    try {
      if (collectedSession.current) deleteSession(collectedSession.current.session_id);
      collectedSession.current = null;
      frozenObservation.current = null;
      setCollectionConsent(null); setCollectionOpen(false); setCollectionError('');
      if (gameScreen === 'DIFFICULTY_FEEDBACK') setGameScreen('CONSEQUENCE');
    } catch { setCollectionError('Oturum silinemedi. Depolama iznini kontrol et; silme işlemi tamamlanmış sayılmadı.'); }
  };

  // Continue to next decision or show ending
  const handleContinue = () => {
    if (gameScreen !== 'CONSEQUENCE' || !finalizedChoices[currentDecisionId]) return;
    invalidateTutor();
    if (currentDecisionIndex < 2) {
      const nextIndex = currentDecisionIndex + 1;
      const nextId = DECISION_KEYS[nextIndex];
      setCurrentDecisionIndex(nextIndex);
      setPendingChoice(null);
      setGameScreen('DECISION');
      setTutorQuestion(DECISIONS[nextId].localTutorQuestion);
    } else {
      // Reached ending!
      setGameScreen('ENDING');
      setActiveTab('vaka');
    }
  };

  // Ask Socratic Tutor via real server API
  const handleAskTutor = async (query: string, trusted: boolean) => {
    if (!query.trim() || isTutorLoading || !['DECISION', 'CONSEQUENCE'].includes(gameScreen)) return;
    countHintRequest(trusted);
    const requestVersion = ++tutorVersion.current;
    const controller = new AbortController();
    tutorAbort.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);

    const timeStr = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const studentMsg: TutorMessage = {
      id: 'msg_' + Date.now(),
      sender: 'student',
      text: query,
      decisionId: currentDecisionId,
      timestamp: timeStr,
    };

    setTutorMessages((prev) => [...prev, studentMsg]);
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        signal: controller.signal,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          decisionId: currentDecisionId,
          phase: gameScreen === 'DECISION' ? 'before_choice' : 'after_choice',
          experience: userProfile.experience,
          role: userProfile.role,
          goal: userProfile.goal,
          message: query,
          finalizedChoices,
        }),
      });

      if (!res.ok) {
        throw new Error('SERVER_ERROR');
      }

      const data = await res.json();
      if (requestVersion !== tutorVersion.current) return;
      const replyText = data.messageTr || currentDecision.localTutorQuestion;
      setTutorFallback(!data.liveAi || Boolean(data.fallback));

      setTutorQuestion(replyText);

      const tutorReplyMsg: TutorMessage = {
        id: 'reply_' + Date.now(),
        sender: 'tutor',
        text: replyText,
        decisionId: currentDecisionId,
        isFallback: !data.liveAi || Boolean(data.fallback),
        hintLevel: data.hintLevel,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setTutorMessages((prev) => [...prev, tutorReplyMsg]);
    } catch {
      if (requestVersion !== tutorVersion.current) return;
      setTutorFallback(true);
      // Graceful fallback keeping deterministic story 100% playable
      const fallbackMsg: TutorMessage = {
        id: 'reply_' + Date.now(),
        sender: 'tutor',
        text: `${currentDecision.localTutorQuestion} (AI servisine şu an ulaşılamıyor, yerel Sokratik rehberlik devrede.)`,
        decisionId: currentDecisionId,
        isFallback: true,
        timestamp: new Date().toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setTutorQuestion(currentDecision.localTutorQuestion);
      setTutorMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      clearTimeout(timeout);
      if (requestVersion === tutorVersion.current) setIsTutorLoading(false);
    }
  };

  // Full clean reset
  const handleRestartGame = () => {
    invalidateTutor();
    // Completed rows and incomplete sessions remain in local storage across restarts.
    collectedSession.current = null;
    frozenObservation.current = null;
    setCollectionConsent(null);
    setCollectionError('');
    setUserProfile({ experience: 'intermediate', role: 'developer', goal: 'architecture' });
    setTutorQuestion(DECISIONS.architecture.localTutorQuestion);
    setGameScreen('ONBOARDING');
    setActiveTab('vaka');
    setCurrentDecisionIndex(0);
    setPendingChoice(null);
    setFinalizedChoices({});
    setChoices({ architecture: 'A', testing: 'A', privacy: 'A' });
    setSessionId('sess_' + Math.random().toString(36).substring(2, 9));
    setTutorMessages([]);
  };

  // Calculate deterministic ending when all 3 decisions are ready
  let achievedEndingId: EndingId = 'ENDING_SAFE';
  if (finalizedChoices.architecture && finalizedChoices.testing && finalizedChoices.privacy) {
    achievedEndingId = calculateEnding({
      architecture: finalizedChoices.architecture,
      testing: finalizedChoices.testing,
      privacy: finalizedChoices.privacy,
    });
  }
  const achievedEnding = ENDINGS[achievedEndingId] || ENDINGS.ENDING_SAFE;

  return (
    <div data-testid="app-shell" data-screen={gameScreen} className="w-full max-w-[480px] min-h-screen relative flex flex-col bg-[#15130e] text-[#e8e2d8] shadow-[0_0_50px_rgba(0,0,0,0.85)] mx-auto selection:bg-[#ffb870] selection:text-[#2c1600]">
      {/* Top Header */}
      <Header
        timeLabel={
          gameScreen === 'ONBOARDING'
            ? '08:00'
            : gameScreen === 'ENDING'
            ? '08:42'
            : currentDecision.timeLabel
        }
        stepLabel={
          gameScreen === 'ONBOARDING'
            ? 'Acil Durum / Vaka Modu'
            : gameScreen === 'ENDING'
            ? 'Triage Tamamlandı'
            : `${currentDecision.progress}`
        }
        userProfile={userProfile}
        onRestart={handleRestartGame}
      />

      {/* Main Content Viewport */}
      <main className="flex flex-col relative w-full px-4 pt-20 pb-20 bg-[#15130e] min-h-screen">
        {collectedSession.current && gameScreen !== 'ONBOARDING' && <aside data-testid="collection-active" className="mb-4 rounded-xl border border-[#89d4cd]/40 p-3 text-xs space-y-2">
          <p>Veri toplama açık · {collectedSession.current.kaynak === 'sentetik' ? 'Sentetik / otomasyon kaydı — gerçek insan sayılmaz' : 'Gönüllü oturum'} · {collectedSession.current.rows.length}/3 etiketli karar</p>
          <p className="break-all">Oturum: {collectedSession.current.session_id}</p>
          <button data-testid="collection-withdraw" type="button" onClick={withdrawCollection} className="min-h-11 w-full border border-[#89d4cd]/40 rounded-lg px-2">Veriden vazgeç — bu oturumu sil ve normal oyuna geç</button>
          {collectionError && gameScreen !== 'DIFFICULTY_FEEDBACK' && <p role="alert" className="text-[#ffb4ab]">{collectionError}</p>}
        </aside>}
        {/* TAB: VAKA (Main Storyline) */}
        {activeTab === 'vaka' && (
          <>
            {gameScreen === 'ONBOARDING' && (
              <>
              {!collectionOpen && <button data-testid="collection-open" type="button" onClick={() => setCollectionOpen(true)} className="mb-4 min-h-11 rounded-xl border border-[#89d4cd]/40 px-4 py-2 text-sm text-[#89d4cd]">Veri Toplama Modu — gönüllü katılım</button>}
              {collectionOpen && <CollectionPanel consented={Boolean(collectionConsent)} initialGroup={lastGroup} error={collectionError}
                onConsent={(group, trusted) => { setCollectionConsent({ group, trusted: isHumanInteraction(trusted) }); setLastGroup(group); }}
                onDecline={() => { setCollectionConsent(null); setCollectionOpen(false); setCollectionError(''); }} onClearError={() => setCollectionError('')} />}
              <OnboardingScreen
                onStart={handleStartGame}
                initialProfile={userProfile}
                startBlocked={collectionOpen && !collectionConsent}
              />
              </>
            )}

            {gameScreen === 'DIFFICULTY_FEEDBACK' && <DifficultyFeedback onAnswer={handleDifficultyAnswer} error={collectionError} />}

            {(gameScreen === 'DECISION' || gameScreen === 'CONSEQUENCE') && (
              <ChapterScreen
                decision={currentDecision}
                screenState={gameScreen}
                userProfile={userProfile}
                selectedChoice={pendingChoice}
                onSelectChoice={handleSelectChoice}
                onFinalizeChoice={handleFinalizeChoice}
                onContinue={handleContinue}
                tutorQuestion={tutorQuestion}
                isTutorLoading={isTutorLoading}
                tutorFallback={tutorFallback}
                onAskTutor={handleAskTutor}
                onHintRequest={countHintRequest}
                isLastDecision={currentDecisionIndex === 2}
              />
            )}

            {gameScreen === 'ENDING' && (
              <EndingScreen
                achievedEnding={achievedEnding}
                choices={choices}
                userProfile={userProfile}
                onRestart={handleRestartGame}
              />
            )}
          </>
        )}

        {/* TAB: TELEMETRI */}
        {activeTab === 'telemetri' && (
          <TelemetryView
            currentDecisionId={currentDecisionId}
            hasOutageEnded={gameScreen === 'ENDING' && achievedEndingId === 'ENDING_SAFE'}
          />
        )}

        {/* TAB: TUTOR */}
        {activeTab === 'tutor' && (
          <TutorView
            messages={tutorMessages}
            onSendMessage={handleAskTutor}
            isLoading={isTutorLoading}
            currentDecisionId={currentDecisionId}
            userProfile={userProfile}
          />
        )}

        {/* TAB: DEBRIEF */}
        {activeTab === 'debrief' && (
          <EndingScreen
            achievedEnding={achievedEnding}
            choices={choices}
            userProfile={userProfile}
            onRestart={handleRestartGame}
          />
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (gameScreen === 'DIFFICULTY_FEEDBACK' && tab !== 'vaka') return;
          if (tab === 'debrief' && gameScreen !== 'ENDING') return;
          if (gameScreen === 'ONBOARDING' && tab !== 'vaka') return;
          setActiveTab(tab);
        }}
        hasEnding={gameScreen === 'ENDING'}
      />
    </div>
  );
}
