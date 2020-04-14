describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('greets with Log In', () => {
    cy.contains('h1', 'Log In')
  })

  it('links to /signup', () => {
    cy.contains('Register').should('have.attr', 'href', '/signup')
  })

  it('links to /forgot-password', () => {
    cy.contains('Forgot your password?').should(
      'have.attr',
      'href',
      '/forgot-password'
    )
  })

  it('requires username/email', () => {
    cy.get('form').contains('Log In').click()
    cy.get('[data-cy=form-error')
      .eq(0)
      .should('be.visible')
      .and('contain', 'Username or email is required')
    cy.get('[data-cy=form-error')
      .eq(1)
      .should('be.visible')
      .and('contain', 'Password is required')
  })

  it("has 'Keep me logged in' checkbox and it is checked", () => {
    cy.get('[for=rememberMe')
      .contains('Keep me logged in')
      .get('[name=rememberMe')
      .should('have.attr', 'checked')
  })

  it("'Keep me logged in' can be checked and unchecked", () => {
    cy.get('[name=rememberMe')
      .uncheck()
      .should('not.be.checked')
      .check()
      .should('be.checked')
  })

  it('requires cookies to be accepted to log in', () => {
    cy.login(undefined, true)

    cy.get('form')
      .get('[data-cy=form-notification-container]')
      .should('contain', 'You must accept cookies prior to login')
  })

  it('requires valid username and password', () => {
    cy.login({ username: 'test', password: 'test' })

    cy.get('form')
      .get('[data-cy=form-notification-container]')
      .contains('Invalid username or password')
  })

  it("is possible to login without 'remember me'", () => {
    cy.get('[name=rememberMe').uncheck()

    cy.login()

    cy.getCookie('user').its('expiry').should('not.exist')
  })

  it('navigates to / after a successfull login', () => {
    cy.login()

    // Redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Display 'logged in' notification
    cy.get('[data-cy=notification-container]').should(
      'contain',
      'successfully logged in'
    )

    cy.getCookie('user').its('expiry').should('exist')
  })
})
