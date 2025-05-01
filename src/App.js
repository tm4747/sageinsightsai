import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AILogo from './components/AILogo';
import { testPost } from './lib/LambdaHelper';
import { marked } from 'marked';
import Modal from "./components/Modal" 
import FlashingText from './components/FlashingText';


function App() {
  const [htmlReponse, setHtmlResponse] = useState();
  const [postResponse, setPostResponse] = useState('');
  const [enteredUrl, setEnteredUrl] = useState('');
  const [enteredUrlError, setEnteredUrlError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //typing effect
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  // update state values
  const handleInputChange = (event) => {
    setEnteredUrl(event.target.value);
  };

  //typing effect
  useEffect(() => {
    if (!htmlReponse) return;  // No htmlReponse to display

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + htmlReponse[currentIndex]);
        currentIndex += 1;

      // If we've added all characters, stop the typing effect
      if (currentIndex === htmlReponse.length) {
        clearInterval(typingInterval);
        setIsDone(true);
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
  }, [displayedText]);

 
  var howAppWorks = "<h4>How it works:</h4> <ol>";
  howAppWorks += "<li>A valid url must be entered which is then submitted to a Lambda function via AWS API Gateway.</li>"
  howAppWorks += "<li>The Lambda function then attempts to pull and parse all content from the site homepage.</li>"
  howAppWorks += "<ul><li><strong>Please note:</strong> this tool may not be able to retrieve site content if it is loaded via JavaScript such as is the case for a ReactJS app.</li></ul>"
  howAppWorks += "<li>The Lambda function then submits this content to OpenAI via API, requesting a summary.</li>"
  howAppWorks += "<li>The response is then returned by Lambda to display here.</li></ol>"

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
            {/* <span> error: {enteredUrlError}</span> */}
          </div>
          <div className={"resultsDiv"} >
            <div dangerouslySetInnerHTML={{ __html: !htmlReponse ? howAppWorks : displayedText }} />
            <div>
              {isDone && <p>Done typing!</p>}
            </div>
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

const testHtml = () => {
  return "\
  This is the summary:\
East Coast Bow Thrusters: Overview and Services\
Company Introduction\
East Coast Bow Thrusters is a specialized service provider dedicated to the installation of bow thrusters and stern thrusters, with a commitment to delivering high-quality workmanship backed by over 50 years of experience in the marine industry. The company’s owner, Joe Molinaro, brings an extensive background in fiberglass repair, boat building, and thruster installations, establishing a reputation for excellence along the East Coast and the Great Lakes region.\
Services Offered\
The primary service provided by East Coast Bow Thrusters involves mobile installations of Vetus bow thrusters at various locations, including marinas and boatyards. Their trained crew travels throughout the East Coast, from Maine to Virginia, ensuring that customers receive professional, efficient service right at their location. The installation process guarantees not only the function but also the aesthetic appeal of the modifications being made, with personal oversight from Joe himself.\
The company guarantees competitive pricing by utilizing a bulk purchasing strategy and a developed system for optimal installation efficiency. This allows them to provide complete installation quotes that cover all components, labor, and necessary cleanup, helping customers save money while receiving top-notch service.\
Customer Commitment\
East Coast Bow Thrusters prides itself on its commitment to customer satisfaction. With a focus on promptness and professionalism, the team ensures that installations are conducted in a timely manner without compromising quality. Each installation is meticulously overseen, reflecting Joe’s values and high standards in craftmanship.\
The clientele includes a diverse range of boat owners, from those with custom sailboats to commercial vessels like trawlers and naval ships. This versatility speaks to the company's capability to handle a variety of needs, making them a go-to choice for boat enhancements.\
Company Culture\
The culture at East Coast Bow Thrusters reflects a deep passion for boating and craftsmanship. With over five decades of hands-on experience, there is a pronounced emphasis on professionalism, quality, and customer relationships. Joe's commitment to personally guiding each installation exemplifies the personalized approach taken towards customer service, enabling them to build lasting relationships and trust within the boating community.\
Work Environment\
The company is currently seeking new talent as indicated by a dedicated “Help Wanted” section on their website. It highlights their openness to bringing in fresh faces who are eager to learn and contribute to this established business. The inclusion of job opportunities emphasizes the company's growth and its values of fostering a supportive and skilled workforce.\
Conclusion\
East Coast Bow Thrusters stands out as a premier provider for bow and stern thruster installations. With a strong commitment to quality, customer satisfaction, and a wealth of experience, they continue to serve a wide array of customers along the East Coast and beyond. Whether you are looking to enhance your own vessel or seeking professional opportunities, East Coast Bow Thrusters delivers exceptional service and a collaborative work environment. For inquiries or quotes, customers and prospective employees are encouraged to reach out directly via phone.\
For more information, visit East Coast Bow Thrusters.\
undefined\
Done typing!\
"
}