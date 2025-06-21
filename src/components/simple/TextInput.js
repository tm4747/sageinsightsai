import styles from './styles/TextInput.module.css';


const TextInput = ({enteredValue, handleOnChange, isError, errorMessage, validData, halfWidth = false}) => {

  let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
  inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");


    return(
        <div className={"standardVerticalPadding"}>
            <input 
                className={inputClasses} 
                value={enteredValue} 
                onChange={handleOnChange} 
                type="text"
                />
            <p className={"notice error"}>{errorMessage}</p>
        </div>
    );
}

export default TextInput;
