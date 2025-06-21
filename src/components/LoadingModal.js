import AILogo from './AILogo';
import styles from './styles/LoadingModal.module.css';

const LoadingModal = ({ isLoading }) => {
  return (
    <div className={styles.modalBackgroundDiv}
      style={{
        display: isLoading ? 'flex' : 'none',
        opacity: isLoading ? 1 : 0,
      }}>
      <div className={styles.modalForegroundDiv}>
        <AILogo size="3.5rem" transparency={true} />
        <h3 className={styles.inlineHeader}>Please be patient as Lambda</h3> 
        <img
          src="/Lambda.svg"
          alt="AWS Lambda Logo"
          className={styles.image}
        />
        <h3 className={styles.inlineHeader}>fetches results...</h3>
      </div>
    </div>
  );
};

export default LoadingModal;
