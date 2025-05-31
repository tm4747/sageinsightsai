// src/components/Layout.js
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import Modal from "./components/Modal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {
  const location = useLocation();
  const path = location.pathname;

  const nav = (<nav className={"theNav"}>
    <Link className={"/" === path ? "activeLink" : ""} to="/">Story Maker</Link>&nbsp;|&nbsp; 
    <Link className={"/web-summary" === path ? "activeLink" : ""} to="/web-summary">Home Page Summary</Link>
    </nav>);
  return (
    <div className="layout">
      <main>
      <div className="App">
        <header className="App-header">
          <h2 className={"pageTitle"}>
          <AILogo size={".75em"}/>
            <TypingText baseText={" Hello@User:~$"} text={"Welcome to Sage Insights AI!"} flashingText={"_ "}/>
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