import { useState, useEffect, useRef } from 'react';
import styles from './css/PageStyles.module.css';
import { fetchWebSummary } from '../lib/LambdaHelper';
import { marked } from 'marked';
import FlashingText from '../components/FlashingText';
import { removeNonUrlCharacters } from '../lib/ValidationHelper';
import TextInput from '../components/simple/TextInput';


function WebpageSummaryTool({setIsLoading}) {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [enteredUrlErrorMessage, setEnteredUrlErrorMessage] = useState('');
  const [validUrl, setValidUrl] = useState(false);
  const [disableScroll, setDisableScroll] = useState(false);
  const [displayedText, setDisplayedText] = useState('');  //typing effect
  const [isDone, setIsDone] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef(null);  //scroll vars


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

  // TODO: reset state function

  // website summary call
  const callLambda = () => {
    resetState();
    if (!haveValidData(enteredUrl)) {
      setEnteredUrlError(true);
      setEnteredUrlErrorMessage("Entered url is invalid.");
      return false;
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
  const handleEnteredUrlChange = (event) => {
    const enteredValue = removeNonUrlCharacters(event.target.value);
    console.log('enteredValue', enteredValue)
    setEnteredUrl(enteredValue);
    if ( enteredValue && haveValidData(enteredValue)) {
      setEnteredUrlErrorMessage("")
      setEnteredUrlError(false);
      setValidUrl(true);
    } else {
      setEnteredUrlErrorMessage("")
      setEnteredUrlError(false);
      setValidUrl(false);
    }  
  };


  /***********HELPER FUNCTIONS ************/
  const resetState = () => {
    setPostResponse("");
    setHtmlResponse("");
    setDisplayedText("");
  }

  const haveValidData = (enteredValue) => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    let b_validData = enteredValue && enteredValue.length > 3 && urlPattern.test(enteredValue);
    return b_validData;
  };
  

  /********** DISPLAY FUNCTIONS ***********/
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <button className={"btnCancelScroll"} onClick={() => {setDisableScroll(true)}}>Disable Auto-Scroll</button> : "";
 
  const enteredUrlDisplay = !enteredUrl ? "Please enter url" : ( validUrl ? "Valid url: " + enteredUrl : "Entered url: " + enteredUrl);

  
  return (
    <div className={styles.content}>
      <div className={"formDiv"}>
        <TextInput 
          enteredValue={enteredUrl} 
          handleOnChange={handleEnteredUrlChange} 
          isError={enteredUrlError} 
          errorMessage={enteredUrlErrorMessage}
          validData={validUrl}
          setWidth={"50%"}/>
        <button className={"button green-button"} onClick={callLambda}>Get Summary</button>
        <p>
          <FlashingText interval={750} text={enteredUrlDisplay }/>
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

export default WebpageSummaryTool;
