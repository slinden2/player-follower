import AUT from '../assets/flag-aut-min.svg'
import CAN from '../assets/flag-can-min.svg'
import CHE from '../assets/flag-che-min.svg'
import CZE from '../assets/flag-cze-min.svg'
import DEU from '../assets/flag-deu-min.svg'
import DNK from '../assets/flag-dnk-min.svg'
import FIN from '../assets/flag-fin-min.svg'
import FRA from '../assets/flag-fra-min.svg'
import LVA from '../assets/flag-lva-min.svg'
import NOR from '../assets/flag-nor-min.svg'
import RUS from '../assets/flag-rus-min.svg'
import SVK from '../assets/flag-svk-min.svg'
import SWE from '../assets/flag-swe-min.svg'
import USA from '../assets/flag-usa-min.svg'

const FLAGS = {
  AUT,
  CAN,
  CHE,
  CZE,
  DEU,
  DNK,
  FIN,
  FRA,
  LVA,
  NOR,
  RUS,
  SVK,
  SWE,
  USA,
}

export const getFlag = code => FLAGS[code.toUpperCase()]
