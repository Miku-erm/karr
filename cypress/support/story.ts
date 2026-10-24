export const get = (id: string) => cy.get(`[data-testid="${id}"]`);
export const endingOracle: Record<string, string> = {
  AAA: 'ENDING_SAFE', AAB: 'ENDING_PRIVACY_INCIDENT', ABA: 'ENDING_RECURRING_OUTAGE', ABB: 'ENDING_PRIVACY_INCIDENT',
  BAA: 'ENDING_FRAGILE', BAB: 'ENDING_PRIVACY_INCIDENT', BBA: 'ENDING_RECURRING_OUTAGE', BBB: 'ENDING_PRIVACY_INCIDENT',
};
export function onboard(experience = 'beginner', role = 'developer', goal = 'architecture') {
  get(`experience-${experience}`).click();
  get(`role-${role}`).click();
  get(`goal-${goal}`).click();
  get('start-game').click();
  get('chapter').should('have.attr', 'data-decision', 'architecture');
}
export function decide(choice: string, index: number) {
  const decisions = ['architecture', 'testing', 'privacy'];
  const effects = [
    { A: 'verified_rollback', B: 'hotfix_monitoring_required' },
    { A: 'targeted_flow_verified', B: 'recurring_outage' },
    { A: 'minimized_and_restricted', B: 'privacy_incident' },
  ];
  get('chapter').should('have.attr', 'data-decision', decisions[index]);
  get('story-progress').should('contain', `${index + 1} / 3`);
  get('finalize-decision').should('be.disabled');
  get(`decision-${choice.toLowerCase()}`).click().should('have.attr', 'aria-pressed', 'true');
  get('finalize-decision').click();
  get('consequence').should('be.visible').and('have.attr', 'data-choice', choice).and('have.attr', 'data-effect', effects[index][choice as 'A' | 'B']);
  get('decision-a').should('not.exist');
  get('decision-b').should('not.exist');
  get('consequence').should('contain', 'Neden:');
  get('continue').click();
}
export function play(path: string) {
  path.split('').forEach((choice, index) => decide(choice, index));
  get('ending-code').should('have.text', endingOracle[path]);
  ['architecture', 'testing', 'privacy'].forEach((id, i) => get(`summary-${id}`).should('have.attr', 'data-choice', path[i]));
}
export function resetDuringDecision() {
  get('profile-open').click();
  get('reset-session').click();
  get('app-shell').should('have.attr', 'data-screen', 'ONBOARDING');
}
