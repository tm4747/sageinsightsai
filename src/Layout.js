// src/components/Layout.js
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // optional styling

const Layout = () => {
  return (
    <div className="layout">
      <nav>
        <Link to="/">Home Page Summary</Link> | <Link to="/story-maker">Story Maker</Link>
      </nav>
      <main>
        <Outlet /> {/* This renders the current child route */}
      </main>
    </div>
  );
}
export default Layout;