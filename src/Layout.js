// src/Layout.js
import React, {useState, useEffect} from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import LoadingModal from "./components/LoadingModal";
import TypingText from './components/TypingText';

const Layout = ({isLoading}) => {
  const location = useLocation();
  const path = location.pathname;
  const [fadeClass, setFadeClass] = useState("fade-wrapper");
  const [userName, setUserName] = useState("test - remove and set NL false");
  const [validUserNameSubmitted, setValidUserNameSubmitted] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);


  /***** USE EFFECTS  ******/
  useEffect(() => {
    setFadeClass("fade-enter"); // Start at opacity 0

    const timeout = setTimeout(() => {
       // Force reflow before setting class to trigger transition
      setFadeClass("fade-wrapper"); // triggers fade-in animation
    }, 200); // Small delay to trigger CSS transition
    return () => clearTimeout(timeout);
  }, [location.pathname]);



  const linkData = [
    { path: '/', label: 'Web Summary', active: path === '/' },
    { path: '/story-maker', label: 'Story Maker', active: path === '/story-maker' },
    { path: '/decidedly-choice-tool', label: 'Decidedly', active: path === '/decidedly-choice-tool' },
  ];
  const activeLink = linkData.find(link => link.active);
  const activeLinkText = activeLink?.label;


  const nav = (
    <>
      {/* Desktop Nav */}
      <nav className="theNav desktop-nav">
        {linkData.map((link, index) => (
          <React.Fragment key={link.path}>
            {index > 0 && <span>&nbsp;|&nbsp;</span>}
            <Link
              className={link.active ? 'activeLink' : ''}
              to={link.path}
            >
              {link.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Mobile Hamburger */}
<div className="mobile-nav">
  <span className="bold">{activeLinkText} </span> <button className="hamburger" onClick={toggleMenu}>
     ☰
  </button>
  <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
    {linkData.map(link => (
      <Link
        key={link.path}
        className={`mobile-link ${link.active ? 'activeLink' : ''}`}
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
    return(
      <div className="layout">
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
      </div>
    );
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
              <div className={fadeClass}>
                <Outlet /> {/* This renders the current child route */}
              </div>
            </section>
         </header>
          <LoadingModal isLoading={isLoading}/>
        </div>
      </main>
    </div>
  );
}
export default Layout;