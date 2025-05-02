import { Routes, Route, Link} from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import HomeSummaryTool from './pages/HomeSummaryTool';
import StoryMaker from './pages/StoryMaker';

function App() {
  const nav = (<nav className={"theNav"}>
    <Link to="/">Home Page Summary</Link> | <Link to="/story-maker">Story Maker</Link>
  </nav>);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeSummaryTool theNav={nav}/>} />
        <Route path="story-maker" element={<StoryMaker theNav={nav} />}  />
      </Route>
    </Routes>
  );
}
export default App;