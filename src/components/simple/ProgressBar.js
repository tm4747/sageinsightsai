import React from 'react';
import './styles/ProgressBar.css'; // if you prefer external styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const ProgressBar = ({ totalStages = 4, currentStage = 0 }) => {

  const iconSize = "1.5rem";
  const steps = Array.from({ length: totalStages }, (_, i) => ({
    label: `Step ${i + 1}`,
    index: i
  }));

  const getStepClass = (index) => {
    if (currentStage === 'complete' || index < currentStage) {
      return `progress__step progress__step--${index + 1} progress__step--complete`;
    }
    if (index === currentStage) {
      return `progress__step progress__step--${index + 1} progress__step--active`;
    }
    return `progress__step progress__step--${index + 1}`;
  };

  return (
    <div className="progress-container">
      <div className="progress__bg"></div>
      {steps.map((step) => (
        <div className={getStepClass(step.index)} key={step.index}>
          <div className="progress__indicator">
            <FontAwesomeIcon 
                style={{height: iconSize, alignSelf:"center", color:"green"}}
                className={"green-flashing-icon rounded-icon fa fa-check"}
                icon={faCircleCheck} 
                title={"progress"}
            />
            {/* <i className="fa fa-check"></i> */}
          </div>
          <div className="progress__label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
