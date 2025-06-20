import { useState } from 'react';
import styles from './css/PageStyles.module.css';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/InputModal';
import DataTable from '../components/DataTable';

function DifficultChoiceMaker({ setIsLoading, featureFlagShowBeta = true }) {
  const [choiceText, setDecisionText] = useState("Where To Move");
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
    <button className={"button green-button"} onClick={() => setDecisionTextDone(true)}>
      Decision is correct!
    </button>
  );
  const startOverButton = choiceTextDone && (
    <button className={"button red-button"} onClick={resetState}>
      Start Over
    </button>
  );

  const addCriteriaButton = choiceTextDone && (
    <>
      <div>
        <button className={"button green-button margin-bottom"} onClick={addCriteria}>
          Add Criteria
        </button>
        <span className={"small-text notice"}> - these are factors of the decision you will use in evaluation.</span>
      </div>
    </>
  );

  const addChoiceButton = haveCriteria ? 
    <div>
      <button className={"button green-button margin-bottom"} onClick={addChoice}>
        Add Choice
      </button>
      <span className={"small-text notice"}> - these are the choices you will evaluate.</span>
    </div> : "";

   const showResultsButton = choiceTextDone && (
    <>
      <div>
        <button className={"button green-button margin-bottom"} onClick={() => setShowResults(true)}>
          Show Results
        </button>
        <span className={"small-text notice"}> - this will display totals and reveal your best choice.</span>
      </div>
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

  if (!featureFlagShowBeta) {
    return (
      <div className={styles.content}>
        <div className={"formDiv"}>
          <div className={"pageDescription border-bottom"}>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
      </div>
      <div className={"resultsDiv"}>
        <div className={"innerResultsDiv"}>
          {startOverButton}
          {decisionInput}
          <p><FlashingText text={choiceText} /></p>
          {decisionGoodButton}
          {addCriteriaButton}
          {addChoiceButton}
          {showResultsButton}
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
