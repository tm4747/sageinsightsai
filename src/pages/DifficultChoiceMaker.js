import { useState } from 'react';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/modals/InputModal';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const overrideChoice = false ? "Where to move" : "";
  const [decisionText, setDecisionText] = useState(overrideChoice);
  const [decisionTextDone, setDecisionTextDone] = useState(true);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [criteria, setCriteria] = useState([]);
  const [choices, setChoices] = useState([]);
  const [showResults, setShowResults] = useState(false);

  
  const resetState = () => {
    setDecisionText("");
    setDecisionTextDone(false);
    setChoices([]);
    setCriteria([]);
  };

  const addCriteria = () => {
    setShowCriteriaModal(true);
  };

  const addChoice = () => {
    setShowChoiceModal(true);
  };

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
  const decisionInput = !decisionTextDone && (
    <>
      <label>Describe the decision or choice:</label>
      <input
        className={"text-input"}
        value={decisionText}
        type="text"
        onChange={(e) => setDecisionText(e.target.value)}
      />
    </>
  );
  const decisionGoodButton = !decisionTextDone && (
    <ButtonControl onPress={() => setDecisionTextDone(true)} text={"Decision is correct!"} variation={"submitRequest"}/>
  );
  const startOverButton = decisionTextDone && (
    <ButtonControl onPress={resetState} text={"Start Over"} variation={"resetButton"}/>
  );

  const addCriteriaButton = decisionTextDone && (
    <>
      <ButtonControl onPress={addCriteria} text={"Add Criteria"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are factors of the decision you will use in evaluation.</span>
    </>
  );

  const addChoiceButton = decisionTextDone && (
    <>
      <ButtonControl onPress={addChoice} text={"Add Choices"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are the choices you will evaluate.</span>
    </>
  );

   const showResultsButton = decisionTextDone && criteria && choices ? (
    <>
      <ButtonControl onPress={() => setShowResults(true)} text={"Show Results"} variation={"submitRequest"}/>
      <span className={"small-text notice hide"}> - this will display totals and reveal your best choice.</span>
    </>
  ) : "";

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
  const choiceDisplay = decisionText ? 
          <div className={"commonDiv"}>
            <FlashingText text={"Decision: " + decisionText} />
          </div> : "";

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
      </div>
      <div className={"resultsDiv"}>
        <div className={"innerResultsDiv"}>
          {choiceDisplay}
          <div className={"commonDiv"}>
            <div className={"button-row"}>
              {decisionInput}
              {decisionGoodButton}
              {addCriteriaButton}
              {addChoiceButton}
              {showResultsButton}
              {startOverButton}
            </div>
          </div>
          {criteriaModal}
          {choiceModal}
          <DataTable
            choices={choices}
            criteria={criteria}
            setCriteria={setCriteria}
            setChoices={setChoices}
            showResults={showResults}
          />
        </div>
      </div>
    </div>
  );
}

export default DifficultChoiceMaker;
