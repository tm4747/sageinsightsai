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
    fieldDescription = "",
    halfWidth = false, 
    isDisabled = false, 
    handleClear,
    isClearButton = false,
    addedStyles = ""
}) => {
  
  const validError = isError && errorMessage;
  let inputClasses = halfWidth ? `${styles.textInput} ${styles.halfWidth}` : styles.textInput;
  inputClasses += isError ? ` ${styles.errorTextInput}` : (validData ? ` ${styles.inputSuccess}` : "");

  const errorTextDisplay = validError ? <p className={"notice error"}>{errorMessage}</p> : "";
  const fieldDescriptionDisplay = !validError && fieldDescription ? <p className={"notice"} style={{paddingTop:"1rem"}}>{fieldDescription}</p> : "";
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
            {fieldDescriptionDisplay}
            {errorTextDisplay}
        </div>
    );
}

export default TextInput;
