import styles from './styles/ButtonControl.module.css';


const ButtonControl = ({ onPress, text, type = "", isDisabled = false}) => {
    let buttonClasses = `${styles.button} `;
    
    switch (type) {
        case "submitRequest":
            buttonClasses += ` ${styles.greenButton}`;
            break;
        case "cancelScroll":
            buttonClasses += ` ${styles.cancelScroll}`;
            break;
        case "resetButton":
            buttonClasses += ` ${styles.redButton}`;
            break;
        case "progressionButton":
            buttonClasses += ` ${styles.yellowButton}`;
            break;
        case "secondaryFetch":
            buttonClasses += ` ${styles.cancelScroll}`;
            buttonClasses += ` ${styles.purpleButton}`;
            break;
        default:
            break;
    }

   

    return(
        <button 
            className={buttonClasses} 
            onClick={onPress}
            disabled={isDisabled}
        >{text}</button>
    );
}

export default ButtonControl;
