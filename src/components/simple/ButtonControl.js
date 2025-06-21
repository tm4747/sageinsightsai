import styles from './styles/ButtonControl.module.css';


const ButtonControl = ({ onPress, text, type = "" }) => {
    let buttonClasses = `${styles.button} `;
    if(type){
        if(type === "submitRequest"){
            buttonClasses += ` ${styles.greenButton}`;
        } else if(type === "cancelScroll"){
            buttonClasses += ` ${styles.cancelScroll}`;
        }
    }
   

//   let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
//   inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

    return(
        <button className={buttonClasses} onClick={onPress}>{text}</button>
    );
}

export default ButtonControl;
