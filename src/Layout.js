// src/Layout.js
import React, {useState, useEffect, useRef} from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import LoadingModal from "./components/LoadingModal";
import TypingText from './components/TypingText';
import BoxList from './components/BoxList';
import PageDescription from './components/PageDescription';


const Layout = ({isLoading, pages, featureFlagShowBeta}) => {
  const location = useLocation();
  const [begun, setBegun] = useState(false);
  const [fadeClass, setFadeClass] = useState("fade-wrapper");
  const [userName, setUserName] = useState("test - remove and set NL false");
  const [validUserNameSubmitted, setValidUserNameSubmitted] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHowItWorksBoxList, setShowHowItWorksBoxList] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const pageBodyRef = useRef(null); 


  /***** USE EFFECTS  ******/
  useEffect(() => {
    setFadeClass("fade-enter"); // Start at opacity 0
    setBegun(false);
    const timeout = setTimeout(() => {
       // Force reflow before setting class to trigger transition
      setFadeClass("fade-wrapper"); // triggers fade-in animation
    }, 200); // Small delay to trigger CSS transition
    return () => clearTimeout(timeout);
  }, [location.pathname]);


  /******* JAVASCRIPT HELPERS *********/
  const activePage = pages.find(page => page.active);
  const howItWorksData = activePage.howItWorks;
  const pageDescText = activePage.description;
  const activeLinkText = activePage?.label;
  const isBeta = activePage?.isBeta;
  const hideContentBeginButton = isBeta && !featureFlagShowBeta;

  const scrollToPageBody = () => {
    setTimeout(() => {
      pageBodyRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }

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

  const handleShowHowItWorks = () => {
    setShowHowItWorksBoxList(!showHowItWorksBoxList);
  }

  const handleBegin = () => {
    setBegun(true);
    setShowHowItWorksBoxList(false);
    scrollToPageBody();
  }


  /******** DISPLAY FUNCTIONS **********/
  const nav = (
    <>
      {/* Desktop Nav */}
      <nav className="theNav desktop-nav">
        {pages.map((page, index) => (
          <React.Fragment key={page.key}>
            {index > 0 && <span>&nbsp;|&nbsp;</span>}
            <Link
              className={page.active ? 'activeLink' : ''}
              to={page.url}
            >
              {page.label}
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
          {pages.map(page => (
            <Link
              key={page.key}
              className={`mobile-link ${page.active ? 'activeLink' : ''}`}
              to={page.url}
              onClick={() => setMenuOpen(false)}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  const nameErrorText = nameError ? <p className={"small-text notice error"}>{nameErrorMessage}</p> : "";
  const nameInputClasses = nameError ? `text-input red-border` : `text-input`;
  const howAppWorks = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showHowItWorksBoxList} setShowBoxList={setShowHowItWorksBoxList} showCloseButton={true}/>);
  const descriptionOfPageFunction = <PageDescription onClickFn={handleShowHowItWorks} text={pageDescText} />


  /**** RETURN INPUT TO ENTER USERNAME IF NOT ENTERED ****/
  if(!validUserNameSubmitted){
    return(
      <div className="layout">
        <main>
          <div className="app">
            <header className="app-header">
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
  const beginButton = !begun && !hideContentBeginButton ? <button className={"button green-button margin-top"} onClick={handleBegin}>Begin!</button> : "";

  /**** HAVE USERNAME - RETURN LAYOUT ****/
  return (
    <div className="layout">
      <main>
        <div className="app">
          <header className={`app-header ${!begun ? "full-viewport-height" : ""}`}>
            <h2 className={"pageTitle"}>
            <AILogo size={".75em"}/>
              <TypingText baseText={" Hello " + userName + " "} text={"Welcome to Sage Insights AI!"} flashingText={"_ "}/>
            </h2>
            {nav}
            <div className={`pageDescription ${fadeClass}`}> 
              {descriptionOfPageFunction}
              {howAppWorks}
              {beginButton}
            </div>
         </header>
            <section className="body" ref={pageBodyRef} >
              <div className={fadeClass}>
                {begun ? <Outlet /> : ""} {/* This renders the current child route */}
              </div>
            </section>
          <LoadingModal isLoading={isLoading}/>
        </div>
      </main>
    </div>
  );
}
export default Layout;