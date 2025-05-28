import React, { useState, useEffect, useRef } from 'react';
import './css/PageCommon.css';
import styles from './css/StoryMaker.module.css';
import { marked } from 'marked';
import CharacterConfigurator from "../components/CharacterConfigurator"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { fetchStoryFromLambda, fetchAudioFromLambda } from '../lib/LambdaHelper';
import { getRandomSituation } from '../lib/CharacterConfiguratorHelper';
import AILogo from '../components/AILogo';
import AWS from 'aws-sdk';
import Slider from '../components/simple/Slider';
import FlashingText from '../components/FlashingText';


function StoryMaker({setIsLoading}) {

  const [begun, setBegun] = useState(false);
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [levelOfRealism, setLevelOfRealism] = useState(1);
  const [getEdgy, setGetEdgy] = useState(false);
  const [enteredSituation, setEnteredSituation] = useState(getRandomSituation(levelOfRealism, getEdgy));
  const [disableScroll, setDisableScroll] = useState(false);
  const [showCharacterInput, setShowCharacterInput] = useState(1);
  const [characterInputs, setCharacterInputs] = useState([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const textareaRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false); // Track if audio is ready
  const [polling, setPolling] = useState(false); // Track if polling is active
  const [audioUrlError, setAudioUrlError] = useState(false); // Error state in case audioUrl is still not valid
  // for typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef(null); // scroll vars
  const audioPlayerRef = useRef(null); 


  /******** AWS S3 instance **********/
  const S3_BUCKET = 'sageinsightsai-audio';  // Your bucket name
  const REGION = 'us-east-1';
  const s3 = new AWS.S3({
    region: REGION,
    credentials: new AWS.Credentials({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID_S3,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY_S3,
    }),
  });


  /********* USE EFFECTS & API CALLS **********/
  // TYPING EFFECT DISPLAY RESULTS 
  useEffect(() => {
    if (!htmlReponse) return;
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
    }, .1); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [htmlReponse]);

  // converts response from lambda to marked-up HTML
  useEffect(() => {
    const theHtmlResponse = marked(postResponse)
    setHtmlResponse(theHtmlResponse)
  }, [postResponse]);

  // GET STORY TEXT LAMBDA
  const fetchStory = () => {
    resetState();
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
  
  const resetState = () => {
    setPostResponse("");
    setHtmlResponse("");
    setDisplayedText("");
    setAudioUrl(null);
    setIsAudioReady(false);
    setPolling(false);
    setAudioUrlError(false);
  }

  // GET STORY AUDIO LAMBDA - send text to text file in S3 and url to file
  const fetchAudio = async () => {
    if(postResponse){
      try {
        let useablePostResponse = removeSpecialChars(postResponse);
        useablePostResponse = removeIntroMaterial(useablePostResponse);
        console.log(["useablePostResponse", useablePostResponse])
        setIsLoading(true);

        // Create filename for the text file
        const timestamp = Math.floor(Date.now() / 1000);;
        const s3FileName = `story-${timestamp}.txt`;
        console.log('s3FileName');
        console.log(s3FileName);

        const s3Params = {
          Bucket: S3_BUCKET,
          Key: s3FileName,
          Body: useablePostResponse,
          ContentType: 'text/plain'
        };
        try {
          console.log('Try to upload to S3:')
          // Upload to S3
          const s3Upload = await s3.upload(s3Params).promise();
          console.log('Text file uploaded to S3:', s3Upload.Location);
          // Now call fetchAudioFromLambda with the S3 URL
          const audioUrl = await fetchAudioFromLambda(s3Upload.Location);
          // Set the audio URL
          setAudioUrl(audioUrl); 
          setPolling(true); // Start polling
          setIsLoading(false);
        } catch (error) {
          console.log('s3Upload');
          console.error("Error uploading to s3 or fetching audio:", error);
          setIsLoading(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error sending story text to S3:", error);
        setIsLoading(false);
      }
      
    }
  };

  const fetchAudioAndScrollUp = () => {
    // disable auto scrolling
    setDisableScroll(true);
    // scroll up to where audio element will appear
    audioPlayerRef.current?.scrollIntoView({ behavior: "smooth" });
    // fetch audio
    fetchAudio();
  }
  
  // POLLING function to check if audio file is available
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

  // Auto-scroll to bottom when new text is displayed
  useEffect(() => {
    if (!disableScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [disableScroll, displayedText]);

  const handleShowHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
  }



  /********** DYNAMIC JS FUNCTIONS *********8*/ 
  const handleSituationInputChange = (event) => {
    setEnteredSituation(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    setTimeout(() => {
      const textarea = textareaRef.current;
      console.log("try resize textarea", textarea);
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    }, 250); // Delay by 250ms (0.25 seconds)
  };
  

  // handle each character input submit - should be 2 variables - a sentence of description and optional contextual situation
  const handleCharacterInputSubmit = (data, index) => {
    const nextCharacterInputIndex = index + 1;
    addNewCharacter(data)
    setShowCharacterInput(nextCharacterInputIndex);
  }

  const addNewCharacter = (newValue) => {
    setCharacterInputs(characterInputs => [...characterInputs, newValue]);
  };

  const clearInputs = () => {
    setEnteredSituation(getRandomSituation(levelOfRealism, getEdgy));
    setCharacterInputs([]);
    adjustTextareaHeight();
    setShowCharacterInput(1);
  };

  const handleBegin = () => {
    setShowHowItWorks(false);
    setBegun(true);
  }
  
  const handleGetDifferentSituation = () => {
    setEnteredSituation(getRandomSituation(levelOfRealism, getEdgy));
    adjustTextareaHeight();
  }



  /******** HELPER FUNCTIONS **********/
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


  /********** DISPLAY FUNCTIONS ***********/
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"button btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";
  const fetchAudioButtonBottom = (postResponse) ? <button className={"button btnCancelScroll fetchAudioBottom purple-button"} onClick={fetchAudioAndScrollUp}>Get Audio</button> : ""; 

  // which character input (1, 2, or 3) should show
  const characterInputGroup = showCharacterInput === 1 ? 
  <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={1} submittedData={(data) => {handleCharacterInputSubmit(data, 1)}}/> :
  (showCharacterInput === 2 ? <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={2} submittedData={(data) => {handleCharacterInputSubmit(data, 2)}}/> :
    (showCharacterInput === 3 ? <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={3} submittedData={(data) => {handleCharacterInputSubmit(data, 3)}}/> : ""
  ));

  // 4 shows the optional context/situation text input and submit button
  // TODO: move fetchAudio button to different location 
  const getADifferentSituationButton = !postResponse ? <button className={"button yellow-button"} onClick={handleGetDifferentSituation}>Get A Different Situation</button> : "";
  const tellMeAStoryButton = !postResponse ? <button className={"button green-button"} onClick={fetchStory}>Tell Me A Story!</button> : "";
  const submitInputGroup = showCharacterInput === 4 ? <><p className={"pStandard"}>Your characters have found themselves in the following situation 
    <span className={"small-text italic"}> &nbsp; (which can be altered or deleted):</span></p>
  <textarea ref={textareaRef} className="text-input textarea-input" value={enteredSituation} 
                  onChange={handleSituationInputChange} rows={1}/>
  {tellMeAStoryButton}
  {getADifferentSituationButton}
  <button className={"button red-button"} onClick={clearInputs}>Clear And Start Over</button></> : "";

  var howAppWorksHtml = <>
    <FontAwesomeIcon icon={faXmark} onClick={() => {setShowHowItWorks(false)}} className={"flashing-icon close-icon"} 
      title="Close"/>
    <h4>How it works:</h4> 
    <ol>
      <li>First, you create 3 characters, either from a variety of presets, or by adding in your own custom values.</li>
      <li>Next, a random situation will be suggested.  You are free to modify this or delete it altogether.</li>
      <li>The characters and situation are then sent to a lambda function that will generate a story using LLMs from OpenAI, Google Gemini and Anthropic Claude, which each will be called to play each of the characters, carrying out a converstaion and acting out a virtual 'skit'.</li>
      <li>When this text begins to appear, you have the option to generate an audio file where a narrator will read the story.  This is done through a series of calls to lambda, AWS S3 and openAI's audio model, as the story text will often exceed the 4096 character limit of Lambda, and the generation of the audio file will exceed the 30 second max response time of AWS API Gateway.</li>
      <li>Audio file generation can take up to a couple minutes.  There is a polling funcitionality in place to check every 5 seconds to see if the file is ready.  Once it's ready, you'll be able to play it through the audio player which appears.</li>
    </ol>
  </>

let howItWorksStyles = 'how-it-works-container ';
howItWorksStyles += showHowItWorks ? 'expanded' : 'collapsed';
  const howAppWorks = (
    <div className={howItWorksStyles}>
      {howAppWorksHtml}
    </div>
  );

  const descriptionOfPageFunction = (
    <p className={"pStandard"}>
      You will create 3 characters and an optional scenario, then generate a short story with OpenAI, Google Gemini, and Anthropic's Claude playing each character.
      <FontAwesomeIcon 
        className={"flashing-icon"}
        icon={faCircleQuestion} 
        onClick={handleShowHowItWorks} 
        title="How does it work?"
      />
    </p>
  );

  // CHARACTER INPUT DISPLAY
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

  if(!begun) return(
          <div className={styles.content}>
           <div className={"formDiv"}>
             <div className={"pageDescription"}>
                {descriptionOfPageFunction}
                {howAppWorks}
                <button className={"button green-button"} onClick={handleBegin}>Begin!</button>
            </div>
           </div>
          </div>)
   
  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <div className={"pageDescription"}>
          {descriptionOfPageFunction}
          {howAppWorks}
        </div>
        <div className={"pageBody"}>
          <Slider label={"First Set Level of Realism:"} setValue={setLevelOfRealism} initialValue={levelOfRealism} showEdgy={getEdgy} />
          {characterInputs && characterInputs.length > 0 ? <>{characterInputsDisplay}</> : ""}
          {characterInputGroup}
          {submitInputGroup}
          {audioUrl ? <div ref={audioPlayerRef} className="audio-player-container">
            {audioUrl && !isAudioReady ? (
              <p><AILogo size={".75em"}/> &nbsp; Your Audio File is being processed and might take up to a couple minutes. Please check back shortly...</p> // Display a waiting message until the file is ready
            ) : (
              <>
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio> 
              <h6 className={"no-margin-padding"}><FlashingText text={'&uarr; &nbsp; To download file click &nbsp; &#8942; &nbsp; &uarr;'} htmlEntities={true}/></h6>
              </>
            )}
          </div> : ""}
        </div>
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
      {fetchAudioButtonBottom}
      {audioUrlError ? <span>&nbsp;</span> : ""}
    </div>
  );
}

export default StoryMaker;