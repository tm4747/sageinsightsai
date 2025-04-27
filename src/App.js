import React, { useState, useEffect } from 'react';
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
  const [enteredUrl, setEnteredUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          setIsLoading(true);
          console.log("lambda call")
          testPost(enteredUrl, setPostResponse, setIsLoading);
        } catch (error) {
          console.error('Error fetching summary:', error);
        } 
      }
    }

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
              This tool will return a general summary of all site content:</p>
            <input className={"textInput"} onChange={handleInputChange} type="text"/>
            <button className={"button"} onClick={callLambda}>Call Lambda</button>
          </div>
          <div className={"resultsDiv"}>
            { !htmlReponse ? <h5>Post Response:</h5>:<TypingEffectWithMarkup content={htmlReponse} />}
          </div>
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
