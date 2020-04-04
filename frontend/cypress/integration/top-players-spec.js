/// <reference types="Cypress" />

import { waitForBestPlayers } from '../utils/networking'

describe('/players/top-players', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'POST',
      url: Cypress.config().baseUrl + '/graphql',
    }).as('gqlCall')
    cy.visit('/players/top-players')
    cy.get('[data-cy=filter-button]').as('filterButton')
    cy.get('[data-cy=filter-container] > fieldset > select').as('selectFields')
    cy.get('[data-cy=data-card]').as('cards')
    cy.get('[data-cy=card-view-selector').as('viewSelector')
  })

  it('greets with Top Players', () => {
    cy.contains('h1', 'Top Players')
  })

  it('shows all 16 player cards', () => {
    cy.get('@cards').then(elements => {
      expect(elements.length, 'Num of cards').to.equal(16)
    })
  })

  it('is possible to flip player cards', () => {
    cy.cardIsNotFlipped(0)

    cy.get('@cards').eq(0).contains('div', 'Flip').click()

    cy.cardIsFlipped(0)
  })

  it('shows cards in correct order (by points)', () => {
    cy.get('@cards').eq(0).should('contain', 'Jack Eichel')
    cy.get('@cards').eq(1).should('contain', 'TJ Brodie')
    cy.get('@cards').eq(3).should('contain', 'Jesper Bratt')
    cy.get('@cards').eq(5).should('contain', 'Blake Coleman')
    cy.get('@cards').eq(6).should('contain', 'Dan Hamhuis')
    cy.get('@cards').eq(14).should('contain', 'Alex DeBrincat')
  })

  context('card view selector', () => {
    it('has card view selector present on page', () => {
      cy.get('@viewSelector')
        .should('exist')
        .and('contain', 'Last game')
        .and('contain', '5 games')
        .and('contain', '10 games')
    })
    it('has 5 games selected at first', () => {
      cy.get('@viewSelector').within(() => {
        cy.get('span')
          .eq(1)
          .should(
            'have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )
        cy.get('span')
          .eq(0)
          .should(
            'not.have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )
        cy.get('span')
          .eq(2)
          .should(
            'not.have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )
      })
    })
    it('loads up with the correct query', () => {
      waitForBestPlayers(
        'getBestPlayers',
        xhr => {
          const numOfGamesId =
            xhr.response.body.data.BestPlayers[0].numOfGamesId
          expect(numOfGamesId, 'numOfGamesId').to.equal(5)
        },
        5
      )
    })
    specify('query for the last game works', () => {
      cy.get('@viewSelector').within(() => {
        cy.get('span')
          .eq(0)
          .click()
          .should(
            'have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )

        cy.get('span')
          .eq(1)
          .should(
            'not.have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )

        cy.wait(500)

        waitForBestPlayers(
          'getBestPlayers',
          xhr => {
            const numOfGamesId =
              xhr.response.body.data.BestPlayers[0].numOfGamesId
            expect(numOfGamesId, 'numOfGamesId').to.equal(1)
          },
          1
        )
      })

      cy.get('@cards')
        .eq(0)
        .should('contain', 'TJ Brodie')
        .and('not.contain', 'Jack Eichel')
    })
    specify('query for 10 games works', () => {
      cy.get('@viewSelector').within(() => {
        cy.get('span')
          .eq(2)
          .click()
          .should(
            'have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )

        cy.get('span')
          .eq(1)
          .should(
            'not.have.css',
            'text-shadow',
            'rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px, rgb(255, 249, 249) 0px 0px 1px'
          )

        cy.wait(500)
        waitForBestPlayers(
          'getBestPlayers',
          xhr => {
            const numOfGamesId =
              xhr.response.body.data.BestPlayers[0].numOfGamesId
            expect(numOfGamesId, 'numOfGamesId').to.equal(10)
          },
          10
        )
      })
    })
  })

  context('sorting and filtering', () => {
    it('has filter button present on page', () => {
      cy.get('@filterButton').should('exist').and('contain', 'Show Filters')
    })
    specify(
      'filter container should be translated to the left at first',
      () => {
        cy.get('[data-cy=filter-container]')
          .should('have.css', 'opacity', '0')
          .and('have.css', 'transform', 'matrix(1, 0, 0, 1, -943, 0)')
          .and('have.css', 'max-height', '0px')
      }
    )
    specify('filter container can be toggled with filter button', () => {
      cy.get('[data-cy=filter-container]')
        .should('have.css', 'opacity', '0')
        .and('have.css', 'transform', 'matrix(1, 0, 0, 1, -943, 0)')
        .and('have.css', 'max-height', '0px')
      cy.get('@filterButton').click().should('contain', 'Hide Filters')
      cy.get('[data-cy=filter-container]')
        .should('have.css', 'opacity', '1')
        .and('have.css', 'max-height', '500px')
        .and('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)')
      cy.get('@filterButton').click().should('contain', 'Show Filters')
    })

    context('sorting', () => {
      it('is possible to sort by goals', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(0).select('Goals')
        cy.get('@cards').eq(0).should('contain', 'Jack Eichel')
        cy.get('@cards').eq(1).should('contain', 'Jesper Bratt')
      })
      it('is possible to sort by assists', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(0).select('Assists')
        cy.get('@cards').eq(0).should('contain', 'TJ Brodie')
        cy.get('@cards').eq(1).should('contain', 'Yannick Weber')
      })
      it('is possible to sort by shots', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(0).select('Shots')
        cy.get('@cards').eq(0).should('contain', 'Blake Coleman')
        cy.get('@cards').eq(1).should('contain', 'Jack Eichel')
      })
      specify('sorting by a stat on the card-back flips all cards', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(0).select('Shots')
        cy.get('[data-cy=card-front]').each((card, index) => {
          cy.cardIsFlipped(index)
        })
        cy.get('@selectFields').eq(0).select('Points')
        cy.get('[data-cy=card-front]').each((card, index) => {
          cy.cardIsNotFlipped(index)
        })
      })
    })
    context('filter by position', () => {
      specify('filter by centers', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(1).select('Centers')
        cy.get('@cards')
          .should('contain', 'Jack Eichel')
          .and('contain', 'Austin Czarnik')
          .and('contain', 'Blake Coleman')
          .and('contain', 'Leo Komarov')
          .and('contain', 'Karson Kuhlman')
          .and('contain', 'Charlie Coyle')
          .and('not.contain', 'Jesper Bratt')
      })
      specify('filter by left wings', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(1).select('Left Wings')
        cy.get('@cards')
          .should('contain', 'Jesper Bratt')
          .and('contain', 'Anthony Beauvillier')
          .and('not.contain', 'Jack Eichel')
      })
      specify('filter by right wings', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(1).select('Right Wings')
        cy.get('@cards')
          .should('contain', 'Josh Archibald')
          .and('contain', 'Alex DeBrincat')
          .and('not.contain', 'Jesper Bratt')
      })
      specify('filter by forwards', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(1).select('Forwards')
        cy.get('@cards')
          .should('contain', 'Jack Eichel')
          .and('contain', 'Austin Czarnik')
          .and('contain', 'Blake Coleman')
          .and('contain', 'Leo Komarov')
          .and('contain', 'Karson Kuhlman')
          .and('contain', 'Charlie Coyle')
          .and('contain', 'Jesper Bratt')
          .and('contain', 'Anthony Beauvillier')
          .and('contain', 'Josh Archibald')
          .and('contain', 'Alex DeBrincat')
          .and('not.contain', 'TJ Brodie')
          .and('not.contain', 'Yannick Weber')
          .and('not.contain', 'Dan Hamhuis')
          .and('not.contain', 'Duncan Keith')
          .and('not.contain', 'Kris Russell')
          .and('not.contain', 'Marco Scandella')
      })
      specify('filter by defencemen', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(1).select('Defencemen')
        cy.get('@cards')
          .should('contain', 'TJ Brodie')
          .and('contain', 'Yannick Weber')
          .and('contain', 'Dan Hamhuis')
          .and('contain', 'Duncan Keith')
          .and('contain', 'Kris Russell')
          .and('contain', 'Marco Scandella')
          .and('not.contain', 'Jack Eichel')
          .and('not.contain', 'Austin Czarnik')
          .and('not.contain', 'Blake Coleman')
          .and('not.contain', 'Leo Komarov')
          .and('not.contain', 'Karson Kuhlman')
          .and('not.contain', 'Charlie Coyle')
          .and('not.contain', 'Jesper Bratt')
          .and('not.contain', 'Anthony Beauvillier')
          .and('not.contain', 'Josh Archibald')
          .and('not.contain', 'Alex DeBrincat')
      })
    })
    context('filter by team', () => {
      specify('filter by Boston Bruins', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Boston Bruins')
        cy.get('@cards')
          .should('contain', 'Karson Kuhlman')
          .and('contain', 'Charlie Coyle')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by Buffalo Sabres', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Buffalo Sabres')
        cy.get('@cards')
          .should('contain', 'Jack Eichel')
          .and('contain', 'Marco Scandella')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by Calgary Flames', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Calgary Flames')
        cy.get('@cards')
          .should('contain', 'TJ Brodie')
          .and('contain', 'Austin Czarnik')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by Chicago Blackhawks', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Chicago Blackhawks')
        cy.get('@cards')
          .should('contain', 'Duncan Keith')
          .and('contain', 'Alex DeBrincat')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by Edmonton Oilers', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Edmonton Oilers')
        cy.get('@cards')
          .should('contain', 'Kris Russell')
          .and('contain', 'Josh Archibald')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by Nashville Predators', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('Nashville Predators')
        cy.get('@cards')
          .should('contain', 'Yannick Weber')
          .and('contain', 'Dan Hamhuis')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by New Jersey Devils', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('New Jersey Devils')
        cy.get('@cards')
          .should('contain', 'Jesper Bratt')
          .and('contain', 'Blake Coleman')
        cy.get('@cards').should('have.length', 2)
      })
      specify('filter by New York Islanders', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(2).select('New York Islanders')
        cy.get('@cards')
          .should('contain', 'Leo Komarov')
          .and('contain', 'Anthony Beauvillier')
        cy.get('@cards').should('have.length', 2)
      })
    })
    context('filter by country', () => {
      specify('filter by Canada', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(3).select('Canada')
        cy.get('@cards').should('have.length', 7).and('contain', 'TJ Brodie')
      })
      specify('filter by Finland', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(3).select('Finland')
        cy.get('@cards').should('have.length', 1).and('contain', 'Leo Komarov')
      })
      specify('filter by Sweden', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(3).select('Sweden')
        cy.get('@cards').should('have.length', 1).and('contain', 'Jesper Bratt')
      })
      specify('filter by Switzerland', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(3).select('Switzerland')
        cy.get('@cards')
          .should('have.length', 1)
          .and('contain', 'Yannick Weber')
      })
      specify('filter by United States', () => {
        cy.get('@filterButton').click()
        cy.get('@selectFields').eq(3).select('United States')
        cy.get('@cards').should('have.length', 6).and('contain', 'Jack Eichel')
      })
    })
  })
})
