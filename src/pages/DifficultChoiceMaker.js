import { useState } from 'react';
import InputModal from '../components/modals/InputModal';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';
import TextInputForm from '../components/complex/TextInputForm';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const initialRatingValue = 5;
  const override = true;

  const [decisionText, setDecisionText] = useState(override ? "Where to move": "");
  // TODO: may not need this.  Steps might be enough
  const [decisionTextDone, setDecisionTextDone] = useState(override ? true : false);
  const [potentialOptions, setPotentialOptions] = useState(override ? [
    {name: "NY", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}, 
    {name: "SLC", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}, 
    {name: "Montana", ratings: [initialRatingValue, initialRatingValue, initialRatingValue]}] : []);
  const [potentialOptionText, setPotentialOptionText] = useState("");
  const [whatMatters, setWhatMatters] = useState(override ? [
    {name: "Wide Open Space", sliderValue: initialRatingValue}, 
    {name: "Culture", sliderValue: initialRatingValue}, 
    {name: "Job Opportunities", sliderValue: initialRatingValue}] : []);
  const [whatMattersText, setWhatMattersText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(override ? 3 : 1);


  
  /********* JAVASCRIPT HELPER FUNCTIONS **********/
  const resetState = () => {
    setDecisionText("");
    setDecisionTextDone(false);
    setPotentialOptions([]);
    setWhatMatters([]);
    setShowResults(false);
    setStep(1);
  };

  const addWhatMatters = () => {

  };
 
  const handleSubmitPotentialOption = ({}) => {
    // need number of whatMatters to set potentialOptions
    const numberOfWhatMatters = whatMatters.length;
    const initialRatings = [];
    for(let x = 0; x < numberOfWhatMatters; x++){
      initialRatings.push(initialRatingValue);
    }
    setPotentialOptions(prevItems => [
      ...prevItems,
      {
        name: potentialOptionText,
        ratings: initialRatings
      }
    ]);
    setPotentialOptionText("");
  };

  // TODO: check this - probably not right
  const handleSubmitWhatMatters = ({ }) => {
    console.log('whatMattersText', whatMattersText);
    const numberOfPotentialOptions = potentialOptions.length;
    setWhatMatters(prevItems => [
      ...prevItems,
      {
        name: whatMattersText,
        sliderValue: initialRatingValue
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
    setDecisionTextDone(true);
    setStep(2);
  }

  const handlePotentialSetOptionText = (value) =>{
    setPotentialOptionText(value)
  }

  const handleSetWhatMattersText = (value) =>{
    setWhatMattersText(value)
  }


  const handleDecisionOptionTextDone = () => {
    setStep(3);
  }

  const handleSetWhatMattersTextDone = () => {
    setStep(4);
  }


  /********* DISPLAY FUNCTIONS **********/
  const decisionTextDisplay =  decisionText && decisionTextDone ? <p>{`Decision: ${decisionText}`}</p> : "";
  const potentialOptionsDisplay = potentialOptions && potentialOptions.length > 0 ? 
    (
      <p>Potential Options:
        {potentialOptions.map((item, index) => (
          <span key={index}>{index != 0 ? ", ": ""} {item.name}</span>
        ))}
      </p>
    ) : "";
  const whatMattersDisplay = whatMatters && whatMatters.length > 0 ? 
    (
      <p>What Matters:
        {whatMatters.map((item, index) => (
          <span key={index}>{index != 0 ? ", ": ""} {item.name}</span>
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
      formLabel={"Please enter your decision:"} 
      textForFlashing={decisionText ? "Decision: " + decisionText : ""}
      fieldName={"Decision"} 
      fieldValue={decisionText} 
      setFieldValue={handleSetDecisionText}
      submitForm={handleDecisionDone} 
      submitButtonText={"Decision is correct!"} 
      addedStyles={{width:"100%"}}/>
  ) : "";

  /*** STEP 2 ***/
    const setDecisionOptionsStep = step === 2 ? (
    <TextInputForm 
      formLabel={"Please enter your potential options:"} 
      textForFlashing={potentialOptionText ? "Potential Option: " + potentialOptionText : ""}
      fieldName={"Decision Option"} 
      fieldValue={potentialOptionText} 
      fieldDescription={"Each of these represents one possible answer to your question or one route you could take."}
      setFieldValue={handlePotentialSetOptionText}
      addButtonFunction={handleSubmitPotentialOption}
      addButtonText={"Add Potential Option"}
      submitForm={handleDecisionOptionTextDone} 
      submitButtonText={"Done with Potential Options"} 
      addedStyles={{width:"100%"}}/>
  ) : "";

  /*** STEP 3 */  
   const setWhatMattersStep = step === 3 ? (
    <TextInputForm 
      formLabel={"Please enter a what matters options:"} 
      textForFlashing={whatMattersText ? "What Matters: " + whatMattersText : ""}
      fieldName={"What Matters"} 
      fieldValue={whatMattersText} 
      fieldDescription={"Think of these as the things that matter to you most. They help define what makes one option better than another."}
      setFieldValue={handleSetWhatMattersText}
      addButtonFunction={handleSubmitWhatMatters}
      addButtonText={"Add What Matters"}
      submitForm={handleSetWhatMattersTextDone} 
      submitButtonText={"Done with What Matters"} 
      addedStyles={{width:"100%"}}/>
  ) : "";

  /*** STEP 4 */  
   const tableDisplay = step === 4 ? 
    <DataTable
      choices={potentialOptions}
      criteria={whatMatters}
      setCriteria={setWhatMatters}
      setChoices={setPotentialOptions}
      showResults={showResults}
    /> : "";


  /*** BUTTONS ***/
  const startOverButton = decisionTextDone && (
      <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
  );

   const showResultsButton = decisionTextDone && whatMatters && potentialOptions ? (
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
        {dataPreview}
        {setDecisionStep}
        {setDecisionOptionsStep}
        {setWhatMattersStep}
       
      </div>
      <div className={"commonDiv"}>
        <div className={"resultsDiv"}>
          <div className={"innerResultsDiv"}>
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
