import React, { useState, useEffect } from 'react';

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
    const edgyText = showEdgy ? " and Edgy" : "";
    return level === 1
      ? "Realistic " + edgyText
      : level === 2
      ?  ( showEdgy ? "Realistic, Somewhat Fantastic"  + edgyText : "Realistic and Somewhat Fantastic")
      : ( showEdgy ? "Realistic, Somewhat Fantastic, Outlandish" + edgyText : "Realistic, Somewhat Fantastic and Outlandish");
  };

  return (
    <div>
      <label htmlFor="slider">{label}</label>
      <input
        type="range"
        id="slider"
        min="1"
        max="3"
        step="1"
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <p
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
