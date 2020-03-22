describe('/profile', () => {
  it('loads correctly', () => {
    cy.visit('/')
    cy.fastLogin()
    cy.visit('/profile')
    cy.contains('h1', 'User Profile')
  })
})
