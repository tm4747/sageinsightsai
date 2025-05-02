import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomeSummaryTool from './pages/HomeSummaryTool';
import StoryMaker from './pages/StoryMaker';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeSummaryTool testProp={"test"}/>} />
        <Route path="story-maker" element={<StoryMaker testProp={"test"} />}  />
      </Route>
    </Routes>
  );
}
export default App;