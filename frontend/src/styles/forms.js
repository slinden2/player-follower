import styled, { css } from 'styled-components'
import { Form, Field } from 'formik'
import colors from './colors'

export const fieldStyling = css`
  height: 45px;
  border-radius: 50px;
  background-color: ${colors.grey4};
  border: 3px solid ${colors.grey3};
  color: ${colors.white1};
  padding-right: 40px;
  font-family: 'Quicksand', Arial;
  font-size: 1.25rem;
  outline-width: 0px;
  text-indent: 0.75rem;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.white1};
    box-shadow: 0 0 5px ${colors.white1};
  }
`

export const Container = styled.div`
  text-align: center;
`

export const SForm = styled(Form)`
  display: block;
  width: 100%;
`

export const SField = styled.div`
  margin: 16px auto;
  width: 100%;
  text-align: left;
`

export const Label = styled.label`
  display: block;
  margin: 10px 0 10px 0;
`

export const TextRow = styled.p`
  ${({ color }) => color && `color: ${color}`}
`

export const Input = styled(Field)`
  display: block;
  width: 100%;
  padding-right: 20px;
  ${fieldStyling}
`

export const TextArea = styled(Field)`
  display: block;
  width: 100%;
  height: 200px;
  border-radius: 15px;
  background-color: ${colors.grey4};
  border: 3px solid ${colors.grey3};
  color: ${colors.white1};
  padding: 5px 10px;
  font-family: 'Quicksand', Arial;
  font-size: 1rem;
  outline-width: 0px;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.white1};
    box-shadow: 0 0 5px ${colors.white1};
  }
`

export const Checkbox = styled(Field)`
  vertical-align: middle;
`
