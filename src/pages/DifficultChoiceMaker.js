import React, { useState } from 'react';
import styles from './css/PageStyles.module.css';
import BoxList from '../components/BoxList';
import { getDifficultChoiceMakerHowItWorks } from '../lib/DataHelper';
import PageDescription from '../components/PageDescription';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/InputModal';

function DifficultChoiceMaker({setIsLoading}) {
  const [showBoxList, setShowBoxList] = useState(false);
  const [choiceText, setChoiceText] = useState("");
  const [choiceTextDone, setChoiceTextDone] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  // const [criteria, setCriteria] = useState([]);


  /********* USE EFFECTS & API CALLS **********/


  /********** DYNAMIC JS FUNCTIONS **********/ 
  const handleShowHowItWorks = () => {
    setShowBoxList(!showBoxList);
  }

  const resetState = () => {
    setChoiceText("");
    setChoiceTextDone(false);
  }

  const addCriteria = () => {
    setShowCriteriaModal(true);
  }

  const handleSubmitCriteria = ({name, description}) => {
    console.log("name, description: " + name + " - " + description);
  }
  const closeCriteriaModal = () => {
    setShowCriteriaModal(false);
  }

  /***********HELPER FUNCTIONS ************/
  

  /********** DISPLAY FUNCTIONS ***********/
  const howItWorksData = getDifficultChoiceMakerHowItWorks(); 
  const howAppWorks = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showBoxList} setShowBoxList={setShowBoxList} showCloseButton={true}/>);
  const pageDescText = "This tool will assist in making difficult and/or complex choices:";
  const descriptionOfPageFunction = <PageDescription onClickFn={handleShowHowItWorks} text={pageDescText} />

  const decisionInput = !choiceTextDone ? (<><label>Describe the decision or choice:</label>
    <input className={"text-input"} value={choiceText} type="text" onChange={(e) => setChoiceText(e.target.value)}/></>) : "";
  const decisionGoodButton = !choiceTextDone ? <button className={"button green-button"} onClick={() => {setChoiceTextDone(true)}} value={""}>Decision is correct!</button> : "";
  const startOverButton = choiceTextDone ? <button className={"button red-button"} onClick={resetState} value={""}>Start Over</button> : "";
  const addChoiceCriteriaButton = choiceTextDone ? 
  <><button className={"button green-button"} onClick={addCriteria} value={""}>Add Criteria</button>
    <span> - these are factors of the decision you will use in evaluation.</span>
  </>  : "";
  const criteriaModal = <InputModal isOpen={showCriteriaModal} onSubmit={handleSubmitCriteria} onClose={closeCriteriaModal} />

  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <div className={"pageDescription border-bottom"}> 
          {descriptionOfPageFunction}
          {howAppWorks}
        </div>
      </div>
      <div className={"resultsDiv"} >
        <div className={"innerResultsDiv"}>
          {startOverButton}
          {decisionInput}
          <p>
            <FlashingText text={choiceText}/>
          </p>
          {decisionGoodButton} 
          {addChoiceCriteriaButton}
          {criteriaModal}
        </div>
      </div>
    </div>
  );
}

export default DifficultChoiceMaker;
