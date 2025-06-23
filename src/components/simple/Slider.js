import { useState, useEffect } from 'react';
import styles from "./styles/Slider.module.css";

const Slider = ({ setValue, initialValue, showEdgy, label }) => {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [transitionKey, setTransitionKey] = useState(Date.now()); // Key to force re-render for transition effect

  useEffect(() => {
    setSliderValue(initialValue); // Sync the initial value with the prop if it changes
  }, [initialValue]);

  const handleSliderChange = (event) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue); // Update the value when the slider changes
    setValue(newValue); // Call the parent function to update its state
    setTransitionKey(Date.now()); // Trigger a new transition on value change
  };

  const transformRealismLevel = (level) => {
    const span1Text = showEdgy && level === 1 ? "Realistic and Edgy" : "Realistic";
    const span2Text = showEdgy && level === 2 ? " - Somewhat Fantastic and Edgy" : " - Somewhat Fantastic";
    const span3Text = showEdgy && level === 3 ? " - Outlandish and Edgy" : " - Outlandish";
    const hiddenEdgySpanText = " and Edgy";

    const span1Classes = `${styles.realismTextSpan} ${(level >= 1 ? styles.realismTextVisible : styles.realismTextHidden)}`;
    const span2Classes = `${styles.realismTextSpan} ${(level >= 2 ? styles.realismTextVisible : styles.realismTextHidden)}`;
    const span3Classes = `${styles.realismTextSpan} ${(level >= 3 ? styles.realismTextVisible : styles.realismTextHidden)}`;

    return (
      <span className={styles.realismText}>
        <span className={span1Classes}>{span1Text}</span>
        <span className={span2Classes}>{span2Text}</span>
        <span className={span3Classes}>{span3Text}</span>
        <span className={showEdgy ? `hide ${styles.realismTextHidden}` : styles.realismTextHidden}>{hiddenEdgySpanText}</span>
      </span>
    );
  };


  return (
    <div className={styles.sliderDiv}>
      <p className={"displayNoneSm"}></p>
      <label className={styles.sliderLabel} htmlFor="slider">{label}</label>
      <input
        type="range"
        id="slider"
        min="1"
        max="3"
        step="1"
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <p className={styles.sliderResults}
        key={transitionKey} // Force re-render on value change for transition effect
      >
        {transformRealismLevel(sliderValue)}
      </p>
    </div>
  );
};

export default Slider;
