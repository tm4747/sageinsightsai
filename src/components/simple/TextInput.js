import styles from './styles/TextInput.module.css';
import ClearButton from './ClearButton';


const TextInput = ({
    labelText = "",
    id = "",
    enteredValue, 
    handleOnChange, 
    isError, 
    errorMessage, 
    validData, 
    halfWidth = false, 
    isDisabled = false, 
    handleClear,
    isClearButton = false,
    addedStyles = ""
}) => {

  let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
  inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

  const errorTextDisplay = errorMessage ? <p className={"notice error"}>{errorMessage}</p> : "";
  const clearButton = isClearButton ? <ClearButton onPress={handleClear} /> : "";
  const labelDisplay = labelText ? <label htmlFor={id} style={{display: "block"}}>{labelText}</label> : "";


    return(
        <div className={"commonDiv"}>
            {labelDisplay}
            <input 
                id={id}
                className={inputClasses} 
                value={enteredValue} 
                onChange={handleOnChange} 
                type="text"
                disabled={isDisabled}
                styles={{width:"1000px"}}
                />
                {clearButton}
            {errorTextDisplay}
        </div>
    );
}

export default TextInput;
