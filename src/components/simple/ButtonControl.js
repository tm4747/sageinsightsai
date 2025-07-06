import styles from './styles/ButtonControl.module.css';


const ButtonControl = ({ onPress, text, variation = "", type = "", isDisabled = false, addedStyles = null}) => {
    let buttonClasses = `button ${styles.button} `;

    switch (variation) {
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
        case "btnPrimary":
            buttonClasses += ` ${styles.blueButton}`;
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
            style={addedStyles}
            type={type}
        >{text}</button>
    );
}

export default ButtonControl;
