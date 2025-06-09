import React, { useState } from 'react';
import styles from './css/PageStyles.module.css';
import BoxList from '../components/BoxList';
import { getDifficultChoiceMakerHowItWorks } from '../lib/DataHelper';
import PageDescription from '../components/PageDescription';
import FlashingText from '../components/FlashingText';
import InputModal from '../components/InputModal';
import DataTable from '../components/DataTable'; 
 // or another theme like 'ag-theme-material'

// Register all Community features

function DifficultChoiceMaker({setIsLoading}) {

  
  const [showBoxList, setShowBoxList] = useState(false);
  const [choiceText, setChoiceText] = useState("Where To Move");
  const [choiceTextDone, setChoiceTextDone] = useState(true);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [criteriaItems, setCriteriaItems] = useState([]);
  const featureFlag = process.env.REACT_APP_ENV && process.env.REACT_APP_ENV === "non-prod" ? true : false;
  // Row Data: The data to be displayed.
  // const [rowData, setRowData] = useState([
  //     { criteria: "Tesla", model: "Model Y", price: 64950, electric: true },
  //     { make: "Ford", model: "F-Series", price: 33850, electric: false },
  //     { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  // ]);

  // Column Definitions: Defines the columns to be displayed.
  // const [colDefs, setColDefs] = useState([
  //     { field: "name" },
  //     { field: "description" },
  //     { field: "value" },
  // ]);
  const colDefs = [
      { field: "name" },
      { field: "description" },
      { field: "value" }
    ];

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

  const addChoice = () => {
    setShowChoiceModal(true);
  }
 
  const handleSubmitCriteria = ({ name, description, value }) => {
    setCriteriaItems(prevItems => [
      ...prevItems,
      { "name": name, "description": description, "value":value }
    ]);
  };

  const handleSubmitChoice = ({ choice }) => {
    setCriteriaItems(prevItems => [
      ...prevItems,
      { "name": choice }
    ]);
  };
  

  const closeModal = () => {
    setShowCriteriaModal(false);
    setShowChoiceModal(false);
  }

  /***********HELPER FUNCTIONS ************/
  

  /********** DISPLAY FUNCTIONS ***********/
  const howItWorksData = getDifficultChoiceMakerHowItWorks(); 
  const howAppWorks = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showBoxList} setShowBoxList={setShowBoxList} showCloseButton={true}/>);
  const pageDescText = "This tool will assist in making difficult and/or complex choices: " + (featureFlag ? "" : "COMING SOON");
  const descriptionOfPageFunction = <PageDescription onClickFn={handleShowHowItWorks} text={pageDescText} />

  const decisionInput = !choiceTextDone ? (<><label>Describe the decision or choice:</label>
    <input className={"text-input"} value={choiceText} type="text" onChange={(e) => setChoiceText(e.target.value)}/></>) : "";
  const decisionGoodButton = !choiceTextDone ? 
    <button className={"button green-button"} onClick={() => {setChoiceTextDone(true)}} value={""}>Decision is correct!</button> : "";
  const startOverButton = choiceTextDone ? 
    <button className={"button red-button"} onClick={resetState} value={""}>Start Over</button> : "";
  const addChoiceCriteriaButton = choiceTextDone ? 
  <><div>
      <button className={"button green-button margin-bottom"} onClick={addCriteria} value={""}>Add Criteria</button>
      <span className={"small-text notice"}> - these are factors of the decision you will use in evaluation.</span>
    </div>
    <div>
      <button className={"button green-button margin-bottom"} onClick={addChoice} value={""}>Add Choice</button>
      <span className={"small-text notice"}> - these are the choices you will you evaluate.</span>
    </div>
  </>  : "";
  const criteriaModal = <InputModal isOpen={showCriteriaModal} onSubmit={handleSubmitCriteria} 
    onClose={closeModal} formTitle={"Enter Criteria"} field1Name={"criterion"}
    formDescription={"You can enter multiple criteria. Description is optional. Click 'Done' when finished."} showSlider={true}
    sliderTitle={"How important is this criterion:"}/>
  const choiceModal = <InputModal isOpen={showChoiceModal} onSubmit={handleSubmitChoice} 
    onClose={closeModal} formTitle={"Enter Choices"} field1Name={"choice"}
    formDescription={"You can enter multiple choices. Description is optional. Click 'Done' when finished."} />

  if(!featureFlag){
    return (
      <div className={styles.content}>
        <div className={"formDiv"}>
          <div className={"pageDescription border-bottom"}> 
            {descriptionOfPageFunction}
            {howAppWorks}
          </div>
        </div>
      </div>
    )
  }

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
          {choiceModal}
           <DataTable rowData={criteriaItems} colDefs={colDefs} />
           
        </div>
      </div>
    </div>
  );
}

export default DifficultChoiceMaker;
