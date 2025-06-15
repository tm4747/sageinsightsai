import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import WebpageSummaryTool from './pages/WebpageSummaryTool';
import StoryMaker from './pages/StoryMaker';
import DifficultChoiceMaker from './pages/DifficultChoiceMaker';

function App() {
  // TODO: move routes into array here and pass into layout
    const [isLoading, setIsLoading] = useState(false);
    const pages = {
      webSummary: { url: "/", label: "Web Summary", description: "Please enter a website url. This tool will return a general summary of the homepage:" },
      storyMaker: { url: "/story-maker", label: "Story Maker", description: "You will create 3 characters and an optional scenario, then generate a short story with OpenAI, Google Gemini, and Anthropic's Claude playing each character." },
      decidedly: { url: "/decidedly-choice-tool", label: "Decidedly", description: "This tool will assist in making difficult and/or complex choices: COMING SOON" }
    }
  
  return (
    <Routes>
      <Route path="/" element={<Layout isLoading={isLoading} pages={pages} />}>
        <Route index element={<WebpageSummaryTool setIsLoading={setIsLoading}/>} />
        <Route path="story-maker" element={<StoryMaker setIsLoading={setIsLoading}/>}  />
        <Route path="decidedly-choice-tool" element={<DifficultChoiceMaker setIsLoading={setIsLoading}/>} />
      </Route>
    </Routes>
  );
}
export default App;