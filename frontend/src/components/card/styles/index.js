import styled, { css } from 'styled-components'
import Button from '../../elements/Button'
import breakpoints from '../../../styles/breakpoints'

export const ShowFiltersButton = styled(Button)`
  font-size: 0.75rem;
  padding: 5px;
  margin: 10px auto;
  display: block;

  @media ${breakpoints.showDesktopNavi} {
    display: none;
  }
`

export const FilterContainer = styled.div`
  height: auto;
  max-height: 200px;
  ${({ isVisible }) =>
    !isVisible &&
    css`
      transition: max-height 250ms ease-in-out 150ms, opacity 150ms ease-in-out,
        transform 150ms ease-in-out;
      max-height: 0;
      opacity: 0;
      transform: translateX(-100%);
    `};

  ${({ isVisible }) =>
    isVisible &&
    css`
      transition: max-height 100ms ease-in, opacity 250ms ease-in-out 250ms,
        transform 250ms ease-in-out 150ms;
      max-height: 500px;
      opacity: 1;
      transform: translateX(0);
    `};

  @media ${breakpoints.showDesktopNavi} {
    max-height: 200px;
    transform: none;
    opacity: 1;
    display: flex;
    justify-content: center;
  }
`

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 15px;
`