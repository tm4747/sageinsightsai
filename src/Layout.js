// src/components/Layout.js
import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css'; // optional styling
import AILogo from './components/AILogo';
import Modal from "./components/Modal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {
  const location = useLocation();
  const path = location.pathname;
  

  const nav = (<nav className={"theNav"}>
    <Link className={"/" === path ? "activeLink" : ""} to="/">Home Page Summary</Link> | <Link className={"/story-maker" === path ? "activeLink" : ""} to="/story-maker">Story Maker</Link>
    </nav>);
  return (
    <div className="layout">
      <main>
      <div className="App">
        <header className="App-header">
          <h2 className={"pageTitle"}>
          <AILogo size={".75em"}/> &nbsp; 
            <TypingText baseText={"Hello@User:~$"} text={"Welcome to Sage Insights AI!"} flashingText={" _ "}/>
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