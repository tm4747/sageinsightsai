import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import HomeSummaryTool from './pages/HomeSummaryTool';
import StoryMaker from './pages/StoryMaker';

function App() {
    const [isLoading, setIsLoading] = useState(false);
  
  return (
    <Routes>
      <Route path="/" element={<Layout isLoading={isLoading} />}>
        <Route index element={<HomeSummaryTool setIsLoading={setIsLoading}/>} />
        <Route path="story-maker" element={<StoryMaker setIsLoading={setIsLoading}/>}  />
      </Route>
    </Routes>
  );
}
export default App;