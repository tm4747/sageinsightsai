import styles from './styles/TextInput.module.css';
import ClearButton from './ClearButton';


const TextInput = ({
    enteredValue, 
    handleOnChange, 
    isError, 
    errorMessage, 
    validData, 
    halfWidth = false, 
    isDisabled = false, 
    handleClear,
    isClearButton = false 
}) => {

  let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
  inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

  const errorTextDisplay = errorMessage ? <p className={"notice error"}>{errorMessage}</p> : "";
  const clearButton = isClearButton ? <ClearButton onPress={handleClear} /> : "";


    return(
        <div className={"commonDiv"}>
            <input 
                className={inputClasses} 
                value={enteredValue} 
                onChange={handleOnChange} 
                type="text"
                disabled={isDisabled}
                />
                {clearButton}
            {errorTextDisplay}
        </div>
    );
}

export default TextInput;
