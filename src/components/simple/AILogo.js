import logo from '../../logo-gear.png';
import styles from './styles/AILogo.module.css';

const AILogo = ({size, transparency}) => {
  return (
  <>
  <img src={logo} className={styles.AppLogo} alt="logo" style={{height:size}} />
  </>
  )
}

export default AILogo;