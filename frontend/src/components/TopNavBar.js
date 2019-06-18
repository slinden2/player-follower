import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as S from '../styles'

const TopNavBar = () => {
  return (
    <S.RedBorder>
      <S.TopNavBar>
        <li>
          <Link to="/">All Players</Link>
        </li>
        <li>
          <Link to="/stats">Stats</Link>
        </li>
        <li>
          <Link to="/standings">Standings</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </S.TopNavBar>
    </S.RedBorder>
  )
}

export default TopNavBar
