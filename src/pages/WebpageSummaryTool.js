import { useState, useEffect, useRef } from 'react';
import { fetchWebSummary } from '../lib/AWSHelper';
import { marked } from 'marked';
import FlashingText from '../components/FlashingText';
import { removeNonUrlCharacters } from '../lib/ValidationHelper';
import TextInput from '../components/simple/TextInput';
import ButtonControl from '../components/simple/ButtonControl';


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
  const lockTextInput = isDone || isStarted;


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
        setDisplayedText(htmlReponse)
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
  const callLambda = async () => {
    if (!haveValidData(enteredUrl)) {
      setEnteredUrlError(true);
      setEnteredUrlErrorMessage("Entered url is invalid.");
      return false;
    } else {
      setEnteredUrlError(false);
      try {
        setIsLoading(true, "lambda");
        await fetchWebSummary(enteredUrl, setPostResponse, setIsLoading);
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

  const clearUrlInput = () => {
    setEnteredUrl("");
    setEnteredUrlError(false)
    setEnteredUrlErrorMessage("");
    setValidUrl(false);
  }


  /***********HELPER FUNCTIONS ************/
  const resetState = () => {
    setHtmlResponse("");
    setPostResponse("");
    clearUrlInput();
    setDisableScroll(false);
    setDisplayedText("");
    setIsDone(false);
  }

  const haveValidData = (enteredValue) => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
    let b_validData = enteredValue && enteredValue.length > 3 && urlPattern.test(enteredValue);
    return b_validData;
  };
  

  /********** DISPLAY FUNCTIONS ***********/
  const textForFlashing = validUrl ? "Valid url: " + enteredUrl : "Entered url: " + enteredUrl;
  const enteredUrlDisplay = !enteredUrl ? <span className="bold">Please enter url:</span> : 
    <FlashingText interval={750} text={textForFlashing} boldText={true}/>;

  const textDisplay = <TextInput 
    enteredValue={enteredUrl} 
    handleOnChange={handleEnteredUrlChange} 
    isError={enteredUrlError} 
    errorMessage={enteredUrlErrorMessage}
    validData={validUrl}
    halfWidth={true}
    isDisabled={lockTextInput}
    handleClear={clearUrlInput}
    isClearButton={enteredUrl && !lockTextInput}
  />

  const mainButton = isDone ? 
    <ButtonControl variation={'resetButton'} onPress={resetState} text={"Start Over"}/> : 
    <ButtonControl isDisabled={lockTextInput} variation={'submitRequest'} onPress={callLambda} text={"Get Summary"} /> ;
  
  const stopScrollButton = (isStarted && !isDone && !disableScroll) ? 
    <div className={"commonDiv"}>
      <ButtonControl variation={"cancelScroll"} onPress={() => {setDisableScroll(true)}} text={"Disable Auto-Scroll"}/>
    </div>
      : "";
  
  return (
    <div className="content">
      <div className={"formDiv"}>
          <div className={"commonDiv"}>
            {enteredUrlDisplay}
          </div>
          {textDisplay}
        <div className={"commonDiv"}>
          {mainButton}
        </div>
      </div>
      <div className={"commonDiv"}>
        <div className={"resultsDiv"} >
          <div className={"innerResultsDiv"}>
            <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? `<span class="bold">Results Will Display Here</span>` : displayedText }} />
            <div>
              {isDone ? <p>Done!</p> : ""}
            </div>
          </div>
        </div>
      </div>
      
      <div ref={messagesEndRef}/>
      {stopScrollButton}
    </div>
  );
}

export default WebpageSummaryTool;
