import styled, { css } from 'styled-components'
import Button from '../../elements/Button'
import breakpoints from '../../../styles/breakpoints'
import colors from '../../../styles/colors'

export const ShowFiltersButton = styled(Button)`
  font-size: 0.75rem;
  padding: 5px;
  margin: 10px auto;
  display: block;
  font-size: 1rem;

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

export const cardStyles = css`
  width: 100%;
  min-height: 100%;
  position: absolute;
  border: 1px solid ${colors.grey2};
  border-radius: 10px;
  background: ${colors.grey4};
  box-shadow: 1px 1px 3px 2px rgba(0, 0, 0, 0.15);
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 600ms ease-in-out;
`

export const FrontContainer = styled.div`
  ${cardStyles}

  padding-top: 10px;

  transform: rotateY(0deg);

  ${({ isFlipped }) =>
    isFlipped &&
    css`
      transform: rotateY(-180deg);
    `}
`

export const BackContainer = styled.div`
  ${cardStyles}

  transform: rotateY(180deg);

  ${({ isFlipped }) =>
    isFlipped &&
    css`
      transform: rotateY(0);
    `}
`
