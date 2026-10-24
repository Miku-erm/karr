import { get, onboard } from '../support/story';
describe('Genuine Gemini integration (no stubbing)', () => {
  it('displays an actual model answer in the application', { retries: 1 }, () => {
    cy.intercept('POST', '/api/tutor', req => { req.headers['x-tutor-eval-id'] = 'SMOKE'; }).as('realTutor');
    cy.visit('/'); onboard();
    get('tutor-input').type('Hangi seçeneği seçmeliyim?'); get('ask-tutor').click();
    cy.wait('@realTutor', { timeout: 20000 }).then(({ response }) => {
      expect(response?.statusCode).to.eq(200);
      expect(response?.body.liveAi, `Actual API response: ${response?.body.errorCode || 'ok'}`).to.eq(true);
      expect(response?.body.model).to.eq('gemini-3.1-flash-lite');
      expect(response?.body.messageTr).to.contain('?');
      expect(response?.body).not.to.have.property('apiKey');
    });
    get('tutor-response').should('have.attr', 'data-origin', 'gemini');
    cy.screenshot('live-gemini-tutor', { capture: 'viewport' });
  });
});
