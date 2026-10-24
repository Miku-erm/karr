import { endingOracle, get, onboard, play } from '../support/story';
describe('Eight deterministic story paths', () => {
  for (const [path, ending] of Object.entries(endingOracle)) {
    it(`${path} -> ${ending}; all consequences and clean restart`, () => {
      cy.visit('/');
      onboard('intermediate', 'tester', 'testing');
      play(path);
      if (path === 'BBB') {
        get('summary-architecture').should('contain', 'izleme');
        get('summary-testing').should('contain', 'kesinti');
        get('summary-privacy').should('contain', 'Ham loglar');
      }
      get('restart-game').click();
      get('app-shell').should('have.attr', 'data-screen', 'ONBOARDING');
      get('start-game').should('be.disabled');
      get('ending-code').should('not.exist');
      cy.get('[aria-pressed="true"]').should('not.exist');
    });
  }
});
