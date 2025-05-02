import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import HomeSummaryTool from './pages/HomeSummaryTool';
// import AnotherTool from './pages/AnotherTool';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeSummaryTool />} />
        {/* <Route path="other" element={<AnotherTool />} /> */}
      </Route>
    </Routes>
  );
}
export default App;