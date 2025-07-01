import FlashingText from "../FlashingText";
import TextInput from "../simple/TextInput";
import ButtonControl from "../simple/ButtonControl";


const TextInputForm = ({
    textForFlashing,
    formLabel, 
    fieldName,
    fieldValue,
    validData=false,
    setFieldValue, 
    isError=false,
    errorMessage="",
    submitForm,
    submitButtonText,
    isDisabled=false,
    handleClear=() => {},
    isClearButton=false,
    addedStyles={},
    limitWidth=""
}) => {
  const enteredDecisionDisplay = !fieldValue ? <span className="bold">{formLabel}</span> : 
    <FlashingText interval={750} text={textForFlashing} boldText={true}/>;

  const textDisplay = <TextInput 
    id={`set${fieldName}`}
    enteredValue={fieldValue}
    handleOnChange={(e) => setFieldValue(e.target.value)}
    isError={isError}
    errorMessage={errorMessage}
    validData={validData}
    halfWidth={true}
    isDisabled={isDisabled}
    handleClear={handleClear}
    isClearButton={isClearButton}
    addedStyles={addedStyles}
  />;
  
  const setDecisionButton = 
    <ButtonControl 
      isDisabled={isDisabled}
      onPress={submitForm} 
      text={submitButtonText} 
      variation={"submitRequest"} 
      addedStyles={{}}
    />

    return (
        // <div className={"formDiv"} style={{maxWidth:"600px", margin:"auto"}}>
        <div className={"formDiv"}>
        <div className={"commonDiv"}>
          {enteredDecisionDisplay}
        </div>
          {textDisplay}
        <div className={"commonDiv"}>
          {setDecisionButton}     
        </div>
      </div>
    );
}

export default TextInputForm;