import styles from './styles/ConfirmModal.module.css';

const ConfirmModal = ({ isVisible, message, onConfirm, onCancel }) => {
  return (
    <div
      className={styles.modalBackgroundDiv}
      style={{
        display: isVisible ? 'flex' : 'none',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className={styles.modalBox}>
        <p>{message}</p>
        <div className={styles.buttonRow}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Yes</button>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
