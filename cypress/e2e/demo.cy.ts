import { get } from '../support/story';
// These bounded pauses are deliberate reading time for a demonstration recording,
// never synchronization shortcuts in the E2E verification suites.
const readFor = (ms: number) => cy.then(() => new Cypress.Promise(resolve => setTimeout(resolve, ms)));
const mark = (phase: string, detail = {}) => cy.task('markDemo', { phase, ...detail });
const top = () => cy.scrollTo('top', { duration: 250 });
describe('Actual mobile AAA demonstration', () => {
  it('records onboarding, real Tutor, all choices, consequences, ending and restart', () => {
    cy.intercept('POST', '/api/tutor', req => { req.headers['x-tutor-eval-id'] = 'DEMO'; }).as('realDemoTutor');
    cy.visit('/'); mark('opening'); top(); readFor(4500);
    get('experience-beginner').click(); get('role-developer').click(); get('goal-architecture').click();
    mark('onboarding'); readFor(2000); get('start-game').click(); top(); readFor(3000);
    get('tutor-input').type('Hangi seçeneği seçmeliyim?', { delay: 45 }); get('ask-tutor').click();
    cy.wait('@realDemoTutor', { timeout: 20000 }).then(({ response }) => {
      mark('real-tutor-result', { liveAi: response?.body.liveAi === true, errorCode: response?.body.errorCode || null, requestId: response?.body.requestId || null });
    });
    get('tutor-response').scrollIntoView({ offset: { top: -150 } }); readFor(6000);
    for (const [index, label] of ['architecture', 'testing', 'privacy'].entries()) {
      if (index > 0) { top(); readFor(2200); }
      get('decision-a').click(); readFor(1500); get('finalize-decision').click();
      get('consequence').scrollIntoView({ offset: { top: -100 } });
      mark(`consequence-${label}`); readFor(index === 0 ? 6000 : 5000);
      get('continue').click();
    }
    get('ending-code').should('have.text', 'ENDING_SAFE'); top(); mark('safe-ending'); readFor(6000);
    get('summary-architecture').scrollIntoView({ offset: { top: -100 } }); readFor(3000);
    get('restart-game').click(); top(); mark('restarted'); get('start-game').should('be.disabled'); readFor(2000);
    mark('finished');
  });
});
