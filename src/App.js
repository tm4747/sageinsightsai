import React, { useState, useEffect } from 'react';
import logo from './logo-gear.png';
import './App.css';

function App() {
  console.log("here")

    const [response, setResponse] = useState('');
  
    useEffect(() => {
      // Replace with your API endpoint
      const apiUrl = 'https://z9k5p8h1lg.execute-api.us-east-1.amazonaws.com/Prod/hello';
      
      // Fetch data from the API (Lambda function) 
      console.log("here1")
      const fetchData = async () => {
      console.log("here2")
        try {
          console.log("here3")
          const res = await fetch(apiUrl, {
            method: 'GET', // HTTP method
            headers: {
              'x-api-key': 'f37pZl1p3M5pfPKAGn1pH1dPjSNirLGL8CTb7lvC', // If API Key is required
            },
          });
  
          const data = await res.json();  // Parse JSON response
          setResponse(data.message);      // Update state with the response
          console.log("data message")
          console.log(data.message)
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
  
      fetchData();
    }, []);

    const callLambda = () => {
      console.log("lambda call")
    }

  return (
    <div className="App">
      <header className="App-header">
        <h2 className={"pageTitle"}>
        <AILogo size={".75em"}/> &nbsp; 
          <TypingText text={"Welcome to Sage Insights AI!"} flashingText={" _ "}/>
        </h2>
        <div className="body">
        <p className={"directions"}>Please enter a website url.  
            This tool will return a general summary of all site content:</p>
          <input className={"textInput"} type="text"/>
          <button className={"button"} onClick={callLambda}>Call Lambda</button>
          <p>Response: {response}</p>
      </div>
      </header>
    </div>
  );
}

export default App;

const AILogo = ({size}) => {
  return (
  <>
  <img src={logo} className={"App-logo"} alt="logo" style={{height:size}} />
  </>
  )
}

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

function FlashingText({ text, interval = 750 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(!isVisible);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isVisible]);

  return <span className={isVisible ? 'fade-in' : 'fade-out' }>{text}</span>;
}

