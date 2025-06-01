import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import WebpageSummaryTool from './pages/WebpageSummaryTool';
import StoryMaker from './pages/StoryMaker';
import DifficultChoiceMaker from './pages/DifficultChoiceMaker';

function App() {
    const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Routes>
      <Route path="/" element={<Layout isLoading={isLoading} />}>
        <Route index element={<StoryMaker setIsLoading={setIsLoading}/>}  />
        <Route path="web-summary" element={<WebpageSummaryTool setIsLoading={setIsLoading}/>} />
        <Route path="difficult-choice-helper" element={<DifficultChoiceMaker setIsLoading={setIsLoading}/>} />
      </Route>
    </Routes>
  );
}
export default App;