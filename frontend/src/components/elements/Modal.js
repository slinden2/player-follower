import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import colors from '../../styles/colors'
import { RemoveScroll } from 'react-remove-scroll'
import { ModalContext } from '../../contexts/ModalContext'
import LoginForm from '../user/LoginForm'
import SignupForm from '../user/SignupForm'

const ScreenOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  z-index: 1100;
  display: ${props => (props.open ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: 530px;
  height: 530px;
  background-color: ${colors.grey2};
  z-index: 1101;
  border-radius: 10px;
  position: relative;
  padding: 10px 16px 10px 16px;
`

const CloseButton = styled.div`
  position: absolute;
  right: -13px;
  top: -15px;
  pointer-events: all;
  z-index: 1101;
  width: 50px;
  height: 50px;
  text-align: center;
  color: ${colors.white1};
  font-size: 3rem;
  background-color: ${colors.red1};
  border: 1px solid ${colors.grey3};
  border-radius: 50%;
  padding: 0px;
  line-height: 2.5rem;
  cursor: pointer;
  transform: rotate(45deg);
`

const ModalNoRouter = ({ history }) => {
  const { open, type, closeModal } = useContext(ModalContext)

  return (
    <RemoveScroll enabled={open} removeScrollBar={false}>
      <ScreenOverlay open={open}>
        <Container>
          <CloseButton onClick={closeModal}>+</CloseButton>
          {type === 'log in' && (
            <LoginForm history={history} closeModal={closeModal} />
          )}
          {type === 'sign up' && <SignupForm history={history} />}
        </Container>
      </ScreenOverlay>
    </RemoveScroll>
  )
}

export default withRouter(ModalNoRouter)
