import { useState } from 'react';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';
import TextInputForm from '../components/complex/TextInputForm';
import { validateCharacterLength } from '../lib/ValidationHelper';
import ProgressBar from '../components/simple/ProgressBar';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const initialRatingValue = 5;
  const override = false;
  const basicTextErrorMessage = "Entered value must be at least 2 characters.";

  const [decisionText, setDecisionText] = useState(override ? "Where to move": "");
  // TODO: may not need this.  Steps might be enough
  const [decisionTextError, setDecisionTextError] = useState(override ? true : false);
  const [potentialOptions, setPotentialOptions] = useState(override ? [
    {name: "NY", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}, 
    {name: "SLC", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}, 
    {name: "Montana", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}] : []);
  const [potentialOptionText, setPotentialOptionText] = useState("");
  const [potentialOptionTextError, setPotentialOptionTextError] = useState(false);
  const [decisionFactors, setDecisionFactors] = useState(override ? [
    {name: "Wide Open Space", rating: initialRatingValue}, 
    {name: "Culture", rating: initialRatingValue}, 
    {name: "Job Opportunities", rating: initialRatingValue}] : []);
  const [decisionFactorsText, setDecisionFactorsText] = useState("");
  const [decisionFactorsTextError, setDecisionFactorsTextError] = useState(false);
  const [step, setStep] = useState(override ? 3 : 1);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(basicTextErrorMessage);


  
  /********* JAVASCRIPT HELPER FUNCTIONS **********/
  const resetErrors = () => {
    setPotentialOptionTextError(false);
    setDecisionFactorsTextError(false);
    setDecisionTextError(false);
    setCurrentErrorMessage(basicTextErrorMessage);
  }
  const resetState = () => {
    setDecisionText("");
    resetErrors();
    setPotentialOptions([]);
    setDecisionFactors([]);
    setStep(1);
  };

  const handleSubmitPotentialOption = () => {
    const validatedInput = validateCharacterLength(potentialOptionText, 2);
    if(!validatedInput){
      setPotentialOptionTextError(true);
      return false;
    }
    resetErrors();
    // need number of decisionFactors to set potentialOptions
    const numberOfDecisionFactors = decisionFactors.length;
    const initialRatings = [];
    for(let x = 0; x < numberOfDecisionFactors; x++){
      initialRatings.push(initialRatingValue);
    }
    setPotentialOptions(prevItems => [
      ...prevItems,
      {
        name: validatedInput,
        ratings: initialRatings
      }
    ]);
    setPotentialOptionText("");
  };

  const handleSubmitDecisionFactors = () => {
    const validatedInput = validateCharacterLength(decisionFactorsText, 2);
    if(!validatedInput){
      setDecisionFactorsTextError(true);
      return false;
    }
    setDecisionFactorsTextError(false);
    console.log('decisionFactorsText', validatedInput);
    const numberOfPotentialOptions = potentialOptions.length;
    setDecisionFactors(prevItems => [
      ...prevItems,
      {
        name: validatedInput,
        rating: initialRatingValue
      }
    ]);
    // must update potentialOptions[each].ratings when a new decisionFactors is added
    const updatedPotentialOptions = potentialOptions;
    for(let x = 0; x < numberOfPotentialOptions; x++){
      updatedPotentialOptions[x].ratings.push(initialRatingValue);
    }
    setPotentialOptions(updatedPotentialOptions);
    setDecisionFactorsText("");
  };

  const handleSetDecisionText = (value) =>{
    setDecisionText(value)
  }

  const handleDecisionDone = () => {
     if(!decisionText || !validateCharacterLength(decisionText, 3)){
      setCurrentErrorMessage("You must enter a decision.");
      setDecisionTextError(true);
    } else {
      setStep(step + 1);
      resetErrors();
    }
  }

  const handleDecisionOptionTextDone = () => {
     // todo: here is where you override error message - if no what matters are entered
    if(!potentialOptions || potentialOptions.length < 2){
      setCurrentErrorMessage("You must enter at least 2 Potential Options.");
      setPotentialOptionTextError(true);
    } else {
      setStep(step + 1);
      resetErrors();
    }
  }

  const handleSetDecisionFactorsTextDone = () => {
    // TODO: here is where you override error message - if no what matters are entered
    if(!decisionFactors || decisionFactors.length < 2){
      // set custom error
      setCurrentErrorMessage("You must enter at least 2 Decision Factors.");
      setDecisionFactorsTextError(true);
    } else {
      setStep(step + 1);
      resetErrors();
    }
  }


  /********* DISPLAY FUNCTIONS **********/
  const progressBar = <ProgressBar totalStages={5} currentStage={step - 1} />;

  const decisionTextDisplay =  decisionText && step > 1 ? <p>{`Decision: ${decisionText}`}</p> : "";
  const potentialOptionsDisplay = potentialOptions && potentialOptions.length > 0 ? 
    (
      <p>Potential Options:
        {potentialOptions.map((item, index) => (
          <span key={index}>{index !== 0 ? ", ": ""} {item.name}</span>
        ))}
      </p>
    ) : "";
  const decisionFactorsDisplay = decisionFactors && decisionFactors.length > 0 ? 
    (
      <p>Decision Factors:
        {decisionFactors.map((item, index) => (
          <span key={index}>{index !== 0 ? ", ": ""} {item.name}</span>
        ))}
      </p>
    ) : "";
    
  const dataPreview = decisionTextDisplay ? 
    <div className={"commonDiv bold"}>
      {potentialOptionText}
      {decisionTextDisplay}
      {potentialOptionsDisplay}
      {decisionFactorsDisplay}
    </div> : "";

  const temporaryStepButtons = <>
     <button className={"inline-button btnPrimary"} onClick={() => setStep(step - 1)}>▼</button> {step}
     <button className={"inline-button btnPrimary"} onClick={() => setStep(step + 1)}>▲</button>
  </>

  /*** STEP 1 ***/
  const setDecisionStep = step === 1 ? (
    <TextInputForm 
      formLabel={"Describe your decision:"} 
      textForFlashing={decisionText ? "Decision: " + decisionText : ""}
      fieldName={"Decision"} 
      fieldValue={decisionText}
      fieldDescription={'Start by typing in the decision you`re trying to make — for example, "Where should I move?" or "Which job should I take?'} 
      setFieldValue={handleSetDecisionText}
      submitForm={handleDecisionDone} 
      submitButtonText={"Decision is done!"} 
      addedStyles={{width:"100%"}}
      isError={decisionTextError}
      errorMessage={currentErrorMessage}  
    />
  ) : "";

  /*** STEP 2 ***/
    const setDecisionOptionsStep = step === 2 ? (
    <TextInputForm 
      formLabel={"Please enter your Potential Options:"} 
      textForFlashing={potentialOptionText ? "Potential Option: " + potentialOptionText : ""}
      fieldName={"Decision Option"} 
      fieldValue={potentialOptionText} 
      fieldDescription={"Each of these represents one possible choice or answer to the decision you're trying to make."}
      setFieldValue={(value) => setPotentialOptionText(value)}
      addButtonFunction={handleSubmitPotentialOption}
      addButtonText={"Add Potential Option"}
      submitForm={handleDecisionOptionTextDone} 
      submitButtonText={"Done with Potential Options"} 
      resetButton={resetState}
      resetButtonText={"Start Over"}
      addedStyles={{width:"100%"}}
      isError={potentialOptionTextError}
      errorMessage={currentErrorMessage}
      />
  ) : "";

  /*** STEP 3 */  
   const setDecisionFactorsStep = step === 3 ? (
    <TextInputForm 
      formLabel={"Please enter a Decision Factor:"} 
      textForFlashing={decisionFactorsText ? "Decision Factor: " + decisionFactorsText : ""}
      fieldName={"Decision Factor"} 
      fieldValue={decisionFactorsText} 
      fieldDescription={"Decision Factors are the things or criteria that matter regarding the decision. They help define what makes one potential choice better than another."}
      setFieldValue={(value) => setDecisionFactorsText(value)}
      handleClear={()=> setDecisionFactorsText("")}
      isClearButton={decisionFactorsText}
      addButtonFunction={handleSubmitDecisionFactors}
      addButtonText={"Add Decision Factor"}
      submitForm={handleSetDecisionFactorsTextDone} 
      submitButtonText={"Done with Decision Factors"} 
      resetButton={resetState}
      resetButtonText={"Start Over"}
      addedStyles={{width:"100%"}}
      isError={decisionFactorsTextError}
      errorMessage={currentErrorMessage}/>
  ) : "";


  /*** STEP 4 */  
  const step4Or5Text = step === 4 ? 
    "For each Decision Factor, please adjust Importance with 10 being most important. " : 
    ( step === 5 ? "Please score how well each Potential Option rates for each Decision Factor." : "");

  const step4Or5ButtonText = step === 4 ? 
    "Done Rating Decision Factor" : 
    ( step === 5 ? "Show My Results!" : "");
  const tableDirections = step === 4 || step === 5 ? 
  <>
   <p className={"notice bold larger-text"}>{step4Or5Text}
    <button className={"inline-button btnPrimary"} onClick={() => setStep(step + 1)}>{step4Or5ButtonText}</button></p>
  </>
   : ""; 

  const tableDisplay = step >= 4 ? 
    <DataTable
      potentialOptions={potentialOptions}
      decisionFactors={decisionFactors}
      setDecisionFactors={setDecisionFactors}
      setPotentialOptions={setPotentialOptions}
      currentStep={step}
    /> : "";


  /*** BUTTONS ***/
  const startOverButton = step >= 4 ? (
      <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
  ) : "";


  if (!featureFlagShowBeta) {
    return (
      <div className="content">
        <div className={"formDiv"}>
          <div className={"border-bottom"}>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className={"formDiv"}>
        {progressBar}
        {step >= 4 ? dataPreview : ""}
        {setDecisionStep}
        {setDecisionOptionsStep}
        {setDecisionFactorsStep}
        {process.env.REACT_APP_ENV === "dev" ? temporaryStepButtons : ""}
      </div>
      {step > 1 ? 
      <div className={"commonDiv"}>
        <div className={"resultsDiv"}>
          <div className={"innerResultsDiv"}>
            {step < 4 ? <span className={"larger-text"}>{dataPreview}</span> : ""}
            {tableDirections}
            {tableDisplay}
          </div>
        </div>
        <div className={"commonDiv"}>
          <div className={"button-row"}>
            {startOverButton}
          </div>
        </div>
      </div> : ""}
      
    </div>
  );
}

export default DifficultChoiceMaker;
