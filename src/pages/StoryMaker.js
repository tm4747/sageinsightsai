import React, { useState, useEffect, useRef } from 'react';
import './css/PageCommon.css';
import './css/StoryMaker.css';
import { marked } from 'marked';
import CharacterConfigurator from "../components/CharacterConfigurator"


function StoryMaker({setIsLoading}) {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredSituation, setEnteredSituation] = useState('');
  const [disableScroll, setDisableScroll] = useState(false);
  const [showCharacterInput, setShowCharacterInput] = useState(1);
  const [characterInputs, setCharacterInputs] = useState({1:[], 2:[], 3:[]});
  console.log(characterInputs);
  console.log('characterInputs');

  //typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  //scroll vars
  const messagesEndRef = useRef(null);
  

  // update state values
  const handleInputChange = (event) => {
    setEnteredSituation(event.target.value);
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
      try {
        setIsLoading(true);
        console.log("lambda call")
        //testPost(enteredSituation, setPostResponse, setIsLoading);
        console.log(enteredSituation)
        setPostResponse("Functionality Coming Soon.")
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching summary:', error);
      } 
  }

  const handleCharacterInputSubmit = () => {
    setShowCharacterInput(showCharacterInput);
    setCharacterInputs(characterInputs)
  }
  
  const characterInputGroup = showCharacterInput === 1 ? 
  <CharacterConfigurator characterId={1} handleInputSubmit={handleCharacterInputSubmit}/> :
  (showCharacterInput === 2 ? <CharacterConfigurator characterId={2} handleInputSubmit={handleCharacterInputSubmit}/> :
    (showCharacterInput === 3 ? <CharacterConfigurator characterId={3} handleInputSubmit={handleCharacterInputSubmit}/> : ""
   ));

   const submitInputGroup = showCharacterInput === 4 ? <><p>Optionally - enter the situation in which your characters have foud themselves:</p>
   <input className={"textInput"} onChange={handleInputChange} type="text"/>
   <button className={"button"} onClick={callLambda}>Call Lambda</button></> : "";
  

  // Auto-scroll to bottom when new text is displayed
  useEffect(() => {
    if (!disableScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [disableScroll, displayedText]);

 
  var howAppWorks = "<h4>How it works:</h4> <ol>";
  howAppWorks += "<li>This functionality is coming soon.</li>";
  howAppWorks += "<li>Essentially you will be able to create 3 characters with a wide variety of features and idiosyncracies, and enter an optional situation.</li>";
  howAppWorks += "<li>OpenAI, Google Gemini and Anthropic Claude will then be called upon to play each of the characters, carrying out a converstaion and acting out a virtual 'skit' based on your inputs.</li></ol>";


  return (
    <>
      <div className={"formDiv"}>
        <div className={"pageDescription"}>
            <p>You will create 3 characters, using the following dropdowns to determine their characteristics.
            They you can optionally enter a scenario.
            This tool will then carry out a conversation utilizing 3 different LLMs using OpenAI, Google Gemini and Anthropic Claude.</p>
        </div>
          {characterInputGroup}
          {submitInputGroup}
        {/* <span> error: {enteredSituationError}</span> */}
      </div>
      <div className={"resultsDiv"} >
        <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? howAppWorks : displayedText }} />
        <div>
          {isDone ? <p>Done!</p> : ""}
        </div>
      </div>
      <div ref={messagesEndRef}/>
      {stopScrollButton}
    </>
  );
}

export default StoryMaker;