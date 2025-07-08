import { useState } from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';
import './styles/App.css';
import Layout from './Layout';
import WebpageSummaryTool from './pages/WebpageSummaryTool';
import StoryMaker from './pages/StoryMaker';
import DifficultChoiceMaker from './pages/DifficultChoiceMaker';
import { getWebSummaryHowItWorks, getStoryMakerHowItWorks, getDifficultChoiceMakerHowItWorks } from './lib/DataHelper';
import LoadingModal from './components/modals/LoadingModal';


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLambdaLoading, setIsLambdaLoading] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const featureFlagShowBeta = process.env.REACT_APP_ENV !== "prod";
  // const featureFlagDevOnly = process.env.REACT_APP_ENV === "dev";
  const featureFlagDevOnly = false;

  const pages = [
    { key: "webSummary", url: "/", active: path === "/", label: "Web Summary", howItWorks: getWebSummaryHowItWorks(), description: "Please enter a website url. This tool will return a general summary of the homepage." },
    { key: "storyMaker", url: "/story-maker", active: path === "/story-maker", label: "Story Maker", howItWorks: getStoryMakerHowItWorks(), description: "You will create 3 characters and an optional scenario, then generate a short story with OpenAI, Google Gemini, and Anthropic's Claude playing each character." },
    { key: "decidedly", url: "/decidedly-choice-tool", active: path === "/decidedly-choice-tool", label: "Decidedly", howItWorks: getDifficultChoiceMakerHowItWorks(), description: "This tool will assist in making difficult and/or complex choices. " + (featureFlagShowBeta ? "" : "Coming Soon!"), isBeta: true}
  ];

  const handleSetIsLoading = (isLoading, type = "general", referrer = "referrer not set") => {
    console.log("handleSetIsLoading", isLoading, type, referrer);
    setIsLoading(isLoading);
  }


  const handleSetIsLambdaLoading = (isLoading, type = "", referrer = "referrer not set") => {
    console.log("handleSetIsLambdaLoading", isLoading, "lambda", referrer);
    if(isLoading){
      setIsLoading(false);
      setIsLambdaLoading(true);
    } else {
       setIsLambdaLoading(false);
    }
    
  }
  
  return (
    <>
      <LoadingModal isLoading={isLoading} type={""}/>
      <LoadingModal isLoading={isLambdaLoading} type={"lambda"}/>
      <Routes>
        <Route path="/" element={<Layout isLoading={isLoading} setIsLoading={handleSetIsLoading} pages={pages} showBeta={featureFlagShowBeta} devOnly={featureFlagDevOnly} />}>
          <Route index element={<WebpageSummaryTool setIsLoading={handleSetIsLambdaLoading}/>} />
          <Route path="story-maker" element={<StoryMaker setIsLoading={handleSetIsLambdaLoading}/>}  />
          <Route path="decidedly-choice-tool" element={<DifficultChoiceMaker setIsLoading={handleSetIsLambdaLoading}/>} />
        </Route>
      </Routes>
    </>
  );
}
export default App;