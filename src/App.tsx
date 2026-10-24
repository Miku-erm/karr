/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  const handleStartGame = (profile: UserProfile) => {
    invalidateTutor();
    setUserProfile(profile);
    setCurrentDecisionIndex(0);
    setPendingChoice(null);
    setFinalizedChoices({});
    setGameScreen('DECISION');
    setActiveTab('vaka');
    setTutorQuestion(DECISIONS.architecture.localTutorQuestion);
  };

  // Option selection before commit
  const handleSelectChoice = (choice: ChoiceId) => {
    if (gameScreen !== 'DECISION' || finalizedChoices[currentDecisionId]) return;
    setPendingChoice(choice);
  };

  // Finalize selected option
  const handleFinalizeChoice = () => {
    if (!pendingChoice || gameScreen !== 'DECISION' || finalizedChoices[currentDecisionId]) return;
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
    setGameScreen('CONSEQUENCE');
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
  const handleAskTutor = async (query: string) => {
    if (!query.trim() || isTutorLoading || !['DECISION', 'CONSEQUENCE'].includes(gameScreen)) return;
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
        {/* TAB: VAKA (Main Storyline) */}
        {activeTab === 'vaka' && (
          <>
            {gameScreen === 'ONBOARDING' && (
              <OnboardingScreen
                onStart={handleStartGame}
                initialProfile={userProfile}
              />
            )}

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
          if (tab === 'debrief' && gameScreen !== 'ENDING') return;
          if (gameScreen === 'ONBOARDING' && tab !== 'vaka') return;
          setActiveTab(tab);
        }}
        hasEnding={gameScreen === 'ENDING'}
      />
    </div>
  );
}
