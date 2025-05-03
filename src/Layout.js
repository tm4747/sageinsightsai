// src/components/Layout.js
import { Outlet, Link } from 'react-router-dom';
import './Layout.css'; // optional styling
import AILogo from './components/AILogo';
import Modal from "./components/Modal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {

  const nav = (<nav className={"theNav"}>
    <Link to="/">Home Page Summary</Link> | <Link to="/story-maker">Story Maker</Link>
  </nav>);
  return (
    <div className="layout">
      <main>
      <div className="App">
        <header className="App-header">
          <h2 className={"pageTitle"}>
          <AILogo size={".75em"}/> &nbsp; 
            <TypingText text={"Welcome to Sage Insights AI!"} flashingText={" _ "}/>
          </h2>
          {nav}
          <section className="body">
            <Outlet /> {/* This renders the current child route */}
            </section>
          </header>
          <Modal isLoading={isLoading}/>
        </div>
      </main>
    </div>
  );
}
export default Layout;