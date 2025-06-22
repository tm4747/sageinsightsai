// src/Layout.js
import React, {useState, useEffect, useRef} from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AILogo from './components/AILogo';
import LoadingModal from "./components/LoadingModal";
import TypingText from './components/TypingText';
import BoxList from './components/BoxList';
import PageDescription from './components/simple/PageDescription';
import ShowHowItWorksTextAndIcon from './components/simple/ShowHowItWorksTextAndIcon';
import { removeNonAlphanumericMultispace } from './lib/ValidationHelper';
import FlashingText from './components/FlashingText';
import { useViewportWidth } from './lib/Utilities';
import styles from "./styles/Layout.module.css";


const Layout = ({isLoading, pages, showBeta, devOnly}) => {
  const location = useLocation();
  const [begun, setBegun] = useState(false);
  const [fadeClass, setFadeClass] = useState("fade-wrapper");
  // TEST - remove test input 2 fields
  const [userName, setUserName] = useState(devOnly ? "Tom" : "");
  const [validUserNameSubmitted, setValidUserNameSubmitted] = useState(devOnly);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHowItWorksBoxList, setShowHowItWorksBoxList] = useState(false);
  const pageBodyRef = useRef(null); 
  const [headerHeight, setHeaderHeight] = useState("100vh");
  const headerContentRef = useRef();
  const [bodyTopOffset, setBodyTopOffset] = useState(100);
  const viewportWidth = useViewportWidth();
 


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

  useEffect(() => {
    if (begun && headerContentRef.current) {
      // Measure the content height and animate to it
      const contentHeight = headerContentRef.current.scrollHeight;
      setHeaderHeight(`${contentHeight}px`);
      setBodyTopOffset(`${contentHeight + 25}px`);
    } else {
      // Full screen when not begun
      setHeaderHeight("100vh");
    }
  }, [begun]);

  /*** UPDATE BODY CONTENT OFFSET WHEN VIEWPORT CHANGES */
  useEffect(() => {
    if (begun && headerContentRef.current) {
      // Measure the content height and animate to it
      const contentHeight = headerContentRef.current.scrollHeight;
      setHeaderHeight(`${contentHeight}px`);
      setBodyTopOffset(`${contentHeight + 25}px`);
    } else {
      // Full screen when not begun
      setHeaderHeight("100vh");
    }
  }, [viewportWidth, begun]);

  /******* JAVASCRIPT HELPERS *********/
  const activePage = pages.find(page => page.active);
  const howItWorksData = activePage.howItWorks;
  const pageDescText = activePage.description;
  const activeLinkText = activePage?.label;
  const isBeta = activePage?.isBeta;
  const hideContentBeginButton = isBeta && !showBeta;


  const toggleMenu = () => {
    setBegun(false);
    setMenuOpen(prev => !prev);
  }

  const scrollToPageBody = () => {
    setTimeout(() => {
      pageBodyRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }

  const handleUpdateName = (e) => {
    const sanitizedName = removeNonAlphanumericMultispace(e.target.value);
    setUserName(sanitizedName);
  }

  const handleSubmitName = () => {
    setUserName(userName.trim());
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
  const pageTitle = !begun ? 
    <h2 className={styles.pageTitle}>
      <AILogo size={".75em"} />
      <TypingText
        baseText={" Hello " + userName + " "}
        text={"Welcome to Sage Insights AI!"}
        flashingText={"_ "}
      />
    </h2> : "";
  const nav = (
    <>
      {/* Desktop Nav */}
      <nav className={`${styles.theNav} ${styles.desktopNav}`}>
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
      <div className={styles.mobileNav}>
        <span className="bold">{activeLinkText} </span> <button className={styles.hamburger} onClick={toggleMenu}>
          ☰
        </button>
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {pages.map(page => (
            <Link
              key={page.key}
              className={`${styles.mobileLink} ${page.active ? 'activeLink' : ''}`}
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
  const howAppWorksExpandable = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showHowItWorksBoxList} setShowBoxList={setShowHowItWorksBoxList} showCloseButton={true}/>);
  const descriptionOfPageFunction = !begun ? <>
    <PageDescription text={pageDescText} /> 
  </> : "";


  /**** RETURN INPUT TO ENTER USERNAME IF NOT ENTERED ****/
  if(!validUserNameSubmitted){
    return(
      <div className="layout">
        <main>
          <div className={styles.app}>
            <header className={styles.appHeader} style={{ height: headerHeight, alignItems: "center" }}>
              <h3 className={"pageTitle"}>
              <AILogo size={".75em"}/>
                <TypingText text={"Please enter your name"} flashingText={"_ "} headerSize={"small"}/>
              </h3>
              <input type="text-input" className={nameInputClasses} value={userName}
              onChange={handleUpdateName} style={{maxWidth: "400px", color:"white", paddingLeft:".5rem"}}/>
              {nameErrorText}
              <FlashingText text={userName} blockDisplay={true}/>
              <button className={"button green-button"} onClick={handleSubmitName} value={"Submit"} style={{margin:0, marginTop:'2rem', width:"100%",maxWidth: "400px"}}>Submit</button>
          </header>
          </div>
        </main>
      </div>
    );
  }
  const beginButton = !begun && !hideContentBeginButton ? <button className={"button green-button margin-top"} onClick={handleBegin}>Begin!</button> : "";

  /**** HAVE USERNAME - RETURN LAYOUT ****/
  return (
    <div className="layout" >
      <main>
        <div className={styles.app} >
          <header className={styles.appHeader} style={{ height: headerHeight }}>
            <div ref={headerContentRef}>
              {pageTitle}
              {nav}
              <div className={`pageDescription ${fadeClass}`}>
                {descriptionOfPageFunction}
                {beginButton}
              </div>
            </div>
          </header>
          <section className={"appBody"} ref={pageBodyRef} style={{paddingTop: bodyTopOffset}}>
            <div className={fadeClass}>
              {begun ? 
                <>
                  <div className={"commonDiv noPadding borderBottomGray"}>
                    <ShowHowItWorksTextAndIcon onClickFn={handleShowHowItWorks} />
                    {howAppWorksExpandable}
                  </div>
                  <Outlet />
                </> : ""} {/* This renders the current child route */}
            </div>
          </section>
          <LoadingModal isLoading={isLoading}/>
        </div>
      </main>
    </div>
  );
}
export default Layout;
