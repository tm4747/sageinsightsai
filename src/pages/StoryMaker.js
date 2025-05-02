import React, { useState, useEffect, useRef } from 'react';
import './css/HomeSummaryTool.css';
import AILogo from '../components/AILogo';
import { testPost } from '../lib/LambdaHelper';
import { marked } from 'marked';
import Modal from "../components/Modal" 
import FlashingText from '../components/FlashingText';


function StoryMaker() {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  
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
        testPost(enteredUrl, setPostResponse, setIsLoading);
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

 
  var howAppWorks = "<h4>How it works:</h4> <ol>";
  howAppWorks += "<li>Hasn't been built yet.</li></ol>"

  const inputClasses = enteredUrlError ? "errorTextInput" : "textInput";

  return (
    <div className="App">
      <header className="App-header">
        <h2 className={"pageTitle"}>
        <AILogo size={".75em"}/> &nbsp; 
          <TypingText text={"Welcome to Sage Insights AI!"} flashingText={" _ "}/>
        </h2>
        <section className="body">
          <div className={"formDiv"}>
            <p className={"directions"}>You will create 3 characters, using the following dropdowns to determine their characteristics.  They you can optionally enter a scenario.   
              This tool will then carry out a conversation utilizing 3 different LLMs using OpenAI, Google Gemini and Anthropic Claude:</p>
            <input className={inputClasses} onChange={handleInputChange} type="text"/>
            <button className={"button"} onClick={callLambda}>Call Lambda</button>
            {/* <span> error: {enteredUrlError}</span> */}
          </div>
          <div className={"resultsDiv"} >
            <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? howAppWorks : displayedText }} />
            <div>
              {isDone ? <p>Done!</p> : ""}
            </div>
          </div>
          <div ref={messagesEndRef}/>
      </section>
      </header>
      <Modal isLoading={isLoading}/>
      {stopScrollButton}
    </div>
  );
}

export default StoryMaker;



const TypingText = ({ text, flashingText = "", speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[index]);
        setIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  return <span>Hello@User:~$ {displayedText} <FlashingText text={flashingText}/></span>;
};
