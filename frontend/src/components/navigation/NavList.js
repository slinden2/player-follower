import React, { useContext, useState } from 'react'
import styled, { css } from 'styled-components'
import NavListItem from './NavListItem'
import breakpoints from '../../styles/breakpoints'
import { AuthContext } from '../../contexts/AuthContext'
import { ModalContext } from '../../contexts/ModalContext'
import { showNavItem } from '../../utils'
import colors from '../../styles/colors'
import { HamburgerContext } from '../../contexts/HamburgerContext'

const Container = styled.nav`

  ${({ right }) =>
    right &&
    css`
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: 1.875rem;
        left: 0;
        top: -10px;
        height: 5px;
        width: 95%;
        border-radius: 2px;
        background-color: ${colors.grey2};
      }
    `}
  

  @media ${breakpoints.showDesktopNavi} {
    all: unset;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    ${props => props.right && 'margin-left: auto'}

    &::before {
      all: unset;
    }
  }
`

const StyledNavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;

  @media ${breakpoints.showDesktopNavi} {
    flex: 1;
    display: flex;
    align-items: center;
  }
`

const NavList = ({ items, right }) => {
  const { token, logoutUser, user } = useContext(AuthContext)
  const { openModal } = useContext(ModalContext)
  const { closeNavi } = useContext(HamburgerContext)
  const [openedElement, setOpenedElement] = useState(null)

  const functionMap = {
    handleLogout: {
      onClick: () => {
        logoutUser()
        closeNavi()
      },
    },
    handleOpenModal: {
      onClick: type => openModal(type),
    },
  }

  let username

  if (user.data.me) username = user.data.me.username

  const createItems = () => {
    const navItems = items.map(
      (item, i) =>
        showNavItem(item, token) && (
          <NavListItem
            key={i}
            ordinal={i}
            {...item}
            // This must be before function map otherwise it overrides that.
            onClick={closeNavi}
            {...functionMap[item.bindTo]}
            username={username}
            openedElement={openedElement}
            setOpenedElement={setOpenedElement}
          />
        )
    )

    return navItems
  }

  return (
    <Container right={right}>
      <StyledNavList>{createItems()}</StyledNavList>
    </Container>
  )
}

export default NavList
