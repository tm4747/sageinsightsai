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
  const [whatMatters, setWhatMatters] = useState(override ? [
    {name: "Wide Open Space", rating: initialRatingValue}, 
    {name: "Culture", rating: initialRatingValue}, 
    {name: "Job Opportunities", rating: initialRatingValue}] : []);
  const [whatMattersText, setWhatMattersText] = useState("");
  const [whatMattersTextError, setWhatMattersTextError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(override ? 3 : 1);
  const [currentErrorMessage, setCurrentErrorMessage] = useState(basicTextErrorMessage);


  
  /********* JAVASCRIPT HELPER FUNCTIONS **********/
  const resetErrors = () => {
    setPotentialOptionTextError(false);
    setWhatMattersTextError(false);
    setDecisionTextError(false);
    setCurrentErrorMessage(basicTextErrorMessage);
  }
  const resetState = () => {
    setDecisionText("");
    resetErrors();
    setPotentialOptions([]);
    setWhatMatters([]);
    setShowResults(false);
    setStep(1);
  };

  const handleSubmitPotentialOption = () => {
    const validatedInput = validateCharacterLength(potentialOptionText, 2);
    if(!validatedInput){
      setPotentialOptionTextError(true);
      return false;
    }
    setPotentialOptionTextError(false);
    // need number of whatMatters to set potentialOptions
    const numberOfWhatMatters = whatMatters.length;
    const initialRatings = [];
    for(let x = 0; x < numberOfWhatMatters; x++){
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

  const handleSubmitWhatMatters = () => {
    const validatedInput = validateCharacterLength(whatMattersText, 2);
    if(!validatedInput){
      setWhatMattersTextError(true);
      return false;
    }
    setWhatMattersTextError(false);
    console.log('whatMattersText', validatedInput);
    const numberOfPotentialOptions = potentialOptions.length;
    setWhatMatters(prevItems => [
      ...prevItems,
      {
        name: validatedInput,
        rating: initialRatingValue
      }
    ]);
    // must update potentialOptions[each].ratings when a new whatMatters is added
    const updatedPotentialOptions = potentialOptions;
    for(let x = 0; x < numberOfPotentialOptions; x++){
      updatedPotentialOptions[x].ratings.push(initialRatingValue);
    }
    setPotentialOptions(updatedPotentialOptions);
    setWhatMattersText("");
  };

  const handleSetDecisionText = (value) =>{
    setDecisionText(value)
  }

  const handleDecisionDone = () => {
    console.log("handle dec done");
     if(!decisionText || !validateCharacterLength(decisionText, 3)){
      console.log("here1");
      setCurrentErrorMessage("You must enter a decision.");
      setDecisionTextError(true);
    } else {
      console.log("here2");
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
    setStep(step + 1);  
  }

  const handleSetWhatMattersTextDone = () => {
    // TODO: here is where you override error message - if no what matters are entered
    if(!whatMatters || whatMatters.length < 2){
      // set custom error
      setCurrentErrorMessage("You must enter at least 2 Decision Factors.");
      setWhatMattersTextError(true);
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
  const whatMattersDisplay = whatMatters && whatMatters.length > 0 ? 
    (
      <p>Decision Factors:
        {whatMatters.map((item, index) => (
          <span key={index}>{index !== 0 ? ", ": ""} {item.name}</span>
        ))}
      </p>
    ) : "";
    
  const dataPreview = decisionTextDisplay ? 
    <div className={"commonDiv bold"}>
      {decisionTextDisplay}
      {potentialOptionsDisplay}
      {whatMattersDisplay}
    </div> : "";

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
      formLabel={"Please enter your potential options:"} 
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
   const setWhatMattersStep = step === 3 ? (
    <TextInputForm 
      formLabel={"Please enter a decision factor:"} 
      textForFlashing={whatMattersText ? "Decision Factor: " + whatMattersText : ""}
      fieldName={"Decision Factor"} 
      fieldValue={whatMattersText} 
      fieldDescription={"Decision Factors are the things or criteria that matter regarding the decision. They help define what makes one potential choice better than another."}
      setFieldValue={(value) => setWhatMattersText(value)}
      handleClear={()=> setWhatMattersText("")}
      isClearButton={whatMattersText}
      addButtonFunction={handleSubmitWhatMatters}
      addButtonText={"Add Decision Factor"}
      submitForm={handleSetWhatMattersTextDone} 
      submitButtonText={"Done with What Matters"} 
      resetButton={resetState}
      resetButtonText={"Start Over"}
      addedStyles={{width:"100%"}}
      isError={whatMattersTextError}
      errorMessage={currentErrorMessage}/>
  ) : "";


  /*** STEP 4 */  
   const tableDisplay = step >= 4 ? 
    <DataTable
      potentialOptions={potentialOptions}
      whatMatters={whatMatters}
      setWhatMatters={setWhatMatters}
      setPotentialOptions={setPotentialOptions}
      showResults={showResults}
    /> : "";


  /*** BUTTONS ***/
  const startOverButton = step >= 4 ? (
      <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
  ) : "";

   const showResultsButton = step >= 4 ? (
    <>
      <ButtonControl onPress={() => setShowResults(true)} text={"Show Results"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - this will display totals and reveal your best choice.</span>
    </>
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
        {setDecisionStep}
        {setDecisionOptionsStep}
        {setWhatMattersStep}
      </div>
      <div className={"commonDiv"}>
        <div className={"resultsDiv"}>
          <div className={"innerResultsDiv"}>
            {dataPreview}
            {tableDisplay}
          </div>
        </div>
        <div className={"commonDiv"}>
          <div className={"button-row"}>
            {showResultsButton}
            {startOverButton}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default DifficultChoiceMaker;
