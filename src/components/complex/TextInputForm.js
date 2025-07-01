import FlashingText from "../FlashingText";
import TextInput from "../simple/TextInput";
import ButtonControl from "../simple/ButtonControl";


const TextInputForm = ({
    formLabel, 
    fieldName,
    fieldValue,
    setFieldValue, 
    submitForm,
    submitButtonText  
}) => {
    const textForFlashing = fieldValue ? `${fieldName}: ` + fieldValue : "";
  const enteredDecisionDisplay = !fieldValue ? <span className="bold">{formLabel}</span> : 
    <FlashingText interval={750} text={textForFlashing} boldText={true}/>;
  const textDisplay = <TextInput 
    id={`set${fieldName}`}
    handleOnChange={(e) => setFieldValue(e.target.value)}
    enteredValue={fieldValue}
    addedStyles={{width: "100%"}}
  />;
  const setDecisionButton = 
    <ButtonControl 
      onPress={submitForm} 
      text={submitButtonText} 
      variation={"submitRequest"} 
      addedStyles={{width: "100%"}}
    />

    return (
        <div className={"formDiv"} style={{maxWidth:"600px", margin:"auto"}}>
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