/// <reference types="Cypress" />

describe('Player Fan App', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, 'language', {
          value: 'en',
        })
      },
    })
  })

  it('Front page loads correctly', () => {
    cy.contains('Welcome to Player Fan')
    cy.get('[data-cy=top-skater-container]')
      .should('contain', 'Top Skaters of the Last 5 Games')
      .and('contain', 'Jack Eichel')
      .and('contain', 'TJ Brodie')
      .and('contain', 'Yannick Weber')
      .and('contain', 'Jesper Brat')
      .and('contain', 'Austin Czarnik')
    cy.get('[data-cy=top-goalie-container]')
      .should('contain', 'Top Goalies of the Last 5 Games')
      .and('contain', 'Pekka Rinne')
      .and('contain', 'Corey Crawford')
      .and('contain', 'David Rittich')
      .and('contain', 'Mike Smith')
      .and('contain', 'Tuukka Rask')
    cy.get('[data-cy=top-team-container]')
      .should('contain', 'Top Teams of the Last 10 Games')
      .and('contain', 'Nashville Predators')
      .and('contain', 'Calgary Flames')
      .and('contain', 'Chicago Blackhawks')
      .and('contain', 'Edmonton Oilers')
      .and('contain', 'New Jersey Devils')
  })

  it("displays 'last updated' time correctly", () => {
    cy.get('[data-cy=last-updated]>p')
      .eq(1)
      .then(el => {
        const displayedTime = el[0].innerText

        const [day, date, time] = displayedTime.split(',')

        // Check that the date part of the displayedTime parses
        // correctly to time
        expect(!isNaN(Date.parse(date)), 'isValidDate').to.be.true
      })
  })
})
