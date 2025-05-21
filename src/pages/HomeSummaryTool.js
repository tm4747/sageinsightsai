import React, { useState, useEffect, useRef } from 'react';
import './css/PageCommon.css';
import './css/HomeSummaryTool.css';
import { fetchWebSummary } from '../lib/LambdaHelper';
import { marked } from 'marked';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';



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
  

  // update state values
  const handleInputChange = (event) => {
    setEnteredUrl(event.target.value);
  };

  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";

  //typing effect
  useEffect(() => {
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

  const handleShowHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
  }
 
  var howAppWorksHtml = <>
  <FontAwesomeIcon icon={faXmark} onClick={() => {setShowHowItWorks(false)}} className={"flashing-icon close-icon"} 
  title="Close"/>
  <h4>How it works:</h4> 
  <ol>
  <li>A valid url must be entered which is then submitted to a Lambda function via AWS API Gateway.</li>
  <li>The Lambda function then attempts to pull and parse all content from the site homepage.
  <ul>
    <li><strong>Please note:</strong> this tool may not be able to retrieve site content if it is loaded via JavaScript such as is the case for a ReactJS app.</li>
    </ul></li>
  <li>The Lambda function then submits this content to OpenAI via API, requesting a summary.</li>
  <li>The response is then returned by Lambda to display here.</li></ol></>

  const howAppWorks = (
    <div className={`how-it-works-container ${showHowItWorks ? 'expanded' : 'collapsed'}`}>
      {howAppWorksHtml}
    </div>
  );


  const inputClasses = enteredUrlError ? "errorTextInput" : "textInput";


  return (
    <>
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
        <button className={"button"} onClick={callLambda}>Get Summary</button>
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
    </>
  );
}

export default HomeSummaryTool;




