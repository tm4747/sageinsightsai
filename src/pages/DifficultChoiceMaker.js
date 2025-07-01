import { useState } from 'react';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/modals/InputModal';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';
import TextInput from '../components/simple/TextInput';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const [decisionText, setDecisionText] = useState("");
  const [decisionTextDone, setDecisionTextDone] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [choices, setChoices] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1);

  
  /********* JAVASCRIPT HELPER FUNCTIONS **********/
  const resetState = () => {
    setDecisionText("");
    setDecisionTextDone(false);
    setChoices([]);
    setCriteria([]);
    setShowResults(false);
    setStep(1);
  };

  const addCriteria = () => {
    setShowCriteriaModal(true);
  };

  const addChoice = () => {
    setShowChoiceModal(true);
  };

  const handleDecisionDone = () => {
    setDecisionTextDone(true);
    setStep(2);
  }

  const handleSubmitCriteria = ({ name, description, sliderValue }) => {
    const numberOfChoices = choices.length;
    setCriteria(prevItems => [
      ...prevItems,
      {
        name,
        description,
        sliderValue
      }
    ]);
    // must update choices[each].ratings when a new criteria is added
    const updatedChoices = choices;
    for(let x = 0; x < numberOfChoices; x++){
      updatedChoices[x].ratings.push(5);
    }
    setChoices(updatedChoices);
  };

  const handleSubmitChoice = ({ name, description }) => {
    const numberOfCriteria = criteria.length;
    const initialRatings = [];
    for(let x = 0; x < numberOfCriteria; x++){
      initialRatings.push(5);
    }
    setChoices(prevItems => [
      ...prevItems,
      {
        name,
        description,
        ratings: initialRatings
      }
    ]);
  };

  const closeModal = () => {
    setShowCriteriaModal(false);
    setShowChoiceModal(false);
  };


  /********* DISPLAY FUNCTIONS **********/
  const dataPreview = decisionText && decisionTextDone ? <div className={"commonDiv bold"}>Decision: {decisionText}</div> : "";

  /*** STEP 1 ***/
  const textForFlashing = decisionText ? "Decision: " + decisionText : "";
  const enteredDecisionDisplay = !decisionText ? <span className="bold">Please enter your decision:</span> : 
    <FlashingText interval={750} text={textForFlashing} boldText={true}/>;
  const textDisplay = <TextInput 
    id={"setDecisionStep"}
    handleOnChange={(e) => setDecisionText(e.target.value)}
    enteredValue={decisionText}
    addedStyles={{width: "100%"}}
  />;
  const setDecisionButton = 
    <ButtonControl 
      onPress={handleDecisionDone} 
      text={"Decision is correct!"} 
      variation={"submitRequest"} 
      addedStyles={{width: "100%"}}
    />
  const setDecisionStep = step === 1 ? (
     <div className={"formDiv"} style={{maxWidth:"600px", margin:"auto"}}>
        <div className={"commonDiv"}>
          {enteredDecisionDisplay}
        </div>
          {textDisplay}
        <div className={"commonDiv"}>
          {setDecisionButton}     
        </div>
      </div>
  ) : "";

  /*** STEP 2 ***/
  const addChoicesStep = step === 2 ? 
    <>
      <ButtonControl onPress={addChoice} text={"Add Choices"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are the choices you will evaluate.</span>
    </> : "";

  /*** STEP 2 */
  const addCriteriaStep = step === 3 ? 
    <>
      <ButtonControl onPress={addCriteria} text={"Add Criteria"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are factors of the decision you will use in evaluation.</span>
    </> : "";

  /*** BUTTONS ***/
  const startOverButton = decisionTextDone && (
    <div className={"commonDiv"}>
      <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
    </div>
  );

   const showResultsButton = decisionTextDone && criteria && choices ? (
    <>
      <ButtonControl onPress={() => setShowResults(true)} text={"Show Results"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - this will display totals and reveal your best choice.</span>
    </>
  ) : "";

  /*** MODALS ***/
  const criteriaModal = (
    <InputModal
      isOpen={showCriteriaModal}
      onSubmit={handleSubmitCriteria}
      onClose={closeModal}
      formTitle={"Enter Criteria"}
      field1Name={"criterion"}
      formDescription={"You can enter multiple criteria. Description is optional. Click 'Done' when finished."}
      showSlider={true}
      sliderTitle={"How important is this criterion:"}
      currentItems={criteria}
    />
  );
  const choiceModal = (
    <InputModal
      isOpen={showChoiceModal}
      onSubmit={handleSubmitChoice}
      onClose={closeModal}
      formTitle={"Enter Choices"}
      field1Name={"choice"}
      formDescription={"You can enter multiple choices. Description is optional. Click 'Done' when finished."}
      currentItems={choices}
    />
  );
  
  const tableDisplay = step === 5 ?
  <DataTable
    choices={choices}
    criteria={criteria}
    setCriteria={setCriteria}
    setChoices={setChoices}
    showResults={showResults}
  /> : "";

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
        {addChoicesStep}
        {addCriteriaStep}
      </div>
      <div className={"commonDiv"}>
        <div className={"resultsDiv"}>
          <div className={"innerResultsDiv"}>
            <div className={"commonDiv"}>
              <div className={"button-row"}>
                {showResultsButton}
              </div>
            </div>
            {criteriaModal}
            {choiceModal}
            {tableDisplay}
          </div>
        </div>
        {startOverButton}
      </div>
      
    </div>
  );
}

export default DifficultChoiceMaker;
