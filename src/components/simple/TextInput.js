import styles from './styles/TextInput.module.css';


const TextInput = ({enteredValue, handleOnChange, isError, errorMessage, validData, setWidth = ""}) => {

  const inputClasses = isError ? `${styles.errorTextInput} ${styles.textInput}` : 
    (validData ? `${styles.inputSuccess} ${styles.textInput}` : styles.textInput);

    const inlineStyles = setWidth ? {width: setWidth} : "";


    return(
        <div className={"standardVerticalPadding"}>
            <input 
                className={inputClasses} 
                value={enteredValue} 
                onChange={handleOnChange} 
                type="text"
                style={inlineStyles}
                />
            <p className={"notice error"}>{errorMessage}</p>
        </div>
    );
}

export default TextInput;
