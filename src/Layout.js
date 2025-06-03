// src/components/Layout.js
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import LoadingModal from "./components/LoadingModal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {
  const location = useLocation();
  const path = location.pathname;

  const linkData = [
    { path: '/', label: 'Story Maker' },
    { path: '/web-summary', label: 'Web Page Summary' },
    { path: '/difficult-choice-helper', label: 'Difficult Choice Helper' },
  ];

  const nav = (<nav className="theNav">
    {linkData.map((link, index) => (
      <React.Fragment key={link.path}>
        {/* If it's not the first link, display separator */}
        {index > 0 && <span>&nbsp;|&nbsp;</span>}
        
        <Link
          className={path === link.path ? 'activeLink' : ''}
          to={link.path}
        >
          {link.label}
        </Link>
      </React.Fragment>
    ))}
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
          <LoadingModal isLoading={isLoading}/>
        </div>
      </main>
    </div>
  );
}
export default Layout;