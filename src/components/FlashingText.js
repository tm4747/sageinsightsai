import { useState, useEffect } from 'react';

const FlashingText = ({ text, interval = 750, htmlEntities = false, blockDisplay = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  const fadeStyles = {
    fadeIn: {
      opacity: 1,
      transition: 'opacity ' + interval + 'ms ease-in-out',
      marginBottom:0
    },
    fadeOut: {
      opacity: 0.25,
      transition: 'opacity ' + interval + 'ms ease-in-out',
      marginBottom:0
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
  } else if(blockDisplay) {
    return (
      <p style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}>
        {text}
      </p>
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
