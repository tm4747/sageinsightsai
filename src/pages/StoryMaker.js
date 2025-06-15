import React, { useState, useEffect, useRef } from 'react';
import styles from './css/PageStyles.module.css';
import { marked } from 'marked';
import CharacterConfigurator from "../components/CharacterConfigurator"
import { fetchStoryFromLambda, fetchAudioFromLambda } from '../lib/LambdaHelper';
import { getRandomSituation } from '../lib/CharacterConfiguratorHelper';
import AILogo from '../components/AILogo';
import Slider from '../components/simple/Slider';
import FlashingText from '../components/FlashingText';
import BoxList from '../components/BoxList';
import { getStoryMakerHowItWorks } from '../lib/DataHelper';
import PageDescription from '../components/PageDescription';


function StoryMaker({setIsLoading}) {
  const [begun, setBegun] = useState(false);
  const [htmlResponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [levelOfRealism, setLevelOfRealism] = useState(1);
  const [getEdgy, setGetEdgy] = useState(false);
  const [enteredSituation, setEnteredSituation] = useState(getRandomSituation(levelOfRealism, getEdgy));
  const [disableScroll, setDisableScroll] = useState(false);
  const [showCharacterInput, setShowCharacterInput] = useState(1);
  const [characterInputs, setCharacterInputs] = useState([]);
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
  const pageBodyRef = useRef(null); 



  /********* USE EFFECTS & API CALLS **********/

  // GET STORY AUDIO LAMBDA - send text to text file in S3 and url to file
  const fetchAudio = async () => {
    if(postResponse){
      try {
        const bucketPath = "https://sageinsightsai-audio.s3.amazonaws.com/";
        let useablePostResponse = removeSpecialChars(postResponse);
        useablePostResponse = removeIntroMaterial(useablePostResponse);
        setIsLoading(true);

        // Create filename for the text file
        const timestamp = Math.floor(Date.now() / 1000);
        const s3FileName = `story-${timestamp}.txt`;

        try {
          const apiKey = process.env.REACT_APP_API_KEY;
          // Get pre-signed URL from Lambda (through API Gateway)
          const presignResponse = await fetch('https://z9k5p8h1lg.execute-api.us-east-1.amazonaws.com/Prod/generate-upload-url', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileName: s3FileName })
          });

          if (!presignResponse.ok) {
            throw new Error('Failed to get pre-signed URL');
          }

          const { uploadURL } = await presignResponse.json();

          // Upload the text using fetch
          const uploadResponse = await fetch(uploadURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'text/plain'
            },
            body: useablePostResponse
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload to S3');
          } else {
            console.log("file upload successful", s3FileName);
          }

          const audioUrl = await fetchAudioFromLambda(bucketPath + s3FileName);
          setAudioUrl(audioUrl); //  Set the audio URL 
          scrollToPageBody();
          setPolling(true); // Start polling
          setIsLoading(false);

        } catch (error) {
          console.error('Error uploading to S3:', error.message);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error sending story text to S3:", error);
        setIsLoading(false);
      }
    }
  };
  
  // TYPING EFFECT DISPLAY RESULTS 
  useEffect(() => {
    if (!htmlResponse) return;
    setDisableScroll(false)
    setIsDone(false);
    setIsStarted(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
        // and advanced currentIndex to where it should then be (character after last piece of html tag)
        setDisplayedText((prev) => prev + htmlResponse[currentIndex]);
        currentIndex += 1;
      // If we've added all characters, stop the typing effect
      if (currentIndex === htmlResponse.length) { 
        clearInterval(typingInterval);
        setDisplayedText(htmlResponse);
        setIsDone(true);
        setIsStarted(false);
      }
    }, .05); // Adjust speed here (50ms per character)

    return () => clearInterval(typingInterval); // Cleanup the interval
  }, [htmlResponse]);

  // converts response from lambda to marked-up HTML
  useEffect(() => {
    const theHtmlResponse = marked(postResponse)
    setHtmlResponse(theHtmlResponse)
  }, [postResponse]);

  // GET STORY TEXT LAMBDA
  const fetchStory = () => {
    if(haveValidData()){
      try {
        setIsLoading(true);
        const inputData = getDataArray();
        fetchStoryFromLambda(inputData, setPostResponse, setIsLoading);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } 
    }
  }
  

  // POLLING function to check if audio file is available
  useEffect(() => {
    let intervalId;
    if (polling && audioUrl) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(audioUrl);
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

 
  /********** DYNAMIC JS FUNCTIONS **********/ 
  const scrollToPageBody = () => {
    setTimeout(() => {
      pageBodyRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }
  const resetState = () => {
    setHtmlResponse("");
    setPostResponse("");
    setEnteredSituation(getRandomSituation(levelOfRealism, getEdgy));
    setDisableScroll(false);
    setShowCharacterInput(1);
    setCharacterInputs([]);
    setAudioUrl(null);
    setIsAudioReady(false);
    setPolling(false);
    setAudioUrlError(false);
    setDisplayedText("");
    setIsDone(false);
    setIsStarted(false);
    adjustTextareaHeight();
  }

  const fetchAudioAndScrollUp = () => {
    setDisableScroll(true);
    fetchAudio();
  }

  const handleSituationInputChange = (event) => {
    setEnteredSituation(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    setTimeout(() => {
      const textarea = textareaRef.current;
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
    scrollToPageBody();
  }

  const addNewCharacter = (newValue) => {
    setCharacterInputs(characterInputs => [...characterInputs, newValue]);
  };

  const handleBegin = () => {
    setBegun(true);
    scrollToPageBody();
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

  const datafyCharacterInputs = (data) => {
    const dataArray = [];
    for(var x = 0; x < data.length; x++){
      dataArray.push({"heading": "Character " + (x + 1) + ": ", "text" : data[x]});
    }
    return { "data": dataArray};
  }


  /********** DISPLAY FUNCTIONS ***********/
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"button btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";
  const fetchAudioButtonBottom = (postResponse && (!polling && !isAudioReady)) ? 
    <button className={"button btnCancelScroll purple-button"} onClick={fetchAudioAndScrollUp}>Get Audio</button> : ""; 

  // which showCharacterInput (1, 2, or 3) should show
  const characterInputGroup = showCharacterInput === 1 ? 
  <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={1} submittedData={(data) => {handleCharacterInputSubmit(data, 1)}}/> :
  (showCharacterInput === 2 ? <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={2} submittedData={(data) => {handleCharacterInputSubmit(data, 2)}}/> :
    (showCharacterInput === 3 ? <CharacterConfigurator levelOfRealism={levelOfRealism} getEdgy={getEdgy} setGetEdgy={setGetEdgy} characterId={3} submittedData={(data) => {handleCharacterInputSubmit(data, 3)}}/> : ""
  ));

  // showCharacterInput 4 shows the optional context/situation text input and submit button
  const situationHtml = !postResponse ? <><p className={"pStandard bold"}>Your characters have found themselves in the following situation 
    <span className={"small-text italic"}> &nbsp; (which can be altered or deleted):</span></p>
  <textarea ref={textareaRef} className="text-input textarea-input" value={enteredSituation} 
                  onChange={handleSituationInputChange} rows={1}/></> : "";
  const getADifferentSituationButton = !postResponse ? <button className={"button yellow-button"} onClick={handleGetDifferentSituation}>Get A Different Situation</button> : "";
  const tellMeAStoryButton = !postResponse ? <button className={"button green-button"} onClick={fetchStory}>Tell Me A Story!</button> : "";
  const submitInputGroup = showCharacterInput === 4 ? <>
  {situationHtml}
  {tellMeAStoryButton}
  {getADifferentSituationButton}
  <button className={"button red-button"} onClick={resetState}>Clear And Start Over</button></> : "";

  const formattedCharacterData = datafyCharacterInputs(characterInputs);
  const characterInputsDisplay = <BoxList title={""} data={formattedCharacterData} showBoxList={true} 
  setShowBoxList={() => {return null;}} showCloseButton={false} listType={"ul"}/>

  const displayAudio = (audioUrl ? <div className="audio-player-container">
  {audioUrl && !isAudioReady ? ( // Display a waiting message until the file is ready
    <p>
      <AILogo size={".75em"}/> 
      <FlashingText text={'&nbsp; Your Audio File is being processed and might take up to a couple minutes. Please check back shortly...'} htmlEntities={true}/>
    </p> 
  ) : (
    <>
    <audio controls>
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio> 
    <h6 className={"no-margin-padding"}>
      <FlashingText text={'To download file click \'<strong>&#8942;</strong>\' &uarr;'} htmlEntities={true}/>
    </h6>
    </>
  )}
</div> : "")

const displaySlider = <Slider label={"First Set Level of Realism:"} setValue={setLevelOfRealism} initialValue={levelOfRealism} showEdgy={getEdgy} />


  if(!begun) return(
          <div className={styles.content}>
           <div className={"formDiv"}>
             <div className={"pageDescription"}>
                <button className={"button green-button margin-top"} onClick={handleBegin}>Begin!</button>
            </div>
           </div>
          </div>)
   
  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <div ref={pageBodyRef}  className={"pageBody"}>
          {!postResponse ? displaySlider : ""}
          {!postResponse && characterInputs && characterInputs.length > 0 ? <>{characterInputsDisplay}</> : ""}
          {!postResponse ? characterInputGroup : ""}
          {submitInputGroup}
          {displayAudio}
        </div>
      </div>
      <div className={"resultsDiv"} >
        <div className={"innerResultsDiv"}>
          <div dangerouslySetInnerHTML={{ __html: !htmlResponse ? "Results Will Display Here." : displayedText }} />
          <div>
            {isDone ? <p>Done!</p> : ""}
          </div>
        </div>
      </div>
      <div ref={messagesEndRef}/>
      <div className={"divFixedBottom"}>
        {stopScrollButton}
        {fetchAudioButtonBottom} 
        {audioUrlError ? <span>&nbsp;</span> : ""}
      </div>
    </div>
  );
}

export default StoryMaker;