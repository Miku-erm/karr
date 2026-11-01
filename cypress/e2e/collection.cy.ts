import { get, onboard, resetDuringDecision } from '../support/story';
import { CSV_HEADERS, STORAGE_KEY, validateCsv } from '../../src/collection/contract';

const enter = (group = 'P01') => {
  get('participant-group').clear(); if (group) get('participant-group').type(group);
  get('collection-consent').check(); get('consent-accept').click();
};
const stored = () => cy.window().then(win => JSON.parse(win.localStorage.getItem(STORAGE_KEY) || '{"sessions":[]}').sessions);
const commit = (choice = 'A', label: 0 | 1 = 0) => {
  get(`decision-${choice.toLowerCase()}`).click(); get('finalize-decision').click();
  get('difficulty-feedback').should('be.visible'); get('consequence').should('not.exist');
  get(label ? 'difficulty-yes' : 'difficulty-no').click();
  get('consequence').should('be.visible'); get('continue').click();
};
const visit = () => cy.visit('/?mode=collection');

describe('Voluntary collection mode — automation is always synthetic', () => {
  it('records nothing before consent, and decline preserves the normal game without feedback', () => {
    visit();
    get('consent-accept').should('be.disabled');
    cy.window().then(win => expect(win.localStorage.getItem(STORAGE_KEY)).to.eq(null));
    get('consent-decline').click(); onboard();
    get('decision-a').click(); get('finalize-decision').click();
    get('difficulty-feedback').should('not.exist'); get('consequence').should('be.visible');
    cy.window().then(win => expect(win.localStorage.getItem(STORAGE_KEY)).to.eq(null));
  });
  it('requires explicit consent and a valid optional group before recording', () => {
    visit();
    get('experience-beginner').click(); get('role-developer').click(); get('goal-testing').click();
    get('start-game').should('be.disabled');
    get('participant-group').type('ABC'); get('collection-consent').check();
    get('consent-accept').should('be.disabled');
    get('participant-group').clear(); get('consent-accept').click();
    get('start-game').click();
    stored().then(sessions => {
      expect(sessions).to.have.length(1); expect(sessions[0].kaynak).to.eq('sentetik');
      expect(sessions[0].participant_group).to.eq(''); expect(sessions[0].status).to.eq('incomplete');
    });
  });
  it('captures real browser interactions, explicit labels and all six pre-choice fields without text', () => {
    cy.intercept('POST', '/api/tutor', { body: { liveAi: false, fallback: true, messageTr: 'Kanıtı nasıl değerlendirirsin?' } }).as('tutor');
    visit(); enter(); onboard('experienced', 'tester', 'testing');
    get('decision-a').click().click(); get('decision-b').click(); get('decision-a').click(); get('decision-b').click();
    get('concept-hint-btn').click().click().click();
    get('tutor-input').type('BU_METIN_VERI_KUMESINE_GIRMEMELI'); get('ask-tutor').click(); cy.wait('@tutor').then(({ request }) => {
      expect(request.body).not.to.have.property('decision_elapsed_seconds');
      expect(request.body).not.to.have.property('participant_group');
      expect(request.body).not.to.have.property('difficulty_label');
    });
    get('finalize-decision').click();
    get('consequence').should('not.exist'); get('nav-tutor').click(); get('difficulty-feedback').should('be.visible');
    cy.screenshot('collection-feedback', { capture: 'viewport', disableTimersAndAnimations: false });
    get('difficulty-yes').click(); get('continue').click(); commit('B', 0); commit('A', 1);
    get('ending-code').should('have.text', 'ENDING_RECURRING_OUTAGE');
    stored().then(sessions => {
      expect(sessions).to.have.length(1);
      const session = sessions[0]; expect(session.status).to.eq('completed'); expect(session.kaynak).to.eq('sentetik');
      expect(session.rows.map((row: any) => row.difficulty_label)).to.deep.eq([1, 0, 1]);
      expect(session.rows.map((row: any) => row.prior_high_risk_choice_count)).to.deep.eq([0, 1, 2]);
      expect(session.rows.map((row: any) => row.experience_code)).to.deep.eq([2, 2, 2]);
      expect(session.rows[0].option_switch_count).to.eq(3); expect(session.rows[0].hint_request_count).to.eq(3);
      for (const row of session.rows) { expect(Object.keys(row).sort()).to.deep.eq([...CSV_HEADERS].sort()); expect(row.decision_elapsed_seconds).to.be.within(0, 120); }
      expect(JSON.stringify(session)).not.to.contain('BU_METIN');
    });
  });
  it('freezes elapsed seconds at commitment and excludes time spent choosing the difficulty label', () => {
    visit(); enter();
    cy.window().then(win => cy.stub(win.performance, 'now').returns(1000).as('now'));
    onboard();
    cy.get<any>('@now').then(now => now.returns(3500));
    get('decision-a').click(); get('finalize-decision').click();
    cy.get<any>('@now').then(now => now.returns(200000));
    get('difficulty-no').click();
    stored().then(sessions => expect(sessions[0].rows[0].decision_elapsed_seconds).to.eq(2.5));
  });
  it('caps elapsed time at 120 seconds', () => {
    visit(); enter();
    cy.window().then(win => cy.stub(win.performance, 'now').returns(0).as('now'));
    onboard(); cy.get<any>('@now').then(now => now.returns(150000));
    get('decision-a').click(); get('finalize-decision').click(); get('difficulty-no').click();
    stored().then(sessions => expect(sessions[0].rows[0].decision_elapsed_seconds).to.eq(120));
  });
  it('keeps completed sessions across restart and refresh, assigns fresh UUIDs, exports ALL completed rows', () => {
    visit(); enter(); onboard(); commit(); commit(); commit();
    let firstId = '';
    stored().then(sessions => { firstId = sessions[0].session_id; });
    get('restart-game').click();
    get('collection-counts').should('contain', '0 tamamlanmış gerçek oturum').and('contain', '1 tamamlanmış sentetik/test oturumu');
    enter(); onboard(); commit(); commit(); commit(); get('restart-game').click();
    cy.reload();
    get('collection-counts').should('contain', '2 tamamlanmış sentetik/test oturumu');
    stored().then(sessions => { expect(sessions).to.have.length(2); expect(sessions[1].session_id).not.to.eq(firstId); });
    get('collection-export').click();
    cy.readFile('artifacts/cypress/downloads/oturumlar.csv').should(text => {
      const parsed = validateCsv(String(text)); expect(parsed.errors).to.deep.eq([]); expect(parsed.rows).to.have.length(6);
      expect(parsed.rows.every(row => row.kaynak === 'sentetik')).to.eq(true);
    });
    cy.screenshot('collection-counts-synthetic-only', { capture: 'viewport', disableTimersAndAnimations: false });
  });
  it('persists an incomplete session but excludes it from the training-ready CSV', () => {
    visit(); enter(); onboard(); commit(); resetDuringDecision();
    get('collection-counts').should('contain', '1 eksik oturum'); cy.reload();
    get('collection-export').click();
    cy.readFile('artifacts/cypress/downloads/oturumlar.csv').should(text => expect(validateCsv(String(text)).rows).to.have.length(0));
    stored().then(sessions => { expect(sessions[0].status).to.eq('incomplete'); expect(sessions[0].rows).to.have.length(1); });
  });
  it('withdraws during the label step, deletes that session and leaves choices/outcomes intact', () => {
    visit(); enter(); onboard(); get('decision-b').click(); get('finalize-decision').click();
    get('collection-withdraw').click(); get('difficulty-feedback').should('not.exist');
    get('consequence').should('have.attr', 'data-choice', 'B'); stored().should('have.length', 0);
    get('continue').click(); get('decision-a').click(); get('finalize-decision').click();
    get('difficulty-feedback').should('not.exist'); get('consequence').should('be.visible');
  });
  it('deletes all data only after a clear confirmation and keeps it deleted after reload', () => {
    visit(); enter(); onboard(); commit(); resetDuringDecision();
    get('collection-delete-all').click(); stored().should('have.length', 1);
    get('collection-delete-confirm').click(); cy.reload();
    get('collection-counts').should('contain', '0 eksik oturum');
    cy.window().then(win => expect(win.localStorage.getItem(STORAGE_KEY)).to.eq(null));
  });
  it('handles storage denial honestly and allows normal play', () => {
    cy.visit('/?mode=collection', { onBeforeLoad(win) { cy.stub(win.Storage.prototype, 'setItem').throws(new Error('controlled quota failure')); } });
    enter(); get('experience-beginner').click(); get('role-developer').click(); get('goal-architecture').click(); get('start-game').click();
    get('collection-error').should('contain', 'Veri kaydı başlamadı');
    get('chapter').should('not.exist'); get('consent-decline').click();
    get('start-game').click(); get('chapter').should('be.visible');
  });
  it('does not overwrite corrupt stored data and permits explicit deletion', () => {
    cy.visit('/?mode=collection', { onBeforeLoad(win) { win.localStorage.setItem(STORAGE_KEY, '{broken'); } });
    get('collection-error').should('be.visible'); get('collection-consent').check(); get('consent-accept').should('be.disabled');
    cy.window().then(win => expect(win.localStorage.getItem(STORAGE_KEY)).to.eq('{broken'));
    get('collection-delete-all').click(); get('collection-delete-confirm').click();
    get('collection-error').should('not.exist'); get('consent-accept').should('be.enabled');
  });
  it('does not reveal the consequence or invent a saved label when storage fails after commitment', () => {
    visit(); enter(); onboard();
    cy.window().then(win => cy.stub(win.Storage.prototype, 'setItem').throws(new Error('controlled label-write failure')).as('write'));
    get('decision-a').click(); get('finalize-decision').click(); get('difficulty-yes').click();
    get('feedback-storage-error').should('be.visible'); get('consequence').should('not.exist');
    stored().then(sessions => expect(sessions[0].rows).to.have.length(0));
    cy.get<any>('@write').then(write => write.restore()); get('difficulty-yes').click();
    get('consequence').should('be.visible');
    stored().then(sessions => { expect(sessions[0].rows).to.have.length(1); expect(sessions[0].rows[0].difficulty_label).to.eq(1); });
  });
  it('keeps consent and label controls readable at mobile widths without horizontal overflow', () => {
    cy.viewport(360, 800); visit();
    const check = () => cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth + 1));
    check(); cy.screenshot('collection-consent', { capture: 'viewport', disableTimersAndAnimations: false }); enter(); onboard();
    get('decision-a').click(); get('finalize-decision').click(); check();
    get('difficulty-no').focus().type('{enter}'); get('consequence').should('be.visible');
  });
});
