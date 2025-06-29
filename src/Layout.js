// src/Layout.js
import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AILogo from './components/simple/AILogo';
import TypingText from './components/TypingText';
import BoxList from './components/BoxList';
import PageDescription from './components/simple/PageDescription';
import ShowHowItWorksTextAndIcon from './components/simple/ShowHowItWorksTextAndIcon';
import { removeNonAlphanumericMultispace } from './lib/ValidationHelper';
import FlashingText from './components/FlashingText';
import { useViewportWidth } from './lib/Utilities';
import styles from "./styles/Layout.module.css";
import ButtonControl from "./components/simple/ButtonControl";
import { v4 as uuidv4 } from 'uuid';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
import { insertUserName, getUserData } from './lib/AWSHelper';

const Layout = ({ setIsLoading, pages, showBeta, devOnly}) => {
  const location = useLocation();
  const [begun, setBegun] = useState(false);
  const [fadeClass, setFadeClass] = useState(styles.fadeWrapper);
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
  const env = process.env.REACT_APP_ENV || "dev"; // Set this in your .env file as dev, qa, or prod
  const uuidKey = `sage-insights-${env}-uuid`;
  const [uuid, setUuid] = useState(null);
  const [userFetchAttempted, setUserFetchAttempted] = useState(false);
  const [readyToSetLoading, setReadyToSetLoading] = useState(false);


  /***** USE EFFECTS  ******/
  /*** Load from the time the app loads until there is a uuid and dynamoDB has run.  */
  useEffect(() => {
    const timer = setTimeout(() => setReadyToSetLoading(true), 750);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (readyToSetLoading) {
      setIsLoading(!userFetchAttempted);
    }
  }, [userFetchAttempted, readyToSetLoading, setIsLoading]);


  // GET / STORE UUID
  useEffect(() => {
    let storedUuid = localStorage.getItem(uuidKey);
    if (!storedUuid) {
      storedUuid = uuidv4();
      localStorage.setItem(uuidKey, storedUuid);
    }
    setUuid(storedUuid);
  }, [uuidKey]);

  // FADE EFFECT FOR CHANGE OF PAGE (location.pathname)
  useEffect(() => {
    setFadeClass(styles.fadeEnter); // Start at opacity 0
    setBegun(false);
    const timeout = setTimeout(() => {
       // Force reflow before setting class to trigger transition
      setFadeClass(styles.fadeWrapper); // triggers fade-in animation
    }, 200); // Small delay to trigger CSS transition
    return () => clearTimeout(timeout);
  }, [location.pathname]);

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

  /*** DYNAMO DB UPDATES ***/
  const handleSubmitName = async () => {
    const trimmedName = userName.trim();
    setUserName(trimmedName);

    if(trimmedName.length > 1){
      setNameErrorMessage("");
      setNameError(false);

      // Call Lambda to create/update user
      // TODO: I don't know if there is a check whether or not record was inserted.  Prob insert here. 
      const data = await insertUserName(uuid, trimmedName);
      setValidUserNameSubmitted(true);
      console.log(data);
    } else {
      setNameErrorMessage("* Entered name must be at least 2 characters.");
      setNameError(true);
    }
  }

  // fetch user data IF uuid
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData(uuid);
      if (data?.name) {
        setUserName(data.name);
        setValidUserNameSubmitted(true);
      }
      setUserFetchAttempted(true);
    };
    if (uuid) {
      fetchUserData();
    }
  }, [uuid]);


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

  const handleShowHowItWorks = () => {
    setShowHowItWorksBoxList(!showHowItWorksBoxList);
  }

  const handleBegin = () => {
    setBegun(true);
    setShowHowItWorksBoxList(false);
    scrollToPageBody();
  }

  const handleCleanUpUserData = () => {
    localStorage.removeItem(uuidKey);
    setUuid(null); 
    setUserName("");
    setBegun(false);
    setValidUserNameSubmitted(false);
    const storedUuid = uuidv4();
    localStorage.setItem(uuidKey, storedUuid);
    setUuid(storedUuid);
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

  const nav = <Navigation pages={pages} activeLinkText={activeLinkText} toggleMenu={toggleMenu} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;
  const nameErrorText = nameError ? <p className={"small-text notice error"}>{nameErrorMessage}</p> : "";
  const nameInputClasses = nameError ? `text-input red-border` : `text-input`;
  const howAppWorksExpandable = (<BoxList title={"How it works:"} data={howItWorksData} showBoxList={showHowItWorksBoxList} setShowBoxList={setShowHowItWorksBoxList} showCloseButton={true}/>);
  const descriptionOfPageFunction = !begun ? <>
    <PageDescription text={pageDescText} /> 
  </> : "";

  const userData = userName && validUserNameSubmitted ? <>
    <UserProfile userName={userName} uuid={uuid} cleanUpUserData={handleCleanUpUserData} />
    {/* <div className={styles.userDataDiv}> {userName}</div> */}
  </> : "";

  const beginButtonDiv = !begun && !hideContentBeginButton ? 
    <div className={"commonDiv"}>
      <form id="beginForm" style={{width:"100%"}} onSubmit={(e) => {
          e.preventDefault(); // Prevent default form submission (like page reload)
          handleBegin();
        }}>
        <ButtonControl onPress={handleBegin} text={"Begin!"} variation={"submitRequest"} addedStyles={{maxWidth: "400px"}} type={"submit"}/>
      </form>
    </div> : "";


  /**** RETURN INPUT TO ENTER USERNAME IF NOT ENTERED ****/
  if(!validUserNameSubmitted){
    return(
      <div className="layout">
        <main>
          <div className={styles.app}>
            <header className={styles.appHeader} style={{ height: headerHeight, alignItems: "center" }}>
              {userData}
              <h3 className={"pageTitle"}>
              <AILogo size={".75em"}/>
                <TypingText text={"Please enter your name"} flashingText={"_ "} headerSize={"small"}/>
              </h3>
              <form id="enterNameForm" style={{width:"100%"}} onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission (like page reload)
                handleSubmitName();
              }}>
                <input 
                  name="name"  
                  type="text" 
                  className={nameInputClasses} 
                  value={userName}
                  onChange={handleUpdateName} 
                  style={{maxWidth: "400px", color:"white", paddingLeft:".5rem"}}
                  autoComplete="name"
                />
                {nameErrorText}
                <FlashingText text={userName} blockDisplay={true}/>              
                <div className={"commonDiv"} style={{width:"100%"}}>
                  <ButtonControl type={"submit"} onPress={handleSubmitName} text={"Submit"} variation={"submitRequest"} addedStyles={{maxWidth: "400px"}}/>
                </div>
              </form>
          </header>
          </div>
        </main>
      </div>
    );
  }

  /**** HAVE USERNAME - RETURN LAYOUT ****/
  return (
    <div className={styles.layoutDiv} >
      <main>
        <div className={styles.app} >
          <header 
            className={styles.appHeader} 
            style={{ height: headerHeight }} 
            tabIndex={0} // Make it focusable
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if(!begun && !hideContentBeginButton ){
                  handleBegin();
                }
              }
            }}>
            <div ref={headerContentRef}>
              {userData}
              {pageTitle}
              {nav}
              <div className={`pageDescription ${fadeClass}`}>
                {descriptionOfPageFunction}
                {beginButtonDiv}
              </div>
            </div>
          </header>
          <section className={styles.appBody} ref={pageBodyRef} style={{paddingTop: bodyTopOffset}}>
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
        </div>
      </main>
    </div>
  );
}
export default Layout;
