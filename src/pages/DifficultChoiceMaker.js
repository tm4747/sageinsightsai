import { useState } from 'react';
import styles from './css/PageStyles.module.css';
import BoxList from '../components/BoxList';
import { getDifficultChoiceMakerHowItWorks } from '../lib/DataHelper';
import PageDescription from '../components/PageDescription';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/InputModal';
import DataTable from '../components/DataTable';

function DifficultChoiceMaker({ setIsLoading }) {
  const [showBoxList, setShowBoxList] = useState(false);
  const [choiceText, setChoiceText] = useState("Where To Move");
  const [choiceTextDone, setChoiceTextDone] = useState(true);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [criteriaRows, setCriteriaRows] = useState([]);
  

  const featureFlag = process.env.REACT_APP_ENV === "non-prod";

  const handleShowHowItWorks = () => {
    setShowBoxList(!showBoxList);
  };

  const resetState = () => {
    setChoiceText("");
    setChoiceTextDone(false);
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

  const howItWorksData = getDifficultChoiceMakerHowItWorks();
  const howAppWorks = (
    <BoxList
      title={"How it works:"}
      data={howItWorksData}
      showBoxList={showBoxList}
      setShowBoxList={setShowBoxList}
      showCloseButton={true}
    />
  );
  const pageDescText = "This tool will assist in making difficult and/or complex choices: " + (featureFlag ? "" : "COMING SOON");
  const descriptionOfPageFunction = (
    <PageDescription onClickFn={handleShowHowItWorks} text={pageDescText} />
  );

  const decisionInput = !choiceTextDone && (
    <>
      <label>Describe the decision or choice:</label>
      <input
        className={"text-input"}
        value={choiceText}
        type="text"
        onChange={(e) => setChoiceText(e.target.value)}
      />
    </>
  );
  const decisionGoodButton = !choiceTextDone && (
    <button className={"button green-button"} onClick={() => setChoiceTextDone(true)}>
      Decision is correct!
    </button>
  );
  const startOverButton = choiceTextDone && (
    <button className={"button red-button"} onClick={resetState}>
      Start Over
    </button>
  );

  const addChoiceButton = criteriaRows && criteriaRows.length > 0 ? 
    <div>
      <button className={"button green-button margin-bottom"} onClick={addChoice}>
        Add Choice
      </button>
      <span className={"small-text notice"}> - these are the choices you will evaluate.</span>
    </div> : "";

  const addChoiceCriteriaButton = choiceTextDone && (
    <>
      <div>
        <button className={"button green-button margin-bottom"} onClick={addCriteria}>
          Add Criteria
        </button>
        <span className={"small-text notice"}> - these are factors of the decision you will use in evaluation.</span>
      </div>
      {addChoiceButton}
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

  if (!featureFlag) {
    return (
      <div className={styles.content}>
        <div className={"formDiv"}>
          <div className={"pageDescription border-bottom"}>
            {descriptionOfPageFunction}
            {howAppWorks}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <div className={"pageDescription border-bottom"}>
          {descriptionOfPageFunction}
          {howAppWorks}
        </div>
      </div>
      <div className={"resultsDiv"}>
        <div className={"innerResultsDiv"}>
          {startOverButton}
          {decisionInput}
          <p><FlashingText text={choiceText} /></p>
          {decisionGoodButton}
          {addChoiceCriteriaButton}
          {criteriaModal}
          {choiceModal}
          <DataTable
            criteriaRows={criteriaRows}
            setCriteriaRows={setCriteriaRows}
          />
        </div>
      </div>
    </div>
  );
}

export default DifficultChoiceMaker;
