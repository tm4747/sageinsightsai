import { useState, useEffect } from 'react';

const FlashingText = ({ text, interval = 750, htmlEntities = false, blockDisplay = false, boldText = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const classes = boldText ? "bold" : "";

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
        className={classes}
        style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}
        dangerouslySetInnerHTML={{ __html: text }} // Render HTML content
      />
    );
  } else if(blockDisplay) {
    return (
      <p className={classes} style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}>
        {text}
      </p>
    );
  } else {
    return (
      <span className={classes} style={isVisible ? fadeStyles.fadeIn : fadeStyles.fadeOut}>
        {text}
      </span>
    );
  }
};

export default FlashingText;
