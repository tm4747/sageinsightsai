import { useState } from 'react';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/modals/InputModal';
import DataTable from '../components/DataTable';
import ButtonControl from '../components/simple/ButtonControl';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const overrideChoice = false ? "Where to move" : "";
  const [choiceText, setDecisionText] = useState(overrideChoice);
  const [choiceTextDone, setDecisionTextDone] = useState(true);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [criteriaRows, setCriteriaRows] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const resetState = () => {
    setDecisionText("");
    setDecisionTextDone(false);
  };

  const addCriteria = () => {
    setShowCriteriaModal(true);
  };

  const addChoice = () => {
    setShowChoiceModal(true);
  };

  const handleSubmitCriteria = ({ name, description, sliderValue }) => {
    setCriteriaRows(prevItems => [
      ...prevItems,
      {
        name,
        description,
        sliderValue,
        choices: prevItems[0] && prevItems[0].choices ? prevItems[0].choices : [] // initially empty choices
      }
    ]);
  };

  const handleSubmitChoice = ({ name, description }) => {
    setCriteriaRows(prevCriteriaRows =>
      prevCriteriaRows.map(criterion => ({
        ...criterion,
        choices: [
          ...criterion.choices,
          { name, description, rating: 5 } // default rating
        ]
      }))
    );
  };

  const closeModal = () => {
    setShowCriteriaModal(false);
    setShowChoiceModal(false);
  };

  const haveCriteria = criteriaRows && criteriaRows.length > 0;


  /********* DISPLAY FUNCTIONS **********/

  const decisionInput = !choiceTextDone && (
    <>
      <label>Describe the decision or choice:</label>
      <input
        className={"text-input"}
        value={choiceText}
        type="text"
        onChange={(e) => setDecisionText(e.target.value)}
      />
    </>
  );
  const decisionGoodButton = !choiceTextDone && (
    <ButtonControl onPress={() => setDecisionTextDone(true)} text={"Decision is correct!"} type={"submitRequest"}/>
  );
  const startOverButton = choiceTextDone && (
    <ButtonControl onPress={resetState} text={"Start Over"} type={"resetButton"}/>
  );

  const addCriteriaButton = choiceTextDone && (
    <>
      <ButtonControl onPress={addCriteria} text={"Add Criteria"} type={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are factors of the decision you will use in evaluation.</span>
    </>
  );

  const addChoiceButton = haveCriteria ? 
    <>
      <ButtonControl onPress={addChoice} text={"Add Choices"} type={"submitRequest"}/>
      <span className={"small-text notice hide"}> - these are the choices you will evaluate.</span>
    </> : "";

   const showResultsButton = choiceTextDone && (
    <>
      <ButtonControl onPress={() => setShowResults(true)} text={"Show Results"} type={"submitRequest"}/>
      <span className={"small-text notice hide"}> - this will display totals and reveal your best choice.</span>
    </>
  );

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
      currentItems={criteriaRows}
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
      currentItems={criteriaRows}
    />
  );
  const choiceDisplay = choiceText ? 
          <div className={"commonDiv"}>
            <FlashingText text={"Decision: " + choiceText} />
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
              {startOverButton}
              {decisionInput}
              {decisionGoodButton}
              {addCriteriaButton}
              {addChoiceButton}
              {showResultsButton}
            </div>
          </div>
          {criteriaModal}
          {choiceModal}
          <DataTable
            criteriaRows={criteriaRows}
            setCriteriaRows={setCriteriaRows}
            showResults={showResults}
          />
        </div>
      </div>
    </div>
  );
}

export default DifficultChoiceMaker;
