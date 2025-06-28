import { useState } from 'react';
import styles from "./styles/InputModal.module.css";
import ButtonControl from '../simple/ButtonControl';

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  formTitle = "Enter Details", 
  formDescription = "", 
}) => {
    const [showSettingChanged, setShowSettingChanged] = useState(false);

  /******* JAVASCRIPT HELPERS *******/
  const handleOnClose = () => {
    onClose();
  }

  const handleUpdateSetting1 = (value) => {
    console.log(value)
  }


  const handleSubmit = () => {
    console.log("hey")
  }

  /******** DISPLAY FUNCTIONS & VARS *********/
  const descriptionText = formDescription ? <p className={"small-text"}>{formDescription}</p> : "";
  const doneButton = <ButtonControl onPress={handleOnClose} text={"Done"} type={"resetButton"}/>;
  const submitButton = <ButtonControl onPress={handleSubmit} text={`Update setting`} type={"submitRequest"}/>;
  const settingUpdatedText = showSettingChanged ? <p className={"small-text notice success"}>Settings updated!</p> : "";

  
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
          <label>setting1:</label><br />
          <input type="text" className={""} value={""}
            onChange={(e) => handleUpdateSetting1(e.target.value)} />
          {settingUpdatedText}
        </div>
        <div className={"button-row"}>
          {doneButton}
          {submitButton}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
