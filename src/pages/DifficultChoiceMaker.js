import React, { useState, useEffect, useRef } from 'react';
import styles from './css/PageStyles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import BoxList from '../components/BoxList';
import { getHomeSummaryHowItWorks } from '../lib/DataHelper';
import FlashingText from '../components/FlashingText';


function DifficultChoiceMaker({setIsLoading}) {
  const [showBoxList, setShowBoxList] = useState(false);
    //typing effect
  //scroll vars
  const messagesEndRef = useRef(null);


  /********* USE EFFECTS & API CALLS **********/


  /********** DYNAMIC JS FUNCTIONS **********/ 

  const handleShowHowItWorks = () => {
    setShowBoxList(!showBoxList);
  }

  /***********HELPER FUNCTIONS ************/
  

  /********** DISPLAY FUNCTIONS ***********/
  const howItWorksData = getHomeSummaryHowItWorks(); 
  const howAppWorks = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showBoxList} setShowBoxList={setShowBoxList} showCloseButton={true}/>);

  const descriptionOfPageFunction = (
    <p className={"pStandard"}>
      Please enter a website url. This tool will return a general summary of the homepage:
      <FontAwesomeIcon 
        className={"flashing-icon"}
        icon={faCircleQuestion} 
        onClick={handleShowHowItWorks} 
        title="How does it work?"
      />
    </p>
  );

  const enteredUrlDisplay = !enteredUrl ? "Please enter url" : ( validUrl ? "Valid url: " + enteredUrl : "Entered url: " + enteredUrl);

  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <div className={"pageDescription border-bottom"}> 
          {descriptionOfPageFunction}
          {howAppWorks}
        </div>
        <input className={inputClasses} onChange={handleInputChange} type="text"/>
        <button className={"button green-button"} onClick={callLambda}>Get Summary</button>
        <p>
          <FlashingText interval={750} text={enteredUrlDisplay}/>
        </p>
      </div>
      <div className={"resultsDiv"} >
        <div className={"innerResultsDiv"}>
          <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? "Results Will Display Here." : displayedText }} />
          <div>
            {isDone ? <p>Done!</p> : ""}
          </div>
        </div>
      </div>
      <div ref={messagesEndRef}/>
      {stopScrollButton}
    </div>
  );
}

export default DifficultChoiceMaker;
