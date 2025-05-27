import React, { useState, useEffect } from 'react';

const FlashingText = ({ text, interval = 750, htmlEntities = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(!isVisible);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isVisible]);

  if(htmlEntities){
    return (
      <span
        className={isVisible ? 'fade-in' : 'fade-out'}
        dangerouslySetInnerHTML={{ __html: text }} // Render HTML content
      />
    );
  } else {
    return <span className={isVisible ? 'fade-in' : 'fade-out' }>{text}</span>;
  }
}

export default FlashingText;