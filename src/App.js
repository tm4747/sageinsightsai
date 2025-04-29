import React, { useState, useEffect, useRef, Children } from 'react';
import './App.css';
import AILogo from './components/AILogo';
import { testPost } from './lib/LambdaHelper';
import TypingEffectWithMarkup from './components/TypingEffectWithMarkup';
import { marked } from 'marked';
import Modal from "./components/Modal" 
import FlashingText from './components/FlashingText';
// test git action

function App() {
  const [htmlReponse, setHtmlResponse] = useState('');
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if the user scrolls
  const [doScroll, setDoScroll] = useState(0);


    useEffect(() => {
      const theHtmlResponse = marked(postResponse)
      setHtmlResponse(theHtmlResponse)
    }, [postResponse]);

    const handleInputChange = (event) => {
      setEnteredUrl(event.target.value);
    };

    const callLambda = () => {
      if(enteredUrl){
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
    const triggerScroll = () => {
      setDoScroll(Math.random())
    }

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
      console.log('doScroll')
      console.log(doScroll)
      scrollToBottom()
    }, [doScroll]);

 
  const howAppWorks = "<h4>How it works:</h4> 1. The input you entered is submitted to a Lambda function via API Gateway\n 2. which"

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
            <input className={"textInput"} onChange={handleInputChange} type="text"/>
            <button className={"button"} onClick={callLambda}>Call Lambda</button>
            <button className={"button"} onClick={triggerScroll}>trigger scroll</button>
            {doScroll}
          </div>
          <div className={"resultsDiv"} >
            { !htmlReponse ? 
            <div dangerouslySetInnerHTML={{ __html: howAppWorks }} />:<TypingEffectWithMarkup content={htmlReponse} />}
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
