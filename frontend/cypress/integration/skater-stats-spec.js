/// <reference types="Cypress" />

import { waitLoadMoreRequest } from '../utils/networking'
import teamArray from '../utils/team-array'
import countryArray from '../utils/country-array'

const statsToSort = [
  'Player',
  'GP',
  'G',
  'A',
  'P',
  'PM',
  'P/G',
  'PPG',
  'PPP',
  'SHG',
  'SHP',
  'Shots',
  'S%',
  'Hits',
  'FOT',
  'FO%',
  'TA',
  'GA',
  'BLK',
  'T/G',
  'PPT/G',
  'SHT/G',
]

const posFilters = [
  { pos: 'All positions', num: 16 },
  { pos: 'Centers', num: 6 },
  { pos: 'Left Wings', num: 2 },
  { pos: 'Right Wings', num: 2 },
  { pos: 'Forwards', num: 10 },
  { pos: 'Defencemen', num: 6 },
]

const sortTest = stat => {
  specify(`stats can be sorted by ${stat}`, () => {
    cy.testSortByColumn(stat)
  })
}

const posFilterTest = (pos, num) => {
  it(`can be filtered by ${pos}`, () => {
    cy.testFilterByPosition(pos, num)
  })
}

const teamFilterTest = team => {
  // Tests only num of players by team. Doesn't test if the team
  // is actually correct.
  it(`can be filtered by ${team}`, () => {
    cy.testFilterByTeam(team)
  })
}

const countryFilterTest = data => {
  // Tests only num of players by country. Doesn't test if the country
  // is actually correct.
  it(`can be filtered by ${data.country}`, () => {
    cy.testFilterByCountry(data.country, data.num)
  })
}

describe('/players/stats', () => {
  beforeEach(() => {
    cy.server()
    cy.route({
      method: 'POST',
      url: '/graphql',
    }).as('gqlCall')
    cy.visit('/players/stats')
    cy.get('[data-cy=stat-table]').as('statTable')
    cy.get('[data-cy=load-more-button]').as('loadMore')
  })

  it('greets with Player Stats', () => {
    cy.contains('h1', 'Player Stats')
  })

  it('has a filter button', () => {
    cy.get('[data-cy=filter-button]')
      .should('exist')
      .and('contain', 'Show Filters')
  })

  it('has a stat table', () => {
    cy.get('@statTable').should('exist')
  })

  it('has a load more button', () => {
    cy.get('@loadMore').should('exist')
  })

  it('load more button loads more stats', () => {
    cy.get('@loadMore').click()
    waitLoadMoreRequest(xhr => {
      expect(xhr.requestBody.variables.offset, 'Stat offset').to.equal(16)
    })
  })

  context('filter by position', () => {
    for (const filter of posFilters) {
      posFilterTest(filter.pos, filter.num)
    }
  })

  context('filter by team', () => {
    for (const team of teamArray) {
      teamFilterTest(team)
    }
  })

  context('filter by country', () => {
    for (const country of countryArray) {
      countryFilterTest(country)
    }
  })

  context('stat sorting', () => {
    for (const stat of statsToSort) {
      sortTest(stat)
    }
  })
})
