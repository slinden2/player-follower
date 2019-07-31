import styled from 'styled-components'
import colors from '../colors'

const SCardContainer = styled.div`
  background: ${colors.grey2};
  padding: 1px 10px;
  border-radius: 10px;

  .view-selector {
    text-align: center;
    margin: 5px auto;

    & span {
      padding: 0 10px;
      border-right: 2px solid ${colors.grey4};
    }

    & span:last-child {
      border-right: 0px;
    }
  }
`

export default SCardContainer
