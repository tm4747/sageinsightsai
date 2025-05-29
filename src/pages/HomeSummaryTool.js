import React, { useState, useEffect, useRef } from 'react';
import styles from './css/HomeSummaryTool.module.css';
import { fetchWebSummary } from '../lib/LambdaHelper';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import HowItWorks from '../components/HowItWorks';
import { getHomeSummaryHowItWorks } from '../lib/DataHelper';


function HomeSummaryTool({setIsLoading}) {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
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
      if (currentIndex === htmlReponse.length) {
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
    if (enteredUrl < 3) {
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
    setEnteredUrl(event.target.value);
  };

  const handleShowHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
  }


  /********** DISPLAY FUNCTIONS ***********/
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";

  const howItWorksData = getHomeSummaryHowItWorks(); 
  const howAppWorks = (<HowItWorks title={"How it works:"} data={howItWorksData} showHowItWorks={showHowItWorks} setShowHowItWorks={setShowHowItWorks} showCloseButton={true}/>);
  const inputClasses = enteredUrlError ? "errorTextInput" : "textInput";


  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <p className={"pageDescription"}>Please enter a website url.  
          This tool will return a general summary of the homepage: 
          <FontAwesomeIcon 
                      className={"flashing-icon"}
                      icon={faCircleQuestion} 
                      onClick={handleShowHowItWorks} 
                      title="How does it work?"
                    />
        </p>
        {howAppWorks}
        <input className={inputClasses} onChange={handleInputChange} type="text"/>
        <button className={"button green-button"} onClick={callLambda}>Get Summary</button>
        {/* <span> error: {enteredUrlError}</span> */}
      </div>
      <div className={"resultsDiv"} >
        <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? "Results Will Display Here." : displayedText }} />
        <div>
          {isDone ? <p>Done!</p> : ""}
        </div>
      </div>
      <div ref={messagesEndRef}/>
      {stopScrollButton}
    </div>
  );
}

export default HomeSummaryTool;
