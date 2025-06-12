import { useState } from 'react';
import styles from "./styles/InputModal.module.css"

const InputModal = ({ 
  isOpen, 
  onSubmit, 
  onClose, 
  currentItems,
  formTitle = "Enter Details", 
  field1Name = "name", 
  formDescription = "", 
  showSlider = false, 
  sliderTitle = "How important:",
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(5);
  const [showAdded, setShowAdded] = useState(false);
  const [showAddedText, setShowAddedText] = useState('');
  // TODO: work on error next
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');



  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const field1NameToUpper = capitalizeFirstLetter(field1Name);

  const isValidName = (name) => {
    let isValid = true;
    if(!(name && name.length > 2)){
      isValid = false;
      setNameErrorMessage("* Entered " + field1Name + " must be at least 3 characters.")
    }
    // if criteria - check criteria names 
    if(field1Name === "criterion"){
      if(currentItems && currentItems.length > 0){
        for(var x = 0; x < currentItems.length; x++){
          if(name === currentItems[x].name){
            isValid = false;
            setNameErrorMessage("* Entered " + field1Name + " must be unique.")
          }
        }
      }
    } else if(field1Name === "choice"){
      if(currentItems && currentItems.length > 0){
        const theseChoices = currentItems[0].choices;
        if(theseChoices && theseChoices.length > 0){
          for(var x = 0; x < theseChoices.length; x++){
            if(name === theseChoices[x].name){
              isValid = false;
              setNameErrorMessage("* Entered " + field1Name + " must be unique.")
            }
          }
        }
      }
    }
    if(isValid){
      setNameErrorMessage("");
    }
    return isValid;
  }


  /******* JAVASCRIPT HELPERS *******/
  const resetState = () => {
    setName('');
    setDescription('');
    setSliderValue(5);
  }

  const handleUpdateName = (value) => {
    if(isValidName(value)){
        setNameError(false);
    }
    setName(value);
  }

  const handleOnClose = () => {
    resetState();
    onClose();
  }

  const handleSubmit = () => {
    // todo: validate name & TRIM name
    if(name && isValidName(name)){
        setNameError(false);
        onSubmit({ name, description, sliderValue });
        setShowAddedText(name);
        setShowAdded(true);
        resetState();
        setTimeout(() => {
          setShowAdded(false);
          setShowAddedText('');
        }, 2000);
    } else {
      setNameError(true);
    }
  };



  /******** DISPLAY FUNCTIONS & VARS *********/
  const descriptionText = formDescription ? <p className={"small-text"}>{formDescription}</p> : "";
  const doneButton = <button className={"button red-button"} onClick={handleOnClose} style={{ marginRight: '1rem', width:'50%' }}>Done</button>;
  const submitButton = <button className={"button green-button"} onClick={handleSubmit} style={{ width:'50%' }}>Add {field1NameToUpper}</button>
  const sliderDiv = showSlider ? <div>
          <label htmlFor="slider">{sliderTitle} {sliderValue}</label>
          <input id="slider" type="range" min="1" max="10" value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))} className={`margin-bottom ${styles.slider}`} />
        </div> : "";
  const nameInputClasses = nameError ? `text-input ${styles.textInput} red-border` : `text-input ${styles.textInput}`;
  const nameErrorText = nameError ? <p className={"small-text notice error"}>{nameErrorMessage}</p> : "";
  const valueAddedText = showAdded ? <p className={"small-text notice success"}>{field1Name} {showAddedText} has been added!</p> : "";

  
  return (
    <div
      style={{
        opacity: isOpen ? 1 : 0,
        display: isOpen ? 'flex' : 'none',
      }}
      className={styles.modalBackground}
    >
      <div className={styles.modalDiv}>
        <h2 className={"margin-bottom"} >{formTitle}</h2>
        {descriptionText}
        <div className={"margin-bottom"}>
          <label>{field1NameToUpper}:</label><br />
          <input type="text" className={nameInputClasses} value={name}
            onChange={(e) => handleUpdateName(e.target.value)} />
          {nameErrorText}
          {valueAddedText}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label><br />
          <textarea className={`text-input ${styles.textInput}`} rows={3}
            value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        {sliderDiv}
        <div className={styles.buttonsDiv}>
          {doneButton}
          {submitButton}
        </div>
      </div>
    </div>
  );
};

export default InputModal;
