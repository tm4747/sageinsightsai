import logo from '../logo-gear.png';
import './styles/AILogo.css';

const AILogo = ({size, transparency}) => {
  return (
  <>
  <img src={logo} className={"App-logo"} alt="logo" style={{height:size}} />
  </>
  )
}

export default AILogo;