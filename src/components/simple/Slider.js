import { useState, useEffect } from 'react';

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

    const span1Classes = (level >= 1 ? 'visible' : 'hidden');
    const span2Classes = (level >= 2 ? 'visible' : 'hidden');
    const span3Classes = (level >= 3 ? 'visible' : 'hidden');

    return (
      <span className="realismText" style={{ position: 'relative', display: 'inline-block' }}>
        <span className={span1Classes}>{span1Text}</span>
        <span className={span2Classes}>{span2Text}</span>
        <span className={span3Classes}>{span3Text}</span>
        <span className={showEdgy ? 'hide hidden' : 'hidden'}>{hiddenEdgySpanText}</span>
      </span>
    );
  };


  return (
    <div className={"sliderDiv"}>
      <p className={"displayNoneSm"}></p>
      <label className={"sliderLabel"} htmlFor="slider">{label}</label>
      <input
        type="range"
        id="slider"
        min="1"
        max="3"
        step="1"
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <p className={"bold"}
        key={transitionKey} // Force re-render on value change for transition effect
        style={{
          opacity: 0,
          animation: 'fadeIn 0.5s forwards', // Smooth fade-in transition
        }}
      >
        {transformRealismLevel(sliderValue)}
      </p>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Slider;
