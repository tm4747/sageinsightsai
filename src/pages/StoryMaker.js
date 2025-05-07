import React, { useState, useEffect, useRef } from 'react';
import './css/PageCommon.css';
import './css/StoryMaker.css';
import { marked } from 'marked';
import CharacterConfigurator from "../components/CharacterConfigurator"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


function StoryMaker({setIsLoading}) {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredSituation, setEnteredSituation] = useState('');
  const [disableScroll, setDisableScroll] = useState(false);
  const [showCharacterInput, setShowCharacterInput] = useState(1);
  const [characterInputs, setCharacterInputs] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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

  // Display results with typing effect
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

  // StoryMaker Labmda call
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

  // handle each character input submit - should be 2 variables - a sentence of description and optional contextual situation
  const handleCharacterInputSubmit = (data, index) => {
    console.log('data');
    console.log(data);
    console.log('index');
    console.log(index);

    const nextCharacterInputIndex = index + 1;
    console.log('nextCharacterInputIndex');
    console.log(nextCharacterInputIndex);
    addNewValue(data)

    setShowCharacterInput(nextCharacterInputIndex);
  }

  const addNewValue = (newValue) => {
    setCharacterInputs(characterInputs => [...characterInputs, newValue]);
  };
  
  // which character input (1, 2, or 3) should show
  const characterInputGroup = showCharacterInput === 1 ? 
  <CharacterConfigurator characterId={1} submittedData={(data) => {handleCharacterInputSubmit(data, 1)}}/> :
  (showCharacterInput === 2 ? <CharacterConfigurator characterId={2} submittedData={(data) => {handleCharacterInputSubmit(data, 2)}}/> :
    (showCharacterInput === 3 ? <CharacterConfigurator characterId={3} submittedData={(data) => {handleCharacterInputSubmit(data, 3)}}/> : ""
   ));

   // 4 shows the optional context/situation text input and submit button
   const submitInputGroup = showCharacterInput === 4 ? <><p>Optionally - enter the situation in which your characters have foud themselves:</p>
   <input className={"textInput"} onChange={handleInputChange} type="text"/>
   <button className={"button"} onClick={callLambda}>Tell Me A Story!</button></> : "";
  

  // Auto-scroll to bottom when new text is displayed
  useEffect(() => {
    if (!disableScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [disableScroll, displayedText]);

  const handleShowHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
  }
//  todo: is this supposed to be here?
  <FontAwesomeIcon icon={faXmark} onClick={() => {setShowHowItWorks(false)}} className={"flashing-icon close-icon"} 
    title="Close"/>

  var howAppWorksHtml = <>
    <FontAwesomeIcon icon={faXmark} onClick={() => {setShowHowItWorks(false)}} className={"flashing-icon close-icon"} 
      title="Close"/>
    <h4>How it works:</h4> 
    <ol>
      <li>This functionality is coming soon.</li>
      <li>Essentially you will be able to create 3 characters with a wide variety of features and idiosyncracies, and enter an optional situation.</li>
      <li>OpenAI, Google Gemini and Anthropic Claude will then be called upon to play each of the characters, carrying out a converstaion and acting out a virtual 'skit' based on your inputs.</li>
      <li>The response is then returned by Lambda to display here.</li>
    </ol>
  </>

  const howAppWorks = (
    <div className={`how-it-works-container ${showHowItWorks ? 'expanded' : 'collapsed'}`}>
      {howAppWorksHtml}
    </div>
  );

  const characterInputsItems = characterInputs.map(function(input, i){
    return <li key={i}>Character {i+1} is {input}</li>
  });

  const characterInputsDisplay = (
    <div className={`how-it-works-container expanded character-input-display`}>
      {characterInputsItems}
    </div>
  );
  

  return (
    <>
      <div className={"formDiv"}>
        <div className={"pageDescription"}>
          <p>
            You will create 3 characters, then optionally enter a scenario.
            This tool will then carry out a story-like conversation with OpenAI, Google Gemini, and Anthropic Claude 
            playing the parts of each character.
            <FontAwesomeIcon 
              className={"flashing-icon"}
              icon={faCircleQuestion} 
              onClick={handleShowHowItWorks} 
              title="How does it work?"
            />
          </p>
          {howAppWorks}
          {characterInputs ? <ul>{characterInputsDisplay}</ul> : "no input"}
        </div>
          {characterInputGroup}
          {submitInputGroup}
        {/* <span> error: {enteredSituationError}</span> */}
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

export default StoryMaker;