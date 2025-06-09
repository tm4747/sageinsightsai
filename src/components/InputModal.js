import React, { useState } from 'react';
import styles from "./styles/InputModal.module.css"

const InputModal = ({ isOpen, onSubmit, onClose, formTitle = "Enter Details", field1Name = "name", formDescription = "", showSlider = false, sliderTitle = "How important:" }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sliderValue, setSliderValue] = useState(5);
  const [showAdded, setShowAdded] = useState(false);
  // TODO: work on error next
  const [nameError, setNameError] = useState(false);


  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const field1NameToUpper = capitalizeFirstLetter(field1Name);

  const isValidName = (name) => {
    return name && name.length > 2;
  }

  const handleUpdateName = (value) => {
    let name = value.trim();
    if(isValidName(name)){
        setNameError(false);
    }
    setName(name);
  }

  const handleSubmit = () => {
    // todo: validate name
    if(name && isValidName(name)){
        setNameError(false);
        onSubmit({ name, description, sliderValue });
        setName('');
        setDescription('');
        setSliderValue(5);
        setShowAdded(true);
        setTimeout(() => {
          setShowAdded(false);
        }, 2000);
    } else {
      setNameError(true);
    }
  };


  /******** DISPLAY FUNCTIONS & VARS *********/
  const descriptionText = formDescription ? <p className={"small-text"}>{formDescription}</p> : "";
  const doneButton = <button className={"button red-button"} onClick={onClose} style={{ marginRight: '1rem', width:'50%' }}>Done</button>;
  const submitButton = <button className={"button green-button"} onClick={handleSubmit} style={{ width:'50%' }}>Add {field1NameToUpper}</button>
  const sliderDiv = showSlider ? <div>
          <label htmlFor="slider">{sliderTitle} {sliderValue}</label>
          <input id="slider" type="range" min="1" max="10" value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))} className={`margin-bottom ${styles.slider}`} />
        </div> : "";
  const nameInputClasses = nameError ? `text-input ${styles.textInput} red-border` : `text-input ${styles.textInput}`;
  const nameErrorText = nameError ? <p className={"small-text notice error"}>* Entered {field1Name} must be at least 3 characters.</p> : "";
  const valueAddedText = showAdded ? <p className={"small-text notice success"}>{field1Name} has been added!</p> : "";

  
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
