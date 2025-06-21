import styles from './styles/TextInput.module.css';


const TextInput = ({enteredValue, handleOnChange, isError, errorMessage, validData, halfWidth = false, isDisabled = false}) => {

  let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
  inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

  const errorTextDisplay = errorMessage ? <p className={"notice error"}>{errorMessage}</p> : "";

    return(
        <div className={"commonDiv"}>
            <input 
                className={inputClasses} 
                value={enteredValue} 
                onChange={handleOnChange} 
                type="text"
                disabled={isDisabled}
                />
            {errorTextDisplay}
        </div>
    );
}

export default TextInput;
