import AILogo from '../simple/AILogo';
import styles from './styles/LoadingModal.module.css';

const LoadingModal = ({ isLoading, type }) => {

  const message = type === "lambda" ? <>
    <h3 className={styles.inlineHeader}>Please be patient as AWS Lambda</h3> 
        <img
        src="/Lambda.svg"
        alt="AWS Lambda Logo"
        className={styles.image}
      />
      <h3 className={styles.inlineHeader}>fetches results...</h3>
  </> : <h3 className={styles.inlineHeader}>Loading...</h3>;

  return (
    <div className={styles.modalBackgroundDiv}
      style={{
        display: isLoading ? 'flex' : 'none',
        opacity: isLoading ? 1 : 0,
      }}>
      <div className={styles.modalForegroundDiv}>
        <AILogo size="3.5rem" transparency={true} />
        {message}
      </div>
    </div>
  );
};

export default LoadingModal;
