import React, { useState, useEffect } from 'react';

const FlashingText = ({ text, interval = 750 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(!isVisible);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isVisible]);

  return <span className={isVisible ? 'fade-in' : 'fade-out' }>{text}</span>;
}

export default FlashingText;