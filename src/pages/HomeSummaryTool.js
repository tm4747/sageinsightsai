import React, { useState, useEffect, useRef } from 'react';
import styles from './css/PageStyles.module.css';
import { fetchWebSummary } from '../lib/LambdaHelper';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import BoxList from '../components/BoxList';
import { getHomeSummaryHowItWorks } from '../lib/DataHelper';
import FlashingText from '../components/FlashingText';


function HomeSummaryTool({setIsLoading}) {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [validUrl, setValidUrl] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [showBoxList, setShowBoxList] = useState(false);
    //typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  //scroll vars
  const messagesEndRef = useRef(null);


  /********* USE EFFECTS & API CALLS **********/
  useEffect(() => {  //typing effect
    if (!htmlReponse) return;  // No htmlReponse to display\
    setDisableScroll(false)
    setIsDone(false);
    setIsStarted(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + htmlReponse[currentIndex]);
        currentIndex += 1;

      // If we've added all characters, stop the typing effect
      if (htmlReponse && currentIndex === htmlReponse.length) {
        clearInterval(typingInterval);
        setIsDone(true);
        setIsStarted(false);
      }
    }, 1); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [htmlReponse]);

  // converts markup response from lambda to HTML
  useEffect(() => {
    const theHtmlResponse = marked(postResponse)
    setHtmlResponse(theHtmlResponse)
  }, [postResponse]);

  // website summary call
  const callLambda = () => {
    setPostResponse("");
    setHtmlResponse("");
    setDisplayedText("");
    if (haveValidData()) {
      setEnteredUrlError(true);
    } else {
      setEnteredUrlError(false);
      try {
        setIsLoading(true);
        console.log("lambda call")
        fetchWebSummary(enteredUrl, setPostResponse, setIsLoading);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } 
    }  
  }

  // Auto-scroll to bottom when new text is displayed
  useEffect(() => {
    if (!disableScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [disableScroll, displayedText]);


  /********** DYNAMIC JS FUNCTIONS **********/ 
  const handleInputChange = (event) => {
    const enteredValue = event.target.value.trim();
    setEnteredUrl(enteredValue);
    if(enteredValue && enteredValue.length === 0 ){
      setEnteredUrlError(false);
      setValidUrl(false);
    } else if (haveValidData(enteredValue)) {
      setEnteredUrlError(false);
      setValidUrl(true);
    } else {
      setEnteredUrlError(true);
      setValidUrl(false);
    }  
  };

  const handleShowHowItWorks = () => {
    setShowBoxList(!showBoxList);
  }

  /***********HELPER FUNCTIONS ************/
  const haveValidData = (enteredValue) => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    let b_validData = enteredValue && enteredValue.length > 3 && urlPattern.test(enteredValue);
    return b_validData;
  };
  

  /********** DISPLAY FUNCTIONS ***********/
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";

  const howItWorksData = getHomeSummaryHowItWorks(); 
  const howAppWorks = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showBoxList} setShowBoxList={setShowBoxList} showCloseButton={true}/>);
  const inputClasses = enteredUrlError ? "errorTextInput textInput" : (validUrl ? "inputSuccess textInput" : "textInput");

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

export default HomeSummaryTool;
