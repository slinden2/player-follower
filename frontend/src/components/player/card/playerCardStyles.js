import { css } from 'styled-components'
import colors from '../../../styles/colors'

export const commonStyles = css`
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
