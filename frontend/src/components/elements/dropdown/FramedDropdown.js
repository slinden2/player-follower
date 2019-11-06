import React from 'react'
import styled from 'styled-components'
import DropdownMenu from './DropdownMenu'
import colors from '../../../styles/colors'

const Container = styled.fieldset`
  font-size: 0.875rem;
  border: 2px solid ${colors.grey1};
  border-radius: 10px;
  margin: 5px;
`

const FieldsetTitle = styled.legend`
  border: 2px solid ${colors.grey1};
  border-radius: 10px;
  background-color: ${colors.grey1};
  padding: 5px;
`

const FramedDropdown = ({ title, fields }) => {
  const newFields = Array.isArray(fields) ? fields : [fields]

  return (
    <Container>
      <FieldsetTitle>{title}</FieldsetTitle>
      {newFields.map((field, i) => (
        <DropdownMenu key={i} {...field} />
      ))}
    </Container>
  )
}

export default FramedDropdown
