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
  const [loadingModalType, setLoadingModalType] = useState("");
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

  const handleSetIsLoading = (isLoading, type = "") => {
    if(type){
      setLoadingModalType(type);
    }
    setIsLoading(isLoading);
  }
  
  return (
    <>
      <LoadingModal isLoading={isLoading} type={loadingModalType}/>
      <Routes>
        <Route path="/" element={<Layout isLoading={isLoading} setIsLoading={handleSetIsLoading} pages={pages} showBeta={featureFlagShowBeta} devOnly={featureFlagDevOnly} />}>
          <Route index element={<WebpageSummaryTool setIsLoading={handleSetIsLoading}/>} />
          <Route path="story-maker" element={<StoryMaker setIsLoading={handleSetIsLoading}/>}  />
          <Route path="decidedly-choice-tool" element={<DifficultChoiceMaker setIsLoading={handleSetIsLoading} featureFlagShowBeta={featureFlagShowBeta}/>} />
        </Route>
      </Routes>
    </>
  );
}
export default App;