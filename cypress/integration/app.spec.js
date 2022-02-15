/// <reference types="cypress" />

describe('example test', () => {
  it('shows the top page', () => {
    cy.visit('http://localhost:3000/');
    cy.get('h1').contains('Find wonderful projects');
  });
});
