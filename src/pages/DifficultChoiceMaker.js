import { useState } from 'react';
import InputModal from '../components/modals/InputModal';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';
import TextInputForm from '../components/complex/TextInputForm';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const [decisionText, setDecisionText] = useState("");
  const [decisionTextDone, setDecisionTextDone] = useState(false);
  const [potentialOptionText, setPotentialOptionText] = useState("");
  const [potentialOptionTextDone, setPotentialOptionTextDone] = useState(false);
  // TODO: we're getting rid of modals probably
  const [showWhatMattersModal, setShowWhatMattersModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  // TODO: rename potentialOptions and whatMatters - decision options & 
  const [whatMatters, setWhatMatters] = useState([]);
  const [potentialOptions, setPotentialOptions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1);

  
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
    setShowWhatMattersModal(true);
  };

  const addChoice = () => {
    setShowChoiceModal(true);
  };


  const handleSubmitWhatMatters = ({ name, description, sliderValue }) => {
    const numberOfPotentialOptions = potentialOptions.length;
    setWhatMatters(prevItems => [
      ...prevItems,
      {
        name,
        description,
        sliderValue
      }
    ]);
    // must update potentialOptions[each].ratings when a new whatMatters is added
    const updatedPotentialOptions = potentialOptions;
    for(let x = 0; x < numberOfPotentialOptions; x++){
      updatedPotentialOptions[x].ratings.push(5);
    }
    setPotentialOptions(updatedPotentialOptions);
  };

  const handleSubmitPotentialOption = ({}) => {
    const numberOfWhatMatters = whatMatters.length;
    const initialRatings = [];
    for(let x = 0; x < numberOfWhatMatters; x++){
      initialRatings.push(5);
    }
    setPotentialOptions(prevItems => [
      ...prevItems,
      {
        name: potentialOptionText,
        ratings: initialRatings
      }
    ]);
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

  const handleDecisionOptionTextDone = () => {
    setPotentialOptionTextDone(true);
    setStep(3);
  }


  const closeModal = () => {
    setShowWhatMattersModal(false);
    setShowChoiceModal(false);
  };


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
          <span key={index}>{item}</span>
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
  const addWhatMattersStep = step === 3 ? 
    <>
      <ButtonControl onPress={addWhatMatters} text={"Add WhatMatters"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are factors of the decision you will use in evaluation.</span>
    </> : "";

  

  /*** BUTTONS ***/
  const startOverButton = decisionTextDone && (
    <div className={"commonDiv"}>
      <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
    </div>
  );

   const showResultsButton = decisionTextDone && whatMatters && potentialOptions ? (
    <>
      <ButtonControl onPress={() => setShowResults(true)} text={"Show Results"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - this will display totals and reveal your best choice.</span>
    </>
  ) : "";

  /*** MODALS ***/
  const whatMattersModal = (
    <InputModal
      isOpen={showWhatMattersModal}
      onSubmit={handleSubmitWhatMatters}
      onClose={closeModal}
      formTitle={"Enter WhatMatters"}
      field1Name={"criterion"}
      formDescription={"You can enter multiple whatMatters. Description is optional. Click 'Done' when finished."}
      showSlider={true}
      sliderTitle={"How important is this criterion:"}
      currentItems={whatMatters}
    />
  );
  // const choiceModal = (
  //   <InputModal
  //     isOpen={showChoiceModal}
  //     onSubmit={handleSubmitChoice}
  //     onClose={closeModal}
  //     formTitle={"Enter PotentialOptions"}
  //     field1Name={"choice"}
  //     formDescription={"You can enter multiple potentialOptions. Description is optional. Click 'Done' when finished."}
  //     currentItems={potentialOptions}
  //   />
  // );
  
  const tableDisplay = step === 5 ?
  <DataTable
    choices={potentialOptions}
    criteria={whatMatters}
    setCriteria={setWhatMatters}
    setChoices={setPotentialOptions}
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
        {setDecisionOptionsStep}
        {addWhatMattersStep}
      </div>
      <div className={"commonDiv"}>
        <div className={"resultsDiv"}>
          <div className={"innerResultsDiv"}>
            <div className={"commonDiv"}>
              <div className={"button-row"}>
                {showResultsButton}
              </div>
            </div>
            {whatMattersModal}
            {/* {choiceModal} */}
            {tableDisplay}
          </div>
        </div>
        {startOverButton}
      </div>
      
    </div>
  );
}

export default DifficultChoiceMaker;
