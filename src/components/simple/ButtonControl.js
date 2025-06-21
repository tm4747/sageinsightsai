import styles from './styles/ButtonControl.module.css';


const ButtonControl = ({ type = "", onPress, text }) => {
    
    let buttonClasses = styles.button;

    if(type === "submitRequest"){
        buttonClasses += ` ${styles.greenButton}`;
    }

//   let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
//   inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

    return(
        <button className={buttonClasses} onClick={onPress}>{text}</button>
    );
}

export default ButtonControl;
