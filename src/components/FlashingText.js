import React, { useState, useEffect } from 'react';

const FlashingText = ({ text, interval = 750, htmlEntities = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  const fadeStyles = {
    fadeIn: {
      opacity: 1,
      transition: 'opacity ' + interval + 'ms ease-in-out',
    },
    fadeOut: {
      opacity: 0.25,
      transition: 'opacity ' + interval + 'ms ease-in-out',
    },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(!isVisible);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, isVisible]);

  if (htmlEntities) {
    return (
      <span
        style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}
        dangerouslySetInnerHTML={{ __html: text }} // Render HTML content
      />
    );
  } else {
    return (
      <span style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}>
        {text}
      </span>
    );
  }
};

export default FlashingText;
