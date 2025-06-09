import React, { useState } from 'react';
import styles from "./styles/InputModal.module.css"

const InputModal = ({ isOpen, onSubmit, onClose, formTitle = "Enter Details", formDescription = "", showSlider = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(5);
  // TODO: work on error next
  const [nameError, setNameError] = useState(false);

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
        onSubmit({ name, description, value });
        setName('');
        setDescription('');
        setValue(1);
    } else {
      setNameError(true);
    }
  };

  /******** DISPLAY FUNCTIONS & VARS *********/
  const descriptionText = formDescription ? <p className={"small-text"}>{formDescription}</p> : "";
  const doneButton = <button className={"button red-button"} onClick={onClose} style={{ marginRight: '1rem', width:'50%' }}>Done</button>;
  const submitButton = <button className={"button green-button"} onClick={handleSubmit} style={{ width:'50%' }}>Add Criteria</button>
  const sliderDiv = showSlider ? <div>
          <label htmlFor="slider">How important is this criteria: {value}</label>
          <input id="slider" type="range" min="1" max="10" value={value}
            onChange={(e) => setValue(parseInt(e.target.value))} className={`margin-bottom ${styles.slider}`} />
        </div> : "";
  const nameInputClasses = nameError ? `text-input ${styles.textInput} red-border` : `text-input ${styles.textInput}`;
  const nameErrorText = nameError ? <p className={"small-text error"}>* Entered name must be at least 3 characters.</p> : "";

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
          <label>Name:</label><br />
          <input type="text" className={nameInputClasses} value={name}
            onChange={(e) => handleUpdateName(e.target.value)} />
          {nameErrorText}
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
