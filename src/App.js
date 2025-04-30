import React, { useState, useEffect, useRef, Children } from 'react';
import './App.css';
import AILogo from './components/AILogo';
import { testPost } from './lib/LambdaHelper';
import TypingEffectWithMarkup from './components/TypingEffectWithMarkup';
import { marked } from 'marked';
import Modal from "./components/Modal" 
import FlashingText from './components/FlashingText';


function App() {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [typingContent, setTypingContent] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // update state values
  const handleInputChange = (event) => {
    setEnteredUrl(event.target.value);
  };

  // converts markup response from lambda to HTML
  useEffect(() => {
    const theHtmlResponse = marked(postResponse)
    setHtmlResponse(theHtmlResponse)
  }, [postResponse]);

  // website summary call
  const callLambda = () => {
    if (enteredUrl < 3) {
      setEnteredUrlError(true);
    } else {
      setEnteredUrlError(false);
      try {
        setPostResponse("");
        setIsLoading(true);
        console.log("lambda call")
        testPost(enteredUrl, setPostResponse, setIsLoading);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } 
    }  
  }


  // handle auto-scrolling when response/answer is written out
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    console.log('doScroll')
    scrollToBottom()
  }, [typingContent]);

 
  const howAppWorks = "<h4>How it works:</h4> <ol>\
  <li>The url entered is submitted to a Lambda function via API Gateway</li>\
  <li>Which attempts to scrape all content from the site homepage</li>\
  <li>This content is then submitted to OpenAI, requesting a summary</li>\
  <li>Which is then returned as long as the url is valid and the site is not loaded via JavaScript</li>\
  </ol>"

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
            <p className={"directions"}>Please enter a website url.  
              This tool will return a general summary of the homepage:</p>
            <input className={inputClasses} onChange={handleInputChange} type="text"/>
            <button className={"button"} onClick={callLambda}>Call Lambda</button>
            <span> error: {enteredUrlError}</span>
          </div>
          <div className={"resultsDiv"} >
            { !htmlReponse ? 
            <div dangerouslySetInnerHTML={{ __html: howAppWorks }} />:<TypingEffectWithMarkup content={htmlReponse} setTypingContent={setTypingContent} />}
          </div>
          <div ref={messagesEndRef}/>
      </section>
      </header>
      <Modal isLoading={isLoading}/>
    </div>
  );
}

export default App;


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
