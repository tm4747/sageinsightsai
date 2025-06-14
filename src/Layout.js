// src/Layout.js
import React, {useState} from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import LoadingModal from "./components/LoadingModal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {
  const location = useLocation();
  const path = location.pathname;
  const [userName, setUserName] = useState("");
  const [validUserNameSubmitted, setValidUserNameSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);


  const linkData = [
    { path: '/', label: 'Web Summary' },
    { path: '/story-maker', label: 'Story Maker' },
    { path: '/decidedly-choice-tool', label: 'Decidedly' },
  ];
  

  const nav = (
    <>
      {/* Desktop Nav */}
      <nav className="theNav desktop-nav">
        {linkData.map((link, index) => (
          <React.Fragment key={link.path}>
            {index > 0 && <span>&nbsp;|&nbsp;</span>}
            <Link
              className={path === link.path ? 'activeLink' : ''}
              to={link.path}
            >
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile Hamburger */}
<div className="mobile-nav">
  link data for path <button className="hamburger" onClick={toggleMenu}>
     ☰
  </button>
  <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
    {linkData.map(link => (
      <Link
        key={link.path}
        className={`mobile-link ${path === link.path ? 'activeLink' : ''}`}
        to={link.path}
        onClick={() => setMenuOpen(false)}
      >
        {link.label}
      </Link>
    ))}
  </div>
</div>

    </>
  );



const handleUpdateName = () => {
  if(userName && userName.length > 1){
      console.log('good user name');
      setNameErrorMessage("");
      setNameError(false);
      setValidUserNameSubmitted(true);
    } else {
      console.log('bad user name');
      setNameErrorMessage("* Entered name must be at least 2 characters.");
      setNameError(true);
    }
  }
  const nameErrorText = nameError ? <p className={"small-text notice error"}>{nameErrorMessage}</p> : "";
  const nameInputClasses = nameError ? `text-input red-border` : `text-input`;

  if(!validUserNameSubmitted){
    return(<div className="layout">
      <main>
        <div className="App">
          <header className="App-header">
            <h3 className={"pageTitle"}>
            <AILogo size={".75em"}/>
              <TypingText text={"Please enter your name"} flashingText={"_ "} headerSize={"small"}/>
            </h3>
            <input type="text" className={nameInputClasses} value={userName}
            onChange={(e) => setUserName(e.target.value)} style={{maxWidth: "400px"}}/>
            {nameErrorText}
            <button className={"button green-button"} onClick={handleUpdateName} value={"Submit"} style={{margin:0, marginTop:'2rem', width:"100%",maxWidth: "400px"}}>Submit</button>
         </header>
        </div>
      </main>
    </div>);
  }

  return (
    <div className="layout">
      <main>
        <div className="App">
          <header className="App-header">
            <h2 className={"pageTitle"}>
            <AILogo size={".75em"}/>
              <TypingText baseText={" Hello " + userName + " "} text={"Welcome to Sage Insights AI!"} flashingText={"_ "}/>
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