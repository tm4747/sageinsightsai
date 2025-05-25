import React, { useState, useEffect } from 'react';

const Slider = ({ setValue, initialValue }) => {
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
    return level === 1
      ? "Realistic"
      : level === 2
      ? "Somewhat fantastic"
      : "Outlandish and strange";
  };

  return (
    <div>
      <label htmlFor="slider">Set level of realism for character choices: </label>
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
