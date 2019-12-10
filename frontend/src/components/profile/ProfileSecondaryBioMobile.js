import React from 'react'
import styled from 'styled-components'
import colors from '../../styles/colors'

const ContainerMobile = styled.div`
  width: 100%;
  background-color: ${colors.grey1};
  border-radius: 10px;
  padding: 10px;
  font-size: 0.875rem;
`

const DataTableMobile = styled.table`
  width: 100%;
  border-radius: 10px;
  border-collapse: collapse;
  border-spacing: 0;
`

const DataTableBody = styled.tbody``

const DataTableRow = styled.tr``

const DataTableCell = styled.td`
  padding: 0.375rem;
  border: 1px solid ${colors.grey4};
`

const Title = styled.span`
  display: inline-block;
  min-width: 5rem;
  color: ${colors.grey5};
  text-transform: uppercase;
`

const Content = styled.span`
  text-transform: uppercase;
`

export const Age = styled.span`
  margin-right: 8px;
`

export const BirthDate = styled.span`
  color: ${colors.grey5};
`

const ProfileSecondaryBioMobile = ({ data }) => {
  return (
    <ContainerMobile>
      <DataTableMobile>
        <DataTableBody>
          {data.titleArray.map((row, i) => (
            <DataTableRow key={i}>
              {Array.isArray(row) ? (
                row.map(cell => (
                  <DataTableCell key={cell}>
                    {data.headers[cell].text && (
                      <Title>{data.headers[cell].text}</Title>
                    )}
                    <Content>{data[cell]}</Content>
                  </DataTableCell>
                ))
              ) : (
                <DataTableCell colSpan={2}>
                  {data.headers[row].text && (
                    <Title>{data.headers[row].text}</Title>
                  )}
                  <Content>{data[row]}</Content>
                </DataTableCell>
              )}
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTableMobile>
    </ContainerMobile>
  )
}

export default ProfileSecondaryBioMobile
