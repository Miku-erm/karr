import { get, onboard, decide, resetDuringDecision } from '../support/story';
describe('Mobile features and Tutor resilience (controlled API)', () => {
  beforeEach(() => cy.visit('/'));
  it('requires exactly three explicit onboarding selections', () => {
    cy.get('fieldset').should('have.length', 3);
    get('start-game').should('be.disabled');
    get('experience-beginner').click();
    get('role-developer').click();
    get('start-game').should('be.disabled');
    get('goal-privacy').click();
    get('start-game').should('be.enabled');
  });
  it('shows beginner explanations and role/goal feedback', () => {
    onboard('beginner', 'tester', 'architecture');
    get('experience-explanation').should('contain', 'Geri alma');
    get('concept-hint-btn').click();
    get('chapter').should('contain', 'Uygulama kodu');
    get('decision-a').click(); get('finalize-decision').click();
    get('personalized-feedback').should('contain', 'Test Mühendisi Gözü').and('contain', 'Mimari Odağın');
  });
  it('shows experienced tradeoffs with simulated pressure and no deadline', () => {
    onboard('experienced', 'lead', 'testing');
    get('experience-explanation').should('contain', 'ödünleşim').and('contain', 'Süre sınırı yok');
    cy.get('[role="timer"]').should('not.exist');
  });
  it('locks submitted choices and prevents premature debrief', () => {
    onboard(); get('nav-debrief').should('be.disabled');
    get('decision-b').click(); get('finalize-decision').click();
    get('consequence').should('have.attr', 'data-choice', 'B');
    get('finalize-decision').should('not.exist');
    get('continue').click(); get('story-progress').should('contain', '2 / 3');
  });
  it('exposes the Tutor panel and loading state while decisions stay playable', () => {
    cy.intercept('POST', '/api/tutor', { delay: 800, body: { liveAi: true, fallback: false, messageTr: 'Kararını hangi kanıtla desteklersin?' } }).as('tutor');
    onboard(); get('tutor-input').type('Hangi kanıt gerekli?'); get('ask-tutor').click();
    get('tutor-loading').should('be.visible');
    get('decision-a').click(); get('finalize-decision').should('be.enabled');
    cy.wait('@tutor'); get('tutor-response').should('have.attr', 'data-origin', 'gemini');
    get('nav-tutor').click(); cy.contains('Hangi kanıt gerekli?').should('be.visible');
  });
  it('falls back safely on server failure and completes the current decision', () => {
    cy.intercept('POST', '/api/tutor', { statusCode: 500, body: { error: 'controlled test failure' } }).as('failed');
    onboard(); get('tutor-input').type('İpucu verir misin?'); get('ask-tutor').click(); cy.wait('@failed');
    get('tutor-loading').should('not.exist');
    get('tutor-response').should('have.attr', 'data-origin', 'local_fallback').and('contain', 'Yerel ipucu');
    decide('A', 0);
  });
  it('labels an API timeout fallback honestly', () => {
    cy.intercept('POST', '/api/tutor', { body: { liveAi: false, fallback: true, errorCode: 'TIMEOUT', messageTr: 'Hangi kanıt gerekli?' } }).as('tutorTimeout');
    onboard(); get('tutor-input').type('Soru'); get('ask-tutor').click(); cy.wait('@tutorTimeout');
    get('tutor-response').should('have.attr', 'data-origin', 'local_fallback');
  });
  it('drops stale Tutor replies after restart and clears the profile', () => {
    cy.intercept('POST', '/api/tutor', { delay: 700, body: { liveAi: true, messageTr: 'ESKI_OTURUM_YANITI' } }).as('old');
    onboard(); get('tutor-input').type('Bir soru'); get('ask-tutor').click();
    resetDuringDecision(); get('start-game').should('be.disabled');
    onboard('experienced', 'lead', 'privacy');
    cy.wait('@old'); cy.contains('ESKI_OTURUM_YANITI').should('not.exist');
    get('tutor-loading').should('not.exist');
  });
  it('refresh starts a clean session (no persistence implemented)', () => {
    onboard(); decide('B', 0); cy.reload();
    get('start-game').should('be.disabled'); get('chapter').should('not.exist');
  });
  it('supports keyboard choice and confirmation', () => {
    onboard(); get('decision-a').focus().type('{enter}').should('have.attr', 'aria-pressed', 'true');
    get('finalize-decision').focus().type('{enter}');
    get('consequence').should('have.attr', 'data-choice', 'A');
  });
  it('does not overflow at 360px or 390px on onboarding and all decisions', () => {
    const check = () => cy.document().then(doc => {
      const width = doc.documentElement.clientWidth;
      const overflow = [...doc.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > width + 1).map(e => ({ tag: e.tagName, text: e.textContent?.slice(0, 90), className: e.className }));
      expect(doc.documentElement.scrollWidth, JSON.stringify(overflow.slice(-8))).to.be.at.most(width + 1);
    });
    cy.viewport(360, 800); check(); onboard(); check();
    decide('A', 0); check(); decide('A', 1); check();
    cy.viewport(390, 844); decide('A', 2); check();
    cy.screenshot('mobile-safe-ending', { capture: 'viewport' });
  });
});
