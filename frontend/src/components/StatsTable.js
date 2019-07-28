import React from 'react'
import { Table, Header } from 'semantic-ui-react'

const StatsTable = ({
  headers,
  title,
  data,
  sortVariables,
  setSortVariables,
}) => {
  const handleNewVariables = sortBy => {
    // cant sort by these fields atm because of
    // how aggregation is done in the backend
    if (
      sortBy === 'PLAYER' ||
      sortBy === 'TEAM' ||
      sortBy === 'POSITION' ||
      !sortBy
    )
      return

    if (sortBy === sortVariables.sortBy) {
      sortVariables.sortDir === 'DESC'
        ? setSortVariables({ offset: 0, sortBy, sortDir: 'ASC' })
        : setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    } else {
      setSortVariables({ offset: 0, sortBy, sortDir: 'DESC' })
    }
  }

  const createHeaders = () => (
    <Table.Row>
      {headers.map(header => (
        <Table.HeaderCell
          key={header.headerText}
          onClick={() => handleNewVariables(header.sortString)}
        >
          {header.headerText}
        </Table.HeaderCell>
      ))}
    </Table.Row>
  )

  const createCells = () =>
    data.map(item => (
      <Table.Row key={item.id}>
        {headers.map(stat => {
          return <Table.Cell key={stat.prop}>{item[stat.prop]}</Table.Cell>
        })}
      </Table.Row>
    ))

  return (
    <div>
      <Header>{title}</Header>
      <Table celled>
        <Table.Header>{createHeaders()}</Table.Header>
        <Table.Body>{createCells()}</Table.Body>
      </Table>
    </div>
  )
}

export default StatsTable
