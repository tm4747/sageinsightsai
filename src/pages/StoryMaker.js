import React, { useState, useEffect, useRef } from 'react';
import './css/PageCommon.css';
import './css/StoryMaker.css';
import { marked } from 'marked';
import CharacterConfigurator from "../components/CharacterConfigurator"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { fetchStoryFromLambda, fetchAudioFromLambda } from '../lib/LambdaHelper';
import { getRandomSituation } from '../lib/CharacterConfiguratorHelper';
import AILogo from '../components/AILogo';


// todo: audioUrl must be an array of audio files, and map function must be used to play them all. 

function StoryMaker({setIsLoading}) {

  const getSituation = () => {
    return getRandomSituation() + '.';
  }

  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  // TODO: remove test data from next default
  const [enteredSituation, setEnteredSituation] = useState(getSituation());
  const [disableScroll, setDisableScroll] = useState(false);
  const [showCharacterInput, setShowCharacterInput] = useState(1);
  const [characterInputs, setCharacterInputs] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const textareaRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioUrl2, setAudioUrl2] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false); // Track if audio is ready
  const [isAudioReady2, setIsAudioReady2] = useState(false); // Track if audio is ready
  const [polling, setPolling] = useState(false); // Track if polling is active
  const [polling2, setPolling2] = useState(false); // Track if polling is active
  const [audioUrlError, setAudioUrlError] = useState(false); // Error state in case audioUrl is still not valid
  const [audioUrlError2, setAudioUrlError2] = useState(false); // Error state in case audioUrl is still not valid
  const [remainingStory, setRemainingStory] = useState("");


  //typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  //scroll vars
  const messagesEndRef = useRef(null);

   // update state values
  const handleInputChange = (event) => {
    setEnteredSituation(event.target.value);
    adjustTextareaSize();
  };

  const adjustTextareaSize = () => {
    const textarea = textareaRef.current;
    if(textarea){
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }

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
      // Todo: change the following back to 1
    }, .1); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [htmlReponse]);

  // converts markup response from lambda to HTML
  useEffect(() => {
    const theHtmlResponse = marked(postResponse)
    setHtmlResponse(theHtmlResponse)
  }, [postResponse]);

  // StoryMaker Labmda call
  const fetchStory = () => {
    setPostResponse("");
    setHtmlResponse("");
    setDisplayedText("");
    if(haveValidData()){
      try {
        setIsLoading(true);
        const inputData = getDataArray();
        console.log("lambda call next")
        fetchStoryFromLambda(inputData, setPostResponse, setIsLoading);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } 
    }
  }

  // useEffect(() => {
  //   if (htmlReponse && htmlReponse.length > 100) {
  //     fetchAudio(htmlReponse); // This will call the getAudio function with the text and retrieve the audio
  //   }
  // }, [htmlReponse]);
  
  
  const fetchAudio = async () => {
    if(postResponse){
      try {
        let useablePostResponse = removeSpecialChars(postResponse);
        useablePostResponse = removeIntroMaterial(useablePostResponse);
        const first4000Characters = useablePostResponse.substring(0,4000);
        const remainingChars = useablePostResponse.substring(3980, 7980);
        setRemainingStory(remainingChars);
        console.log(["first4000Characters", first4000Characters])
        setIsLoading(true);
        const audioUrl = await fetchAudioFromLambda(first4000Characters); // Assuming this function returns the URL of the audio file
        const audioUrl2 = await fetchAudioFromLambda(remainingChars); // Assuming this function returns the URL of the audio file
    
        // Set the audio URL
        setAudioUrl(audioUrl); 
        setAudioUrl2(audioUrl2); 
        setPolling(true); // Start polling
        setPolling2(true); // Start polling
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching audio:", error);
        setIsLoading(false);
      }
    }
  };
  
  const removeSpecialChars = (str) => {
    return str.replace(/(\r\n|\n|\r)/g, "").replace(/"/g, "'");
  }

  const removeIntroMaterial = (str) => {
    const index = str.indexOf("Here is your story");
    return str.substring(index);
  }

  const getDataArray = () => {
    const inputData = {
      data:  {
        situation: enteredSituation,
        character1: characterInputs[0],
        character2: characterInputs[1],
        character3: characterInputs[2],
      }
    };
    return inputData;
  }


  const haveValidData = () => {
    let b_validData = true;
    b_validData = (characterInputs[0] && characterInputs[0].length > 5) ? b_validData : false;
    b_validData = (characterInputs[1] && characterInputs[1].length > 5) ? b_validData : false;
    b_validData = (characterInputs[2] && characterInputs[2].length > 5) ? b_validData : false;
    return b_validData;
  }


  // handle each character input submit - should be 2 variables - a sentence of description and optional contextual situation
  const handleCharacterInputSubmit = (data, index) => {
    const nextCharacterInputIndex = index + 1;
    addNewValue(data)
    setShowCharacterInput(nextCharacterInputIndex);
  }

  const addNewValue = (newValue) => {
    setCharacterInputs(characterInputs => [...characterInputs, newValue]);
  };

  const clearInputs = () => {
    setEnteredSituation(getSituation());
    setCharacterInputs([]);
    adjustTextareaSize();
    setShowCharacterInput(1);
  };
  
  
  // which character input (1, 2, or 3) should show
  const characterInputGroup = showCharacterInput === 1 ? 
  <CharacterConfigurator characterId={1} submittedData={(data) => {handleCharacterInputSubmit(data, 1)}}/> :
  (showCharacterInput === 2 ? <CharacterConfigurator characterId={2} submittedData={(data) => {handleCharacterInputSubmit(data, 2)}}/> :
    (showCharacterInput === 3 ? <CharacterConfigurator characterId={3} submittedData={(data) => {handleCharacterInputSubmit(data, 3)}}/> : ""
   ));

   // 4 shows the optional context/situation text input and submit button
   // TODO: remove fetchAudio button after testing
   const submitInputGroup = showCharacterInput === 4 ? <><p>Your characters have found themselves in the following situation.  Please feel free to change or delete it:</p>
   <textarea ref={textareaRef} className="text-input textarea-input" value={enteredSituation} 
                  onChange={handleInputChange} rows={1}/>
   <button className={"button"} onClick={fetchStory}>Tell Me A Story!</button>
   <button className={"button"} onClick={clearInputs}>Clear Inputs</button>{postResponse ? 
   <button className={"button"} onClick={fetchAudio}>Fetch Audio</button> : ""}</> : "";
  

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
    <div className={"how-it-works-container expanded character-input-display"}>
      <ul>
        {characterInputsItems}
      </ul>
    </div>
  );

   // Polling function to check if audio file is available
   useEffect(() => {
    let intervalId;

    if (polling && audioUrl) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(audioUrl);
          console.log("results", res);
          if (res.ok) {
            setIsAudioReady(true); // Audio file is available, enable the audio player
            clearInterval(intervalId); // Stop polling
          } else {
            setAudioUrlError(true);
          }
        } catch (error) {
          console.error('Error fetching audio:', error);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on component unmount or when polling is stopped
    };
  }, [polling, audioUrl]);


   // Polling function to check if audio file is available
   useEffect(() => {
    let intervalId;

    if (polling2 && audioUrl2) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(audioUrl2);
          console.log("results", res);
          if (res.ok) {
            setIsAudioReady2(true); // Audio file is available, enable the audio player
            clearInterval(intervalId); // Stop polling
          } else {
            setAudioUrlError2(true);
          }
        } catch (error) {
          console.error('Error fetching audio:', error);
        }
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId); // Cleanup on component unmount or when polling is stopped
    };
  }, [polling2, audioUrl2]);

   
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
          {characterInputs && characterInputs.length > 0 ? <>{characterInputsDisplay}</> : ""}
        </div>
          {characterInputGroup}
          {submitInputGroup}
          {audioUrl ? <div className="audio-player-container">
            {audioUrl && !isAudioReady ? (
              <p><AILogo size={".75em"}/> &nbsp; Your Part 1 Audio is being processed and might take a minute. Please wait...</p> // Display a waiting message until the file is ready
            ) : (
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div> : ""}

          {audioUrl2 ? <div className="audio-player-container">
            {audioUrl2 && !isAudioReady2 ? (
              <p><AILogo size={".75em"}/> &nbsp; Your Part 2 audio is being processed and might take a minute. Please wait...</p> // Display a waiting message until the file is ready
            ) : (
              <audio controls>
                <source src={audioUrl2} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div> : ""}
          
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
      {audioUrlError && audioUrlError2 && remainingStory ? <span>&nbsp;</span> : ""}
    </>
  );
}

export default StoryMaker;